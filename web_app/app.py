from flask import Flask, jsonify, render_template, request
from model import KanaCNN
import pickle
import torch

app = Flask(__name__)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
with open("lookup.pkl", "rb") as f:
    TRANSLATION_TABLE = pickle.load(f)

def load_model():
    model = KanaCNN().to(DEVICE)
    model.load_state_dict(torch.load("kana.pth", map_location=DEVICE))
    model.eval()
    return model

MODEL = load_model()

@app.get("/")
def index():
    return render_template("index.html")

@app.post("/predict")
def predict_kana():
    try:
        grid = request.get_json()
        print("Received grid:", type(grid))

        # Step 1
        print("Converting to tensor...")
        x = torch.tensor(grid, dtype=torch.float32).unsqueeze(0).unsqueeze(0).to(DEVICE)

        # Step 2
        print("Running model...")
        with torch.inference_mode():
            y = MODEL(x)

        # Step 3
        print("Argmax...")
        y = torch.argmax(y, dim=1)

        # Step 4
        print("Index:", y.item())

        print("Lookup...")
        prediction = TRANSLATION_TABLE[y.item()]

        return jsonify({"status": "success", "predictions": prediction})

    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)