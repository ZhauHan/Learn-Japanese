const canvasGrid = new CanvasGrid('mainCanvas');
const predictionHandler = new PredictionHandler(canvasGrid);
const uiManager = new UIManager(canvasGrid, predictionHandler);