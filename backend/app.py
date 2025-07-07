from flask import Flask, request, jsonify

import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag
from nltk.corpus import wordnet, stopwords
import re
from flask_cors import CORS
import pickle
import traceback

# Load the trained model and vectorizer
with open("model/model.pkl", "rb") as f:
    model = pickle.load(f)

with open("model/vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)


# nltk.download('punkt')
# nltk.download('averaged_perceptron_tagger')
# nltk.download('wordnet')
# nltk.download('stopwords')

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enables CORS for all routes
def get_wordnet_pos(tag):
    if tag.startswith("J"): return wordnet.ADJ
    elif tag.startswith("V"): return wordnet.VERB
    elif tag.startswith("N"): return wordnet.NOUN
    elif tag.startswith("R"): return wordnet.ADV
    else: return wordnet.NOUN

def preprocess(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words("english")) - {'not', 'no'}
    tokens = [t for t in tokens if t not in stop_words]
    tagged = pos_tag(tokens)
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word, get_wordnet_pos(tag)) for word, tag in tagged]
    return " ".join(tokens)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Emotion Classifier API is working ✅"}), 200

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if "text" not in data:
            return jsonify({"error": "Missing 'text' field"}), 400

        user_input = data["text"]
        processed = preprocess(user_input)  # Assuming you have a preprocess function defined

        # Transform input using the same vectorizer used in training
        vectorized_input = vectorizer.transform([processed])

        # Predict emotion
        prediction = model.predict(vectorized_input)[0]

        return jsonify({"emotion": prediction}), 200

    except Exception as e:
        print("Error:", traceback.format_exc())
        return jsonify({"error": "Something went wrong", "trace": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
