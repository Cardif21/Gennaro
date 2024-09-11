const baseColors = ["red", "blue", "green", "yellow"];
let colors = [...baseColors]; // Iniziamo con i colori di base
let targetColor = "";
let score = 0;
let timeLeft = 10;
let timer;
let startTime;
let responseTimes = [];

const colorNameElement = document.getElementById("color-name");
const scoreElement = document.getElementById("score");
const timeLeftElement = document.getElementById("time-left");
const startButton = document.getElementById("start-button");
const buttonContainer = document.getElementById("button-container");

// Lista di colori aggiuntivi (nero sostituisce marrone)
const additionalColors = ["orange", "purple", "cyan", "pink", "black", "gray"];

function startGame() {
    score = 0;
    timeLeft = 10;
    responseTimes = [];
    colors = [...baseColors]; // Ripristina i colori di base all'inizio del gioco
    scoreElement.textContent = "SCORE: " + score;
    timeLeftElement.textContent = timeLeft + "S";
    startButton.style.display = "none";
    createInitialButtons();
    setRandomTargetColor();
    startTimer();
    startTime = new Date(); // Iniziamo a cronometrare il tempo del gioco
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft + "S";
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function createInitialButtons() {
    buttonContainer.innerHTML = ""; // Pulire il contenitore prima di aggiungere i pulsanti
    colors.forEach(color => {
        createButton(color);
    });
}

function setRandomTargetColor() {
    // Aggiungi un nuovo colore ogni 20 livelli
    if (score > 0 && score % 20 === 0 && colors.length < baseColors.length + additionalColors.length) {
        const newColor = additionalColors[colors.length - baseColors.length];
        if (!colors.includes(newColor)) {
            colors.push(newColor);
            createButton(newColor); // Crea un nuovo pulsante per il nuovo colore
        }
    }

    targetColor = colors[Math.floor(Math.random() * colors.length)];
    colorNameElement.textContent = targetColor;
    setColorButtons();
}

function createButton(color) {
    const button = document.createElement("button");
    button.classList.add("color-button");
    button.style.backgroundColor = color;
    button.onclick = () => checkColor(color);
    buttonContainer.appendChild(button);
}

function setColorButtons() {
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    const buttons = buttonContainer.querySelectorAll(".color-button");

    buttons.forEach((button, index) => {
        if (index < shuffledColors.length) {
            button.style.backgroundColor = shuffledColors[index];
            button.onclick = () => checkColor(shuffledColors[index]);
            button.style.display = "block"; // Mostra il pulsante se è nascosto
        } else {
            button.style.display = "none"; // Nascondi i pulsanti non usati
        }
    });
}

function checkColor(selectedColor) {
    const currentTime = new Date();
    const responseTime = (currentTime - startTime) / 1000; // Tempo in secondi
    responseTimes.push(responseTime); // Memorizziamo il tempo di risposta

    if (selectedColor === targetColor) {
        score++;
        scoreElement.textContent = "SCORE: " + score;
        setRandomTargetColor();
        timeLeft += 2; // Aggiunta di 2 secondi come ricompensa per una risposta corretta
        startTime = new Date(); // Reimposta il tempo di risposta per la prossima domanda
    } else {
        clearInterval(timer);
        endGame(); // Termina il gioco se si sbaglia
        return;
    }
}

function calculateIQ() {
    if (responseTimes.length === 0) return 0;

    // Calcolo del tempo di risposta medio
    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

    // Base IQ e bonus per il punteggio, partendo da un QI base più alto
    const baseIQ = 10;
    const scoreBonus = Math.log(score + 1) * 10;  // Bonus logaritmico più aggressivo

    // Penalità basata sul tempo medio di risposta
    const timePenalty = Math.max(averageResponseTime - 1, 0) * 10;  // Penalità più leggera

    // Aggiusta il calcolo del QI
    const iq = baseIQ + scoreBonus - timePenalty;

    // Assicura che il QI sia sempre positivo e non inferiore a un valore minimo
    return Math.max(10, Math.round(iq));
}

function endGame() {
    const iq = calculateIQ();
    alert(`Game over! Your score is: ${score}. Your estimated IQ is: ${Math.round(iq)}`);
    startButton.style.display = "block";
}

startButton.addEventListener("click", startGame);

