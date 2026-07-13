const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;
let displayText = '0';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        handleButtonClick(button);
    });
});

function handleButtonClick(button) {
    if (button.classList.contains('btn-clear')) {
        clearCalculator();
    } else if (button.classList.contains('btn-delete')) {
        deleteLastCharacter();
    } else if (button.classList.contains('btn-operator')) {
        handleOperator(button.textContent);
    } else if (button.classList.contains('btn-equals')) {
        calculateResult();
    } else if (button.classList.contains('btn-decimal')) {
        addDecimal();
    } else {
        addNumber(button.textContent);
    }
}

function clearCalculator() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
    displayText = '0';
    updateDisplay();
}

function deleteLastCharacter() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    displayText = currentInput;
    updateDisplay();
}

function addNumber(num) {
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        if (currentInput === '0') {
            currentInput = num;
        } else {
            currentInput += num;
        }
    }
    displayText = currentInput;
    updateDisplay();
}

function addDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    displayText = currentInput;
    updateDisplay();
}

function handleOperator(op) {
    if (operation !== null && !shouldResetDisplay) {
        calculateResult();
    }
    previousInput = currentInput;
    operation = op;
    shouldResetDisplay = true;
    displayText = currentInput + ' ' + op;
    updateDisplay();
}

function calculateResult() {
    if (operation === null || shouldResetDisplay) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch(operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                operation = null;
                shouldResetDisplay = true;
                displayText = 'Error';
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    currentInput = Math.round(result * 100000000) / 100000000;
    currentInput = currentInput.toString();
    operation = null;
    shouldResetDisplay = true;
    displayText = currentInput;
    updateDisplay();
}

function updateDisplay() {
    display.textContent = displayText;
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        addNumber(e.key);
    } else if (e.key === '.') {
        addDecimal();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculateResult();
    } else if (e.key === 'Backspace') {
        deleteLastCharacter();
    } else if (e.key === 'Escape') {
        clearCalculator();
    }
});
