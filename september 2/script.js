const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
const primeButton = document.getElementById('prime');
let currentInput = "";

// Short funny divide-by-zero messages
const funnyResponses = [
    "Math meltdown!",
    "Zero says nope.",
    "Infinity denied.",
    "Nice try.",
    "You broke it.",
    "Divide by nope.",
    "Oops... zeroed.",
    "Not today, math."
];

// Prime check function
function isPrime(num) {
    if (num <= 1 || !Number.isInteger(num)) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Main button logic
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (value === 'C') {
            currentInput = "";
            display.value = "";
        } else if (value === '=') {
            try {
                if (/\/0(?!\d)/.test(currentInput)) {
                    const msg = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
                    display.value = msg;
                    currentInput = "";
                } else {
                    const result = eval(currentInput);
                    currentInput = result;
                    display.value = result;
                }
            } catch (error) {
                display.value = "Oops!";
            }
        } else if (value !== 'Prime?') {
            currentInput += value;
            display.value = currentInput;
        }
    });
});

// Prime button logic
primeButton.addEventListener('click', () => {
    const num = parseFloat(display.value);
    if (isNaN(num)) {
        display.value = "Not a number";
    } else if (!Number.isInteger(num)) {
        display.value = "Whole numbers only";
    } else if (isPrime(num)) {
        display.value = `${num} ✓ Prime`;
    } else {
        display.value = `${num} ✗ Not Prime`;
    }
});
