from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import traceback

# Load the trained model and vectorizer
with open("model/model.pkl", "rb") as f:
    model = pickle.load(f)

with open("model/vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

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

        # Transform input using the same vectorizer used in training
        vectorized_input = vectorizer.transform([user_input])

        # Predict emotion
        prediction = model.predict(vectorized_input)[0]

        return jsonify({"emotion": prediction}), 200

    except Exception as e:
        print("Error:", traceback.format_exc())
        return jsonify({"error": "Something went wrong", "trace": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
