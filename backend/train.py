import pandas as pd
import numpy as np
from tqdm import tqdm

from collections import Counter
import re




import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords, wordnet
from nltk import pos_tag
from nltk.stem import WordNetLemmatizer
from sklearn.utils.class_weight import compute_sample_weight

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from textblob import TextBlob
import nltk
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')
# Load dataset
df = pd.read_csv("data/emotion_dataset_2.csv")

print("Class distribution:\n", df["emotion"].value_counts())
print("Dataset shape:", df.shape)

# Helper to convert POS tags
def get_wordnet_pos(tag):
    if tag.startswith("J"): return wordnet.ADJ
    elif tag.startswith("V"): return wordnet.VERB
    elif tag.startswith("N"): return wordnet.NOUN
    elif tag.startswith("R"): return wordnet.ADV
    else: return wordnet.NOUN

# Improved preprocessing function
def preprocess_text(text):
    # Lowercase
    text = text.lower()
    
    # Handle contractions more comprehensively
    contractions = {
        "n't": " not",
        "'re": " are",
        "'ve": " have",
        "'ll": " will",
        "'d": " would",
        "'m": " am"
    }
    for contraction, expansion in contractions.items():
        text = text.replace(contraction, expansion)
    
    # Remove URLs, mentions, hashtags
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'@\w+|#\w+', '', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def tokenize_and_lemmatize(text):
    # Remove punctuation but keep emoticons and important symbols
    text = re.sub(r'[^\w\s!?.:;]', '', text)
  
    # Tokenize
    tokens = word_tokenize(text)

    
    # Remove stopwords but keep negation words
    
    stop_words = set(stopwords.words("english"))
    # Keep important words for emotion detection
    keep_words = {'not', 'no', 'never', 'nothing', 'nobody', 'neither', 'nowhere', 'none'}
    stop_words = stop_words - keep_words
    
    tokens = [t for t in tokens if t not in stop_words and len(t) > 2]
    
    # POS tagging
    tagged = pos_tag(tokens)
    
    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    lemmatized = [lemmatizer.lemmatize(w, get_wordnet_pos(pos)) for w, pos in tagged]
    print(lemmatizer.lemmatize('running', wordnet.VERB)) # Output: 'run'
   
    return lemmatized
   

# Feature engineering functions
# def extract_features(text):
#     """Extract various features from text"""
#     features = {}
    
#     # Basic text statistics
#     features['text_length'] = len(text)
#     features['word_count'] = len(text.split())
#     features['sentence_count'] = len(text.split('.'))
#     features['avg_word_length'] = np.mean([len(word) for word in text.split()])
    
#     # Punctuation features
#     features['exclamation_count'] = text.count('!')
#     features['question_count'] = text.count('?')
#     features['caps_ratio'] = sum(1 for c in text if c.isupper()) / max(len(text), 1)
    
#     # Sentiment features using TextBlob
#     blob = TextBlob(text)
#     features['polarity'] = blob.sentiment.polarity
#     features['subjectivity'] = blob.sentiment.subjectivity
    
#     # Negation features
#     negation_words = ['not', 'no', 'never', 'nothing', 'nobody', 'neither', 'nowhere', 'none']
#     features['negation_count'] = sum(1 for word in text.lower().split() if word in negation_words)
    
#     return features

# Apply preprocessing
print("Preprocessing text...")
tqdm.pandas()
df["cleaned_text"] = df["text"].progress_apply(preprocess_text)
df["tokens"] = df["cleaned_text"].progress_apply(tokenize_and_lemmatize)

# Extract additional features
# print("Extracting features...")
# feature_dicts = df["cleaned_text"].progress_apply(extract_features)
# feature_df = pd.DataFrame(list(feature_dicts))

print("Processing tokens...")
all_tokens = [token for tokens in df["tokens"] for token in tokens]
freq = Counter(all_tokens)

# Only remove very rare words (appearing less than 3 times) and very common words (top 10)
rare_words = {w for w, c in freq.items() if c < 3}
common_words = {w for w, c in freq.most_common(10)}

def filter_tokens(tokens):
    return [w for w in tokens if w not in rare_words and w not in common_words]

df["filtered_tokens"] = df["tokens"].apply(filter_tokens) #filter out rare and common words

df["processed_text"] = df["filtered_tokens"].apply(lambda x: ' '.join(x)) #join tokens back into a single string




# Multiple feature extraction approaches
X_train, X_test, y_train, y_test = train_test_split(
    df["processed_text"], 
    df["emotion"], 
    test_size=0.2, 
    random_state=42, 
    stratify=df["emotion"]
)

print("Creating TF-IDF features...")

# Option 1: TF-IDF Vectorizer (recommended for better performance)
tfidf_vectorizer = TfidfVectorizer(
    ngram_range=(1, 3),  # Include unigrams, bigrams, and trigrams
    max_features=6000,  # Limit to top 10k features
    min_df=2,           # Ignore terms that appear in less than 2 documents
    max_df=0.95,        # Ignore terms that appear in more than 95% of documents
    lowercase=False,    # Already lowercased
    use_idf=True,       # Use inverse document frequency weighting
    smooth_idf=True     # Smooth IDF weights
)
X_train_vec = tfidf_vectorizer.fit_transform(X_train)
X_test_vec = tfidf_vectorizer.transform(X_test)

# rf_params = {
#     'n_estimators': [100, 200, 300],
#     'max_depth': [10, 15, 20, None],
#     'min_samples_split': [2, 5, 10],
#     'min_samples_leaf': [1, 2, 4],
#     'max_features': ['sqrt', 'log2', None],
#     'bootstrap': [True, False]
# }

# Create Random Forest model
# rf_model = RandomForestClassifier(random_state=42, n_jobs=-1)

# # Handle class imbalance
sample_weights = compute_sample_weight(class_weight="balanced", y=y_train)

# Grid search with cross-validation
# print("Performing hyperparameter tuning...")
# rf_grid = GridSearchCV(
#     rf_model, 
#     rf_params, 
#     cv=2, 
#     scoring='accuracy', 
#     n_jobs=-1,
#     verbose=2
# )

# rf_grid.fit(X_train_vec, y_train, sample_weight=sample_weights)
# rf_best = rf_grid.best_estimator_

# print(f"Best parameters: {rf_grid.best_params_}")
# print(f"Best cross-validation score: {rf_grid.best_score_:.4f}")

# Evaluate the model
print("\n=== Model Evaluation ===")
clf = RandomForestClassifier(n_estimators=50, random_state=42)
clf.fit(X_train_vec, y_train,sample_weight=sample_weights)
y_pred = clf.predict(X_test_vec)
print("Classification Report:\n", classification_report(y_test, y_pred))

import pickle

with open("model/model.pkl", "wb") as f:
    pickle.dump(clf, f)

with open("model/vectorizer.pkl", "wb") as f:
    pickle.dump(tfidf_vectorizer, f)