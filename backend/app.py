from flask import Flask, request, jsonify
from mongoengine import connect
from models import JournalEntry
import os
from dotenv import load_dotenv
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag
from nltk.corpus import wordnet, stopwords
import re
from flask_cors import CORS
import pickle
import traceback

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

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
# Connect to MongoDB
connect(host=MONGO_URI)
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

        
        entry = JournalEntry(text=user_input, emotion=prediction)
        entry.save()

        return jsonify({"emotion": prediction, "message": "Entry saved!"}), 200

    except Exception as e:
        print("Error:", traceback.format_exc())
        return jsonify({"error": "Something went wrong", "trace": str(e)}), 500
@app.route("/api/entries", methods=["GET"])
def get_entries():
    entries = JournalEntry.objects.order_by("-timestamp")
    result = [
        {"text": e.text, "emotion": e.emotion, "timestamp": e.timestamp.isoformat()}
        for e in entries
    ]
    if not result:
        return jsonify({"message": "No entries found"}), 404
    print("Fetched entries:")  # Debugging line
    return jsonify({"entries": result}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
