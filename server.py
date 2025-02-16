from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2

app = Flask(__name__)
CORS(app)  # Allows all domains to access the API

# Load models
models = {
    "pneumonia": tf.keras.models.load_model("pneumonia_model.h5"),
    "brain_tumor": tf.keras.models.load_model("brain_tumor_model.h5"),
    "breast_cancer": tf.keras.models.load_model("breast_cancer_model.h5"),
}

# Preprocessing function
def preprocess_image(image):
    image = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR)
    image = cv2.resize(image, (224, 224))  # Resize to match the model input
    image = image / 255.0  # Normalize
    return np.expand_dims(image, axis=0)

# Prediction endpoint
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files or "model" not in request.form:
        return jsonify({"error": "Missing file or model name"}), 400

    file = request.files["file"]
    model_name = request.form["model"]

    if model_name not in models:
        return jsonify({"error": "Invalid model name"}), 400

    model = models[model_name]
    image = preprocess_image(file)
    prediction = model.predict(image)
    
    result = {"model": model_name, "prediction": "Positive" if prediction[0][0] > 0.5 else "Negative", "confidence": float(prediction[0][0])}
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
