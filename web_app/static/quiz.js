// States

let question_number = 0;
let questions = [];
let currentQuestionIndex = 0;
let predictions = [];


function loadQuestions() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = `${question_number + 1}. ${question.question}`;
}

function showResulsPage() {
    window.location.href = "/results";
}

function showResults() {
    // display results
}

function clearResultsStates() {
    question_number = 0;
    questions = [];
    currentQuestionIndex = 0;
}

class QuestionButtonManagr {
    construction(grid, prediction_handler) {
        this.grid = grid;
        this.prediction_handler = prediction_handler;
    }

    createQuizButtons() {
        const buttonsBox = document.getElementById("question-buttons");

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Submit And Next';
        nextButton.style.margin = '5px';
        nextButton.addEventListener('click', () => {
            this.predictionHandler.predictKana();
            currentQuestionIndex++;
            loadQuestions();
        });
        buttonsBox.appendChild(nextButton);

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Canvas';
        clearButton.style.margin = '5px';
        clearButton.addEventListener('click', () => {
            this.grid.clearCanvas();
        });
        buttonsBox.appendChild(clearButton);
    }
}