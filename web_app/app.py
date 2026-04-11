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
    grid = request.get_json(force=True)

    # if not isinstance(payload, dict) or "body" not in payload:
    #     return jsonify({"status": "error", "message": "Expected JSON like {\"body\": grid}"}), 400

  
    print("Received grid:", grid)

    if not isinstance(grid, list) or len(grid) != 64:
        return jsonify({"status": "error", "message": "Grid must have 64 rows"}), 400

    if any(not isinstance(row, list) or len(row) != 64 for row in grid):
        return jsonify({"status": "error", "message": "Each row must have 64 columns"}), 400

    x = torch.tensor(grid, dtype=torch.float32, device=DEVICE).unsqueeze(0).unsqueeze(0)  # [1,1,64,64]

    with torch.inference_mode():
        y = MODEL(x)
        y = torch.argmax(y, dim=1)  # Get predicted class index
        print(y)  # Debug: print raw output tensor
        print(TRANSLATION_TABLE[y.item()])  # Debug: print translation table
    prediction = TRANSLATION_TABLE[y.item()]  # Convert to list for JSON serialization
    return jsonify({"status": "success", "predictions": prediction})

if __name__ == '__main__':
    app.run(debug=True)