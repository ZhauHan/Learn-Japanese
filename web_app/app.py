from flask import Flask, jsonify, render_template, request
from model import KanaCNN
import pickle
import torch

app = Flask(__name__)

# 🚨 Force CPU (Render has no GPU)
DEVICE = torch.device("cpu")

# Load lookup table (safe at startup)
with open("lookup.pkl", "rb") as f:
    TRANSLATION_TABLE = pickle.load(f)

# 🚨 Lazy-load model (IMPORTANT FIX)
MODEL = None

def load_model():
    model = KanaCNN().to(DEVICE)
    model.load_state_dict(torch.load("kana.pth", map_location=DEVICE))
    model.eval()
    return model

def get_model():
    global MODEL
    if MODEL is None:
        print("Loading model...")
        MODEL = load_model()
    return MODEL


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/predict")
def predict_kana():
    try:
        grid = request.get_json()

        if grid is None:
            return jsonify({"error": "No JSON received"}), 400

        print("Received grid:", type(grid))

        # Validate shape
        if not isinstance(grid, list) or len(grid) != 64:
            return jsonify({"error": "Grid must be 64x64"}), 400

        if any(not isinstance(row, list) or len(row) != 64 for row in grid):
            return jsonify({"error": "Each row must have 64 columns"}), 400

        # Convert to tensor
        x = torch.tensor(grid, dtype=torch.float32).unsqueeze(0).unsqueeze(0).to(DEVICE)

        # Load model safely (lazy)
        model = get_model()

        with torch.inference_mode():
            y = model(x)
            y = torch.argmax(y, dim=1)

        idx = y.item()

        # Safe lookup
        prediction = TRANSLATION_TABLE.get(idx, "Unknown")

        return jsonify({
            "status": "success",
            "predictions": prediction
        })

    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)