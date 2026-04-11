class CanvasGrid {
    constructor(canvasId, gridSize = 64, penSize = 3.5) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = gridSize;
        this.penSize = penSize;
        this.cellSize = this.canvas.width / this.gridSize;
        this.grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
        this.isDrawing = false;
        this.setupCanvas();
        this.addEventListeners();
    }

    setupCanvas() {
        this.canvas.width = 640;
        this.canvas.height = 640;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = '#333';

        for (let x = 0; x <= this.canvas.width; x += this.cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.canvas.height; y += this.cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawCell(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        for (let i = -Math.floor(this.penSize / 2); i < Math.ceil(this.penSize / 2); i++) {
            for (let j = -Math.floor(this.penSize / 2); j < Math.ceil(this.penSize / 2); j++) {
                const currentRow = row + i;
                const currentCol = col + j;
                if (currentRow >= 0 && currentRow < this.gridSize && currentCol >= 0 && currentCol < this.gridSize) {
                    if (this.grid[currentRow][currentCol] === 0) {
                        this.grid[currentRow][currentCol] = 1;
                        this.ctx.fillStyle = 'white';
                        this.ctx.fillRect(currentCol * this.cellSize, currentRow * this.cellSize, this.cellSize, this.cellSize);
                        this.ctx.strokeRect(currentCol * this.cellSize, currentRow * this.cellSize, this.cellSize, this.cellSize);
                    }
                };
            }
        }
    }

    addEventListeners() {
        this.canvas.addEventListener('mousedown', (event) => {
            this.isDrawing = true;
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.drawCell(x, y);
        });
        this.canvas.addEventListener('mousemove', (event) => {
            if (this.isDrawing) {
                const rect = this.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                this.drawCell(x, y);
            }
        });
        this.canvas.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDrawing = false;
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === '+') {
                this.penSize = Math.min(this.penSize + 1, this.gridSize);
            } else if (event.key === '-') {
                this.penSize = Math.max(this.penSize - 1, 1);
            }
        });
    }

    getGridData() {
        return JSON.stringify(this.grid);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.grid = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(0));
        this.setupCanvas();
        this.isDrawing = false;
        this.penSize = penSize;

        // Remove and re-add event listeners
        this.canvas.replaceWith(this.canvas.cloneNode(true));
        this.canvas = document.getElementById(this.canvas.id); // Rebind the canvas
        this.addEventListeners();
    }
}   

class PredictionHandler {
    constructor(grid) {
        this.grid = grid;
    }

    predictKana() {
        const gridData = this.grid.getGridData();
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: gridData,
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Grid data sent successfully!');
                    response.json().then((data) => {
                        console.log('Predicted Kana:', data.predictions);
                        const predictionElement = document.getElementById('prediction-content');
                        predictionElement.textContent = `Prediction: ${data.predictions}`;
                    });
                } else {
                    console.error('Failed to send grid data.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

class UIManager {
    constructor(grid, predictionHandler) {
        this.grid = grid;
        this.predictionHandler = predictionHandler;
        this.createButtons();
    }
    createButtons() {
        const buttonsBox = document.getElementById('buttons-box'); // Get the buttons-box container

        // const logButton = document.createElement('button');
        // logButton.textContent = 'Log Grid Values';
        // logButton.style.margin = '5px';
        // logButton.addEventListener('click', () => {
        //     console.clear();
        //     console.table(this.grid.grid);
        // });
        // buttonsBox.appendChild(logButton);

        const sendButton = document.createElement('button');
        sendButton.textContent = 'Predict Kana';
        sendButton.style.margin = '5px';
        sendButton.addEventListener('click', () => {
            this.predictionHandler.predictKana();
        });
        buttonsBox.appendChild(sendButton);

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Canvas';
        clearButton.style.margin = '5px';
        clearButton.addEventListener('click', () => {
            this.grid.clearCanvas();
        });
        buttonsBox.appendChild(clearButton);
    }
}

const canvasGrid = new CanvasGrid('mainCanvas');
const predictionHandler = new PredictionHandler(canvasGrid);
const uiManager = new UIManager(canvasGrid, predictionHandler);