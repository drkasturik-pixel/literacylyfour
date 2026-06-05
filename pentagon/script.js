// ======================================
// GAME DATA
// ======================================

const objects = [
    { name: "House", image: "assets/house.png", shape: "pentagon" },
    { name: "Gift", image: "assets/gift.png", shape: "pentagon" },
    { name: "Badge", image: "assets/badge.png", shape: "pentagon" },

    { name: "Honey", image: "assets/honey.png", shape: "hexagon" },
    { name: "Nut", image: "assets/nut.png", shape: "hexagon" },
    { name: "Pencil", image: "assets/pencil.png", shape: "hexagon" },
    { name: "Tile", image: "assets/tile.png", shape: "hexagon" },
    { name: "Go Sign", image: "assets/go.png", shape: "hexagon" },

    { name: "Stop Sign", image: "assets/stop.png", shape: "octagon" },
    { name: "Road Marker", image: "assets/roadmarker.png", shape: "octagon" },
    { name: "Clock", image: "assets/clock.png", shape: "octagon" },
    { name: "Spectacles", image: "assets/specs.png", shape: "octagon" }
];

// ======================================
// ELEMENTS
// ======================================

const splashScreen = document.getElementById("splashScreen");
const instructionScreen = document.getElementById("instructionScreen");
const gameScreen = document.getElementById("gameScreen");
const completionScreen = document.getElementById("completionScreen");

const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const tryAgainBtn = document.getElementById("tryAgainBtn");

const currentObject = document.getElementById("currentObject");

const scoreSpan = document.getElementById("score");
const totalScoreSpan = document.getElementById("totalScore");

const tick = document.getElementById("tick");
const cross = document.getElementById("cross");

const finalScore = document.getElementById("finalScore");
const percentage = document.getElementById("percentage");
const stars = document.getElementById("stars");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const bgMusic = document.getElementById("bgMusic");

const dropzones = document.querySelectorAll(".dropzone");

// ======================================
// VARIABLES
// ======================================

let score = 0;
let currentIndex = 0;
let currentItem = null;

// ======================================
// INITIALIZATION
// ======================================

totalScoreSpan.textContent = objects.length;

// ======================================
// SPLASH SCREEN
// ======================================

window.addEventListener("load", () => {

    setTimeout(() => {

        splashScreen.classList.add("hidden");

        instructionScreen.classList.remove("hidden");

        speak(
            "Welcome to Shape Match Adventure. Drag each picture to the correct shape. Let's begin."
        );

    }, 5000);

});

// ======================================
// SPEECH
// ======================================

function speak(text) {

    if (!window.speechSynthesis) return;

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 0.9;
    speech.pitch = 1;

    speechSynthesis.speak(speech);
}

// ======================================
// AUDIO
// ======================================

function playAudio(audio) {

    audio.pause();

    audio.currentTime = 0;

    audio.play().catch(() => {});
}

// ======================================
// START GAME
// ======================================

startBtn.addEventListener("click", () => {

    instructionScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    bgMusic.volume = 0.3;

    bgMusic.play().catch(() => {});

    loadObject();

});

// ======================================
// LOAD OBJECT
// ======================================

function loadObject() {

    if (currentIndex >= objects.length) {

        finishGame();
        return;
    }

    currentItem = objects[currentIndex];

    currentObject.src = currentItem.image;

    currentObject.alt = currentItem.name;

    currentObject.style.animation = "none";

    void currentObject.offsetWidth;

    currentObject.style.animation =
        "slideUp .8s ease";

    speak(`Drag the ${currentItem.name}`);
}

// ======================================
// DRAG SUPPORT
// ======================================

currentObject.addEventListener("dragstart", (e) => {

    e.dataTransfer.setData(
        "shape",
        currentItem.shape
    );

});

dropzones.forEach(zone => {

    zone.addEventListener("dragover", (e) => {

        e.preventDefault();

        zone.classList.add("dragover");

    });

    zone.addEventListener("dragleave", () => {

        zone.classList.remove("dragover");

    });

    zone.addEventListener("drop", (e) => {

        e.preventDefault();

        zone.classList.remove("dragover");

        checkAnswer(
            zone.dataset.shape
        );

    });

});

// ======================================
// TOUCH SUPPORT
// ======================================

let clone = null;

currentObject.addEventListener(
    "touchstart",
    touchStart,
    { passive: true }
);

function touchStart(e) {

    clone = currentObject.cloneNode(true);

    clone.style.position = "fixed";
    clone.style.width = "120px";
    clone.style.zIndex = "9999";
    clone.style.pointerEvents = "none";

    document.body.appendChild(clone);

    moveClone(e.touches[0]);
}

document.addEventListener("touchmove", (e) => {

    if (!clone) return;

    moveClone(e.touches[0]);

});

document.addEventListener("touchend", (e) => {

    if (!clone) return;

    const touch =
        e.changedTouches[0];

    dropzones.forEach(zone => {

        const rect =
            zone.getBoundingClientRect();

        if (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
        ) {

            checkAnswer(
                zone.dataset.shape
            );
        }

    });

    clone.remove();

    clone = null;

});

function moveClone(touch) {

    clone.style.left =
        touch.clientX - 60 + "px";

    clone.style.top =
        touch.clientY - 60 + "px";
}

// ======================================
// CHECK ANSWER
// ======================================

function checkAnswer(selectedShape) {

    if (
        selectedShape === currentItem.shape
    ) {

        correctAnswer();

    } else {

        wrongAnswer();

    }
}

// ======================================
// CORRECT
// ======================================

function correctAnswer() {

    playAudio(correctSound);

    speak("Great job");

    score++;

    scoreSpan.textContent = score;

    tick.classList.remove("hidden");

    setTimeout(() => {

        tick.classList.add("hidden");

        currentIndex++;

        loadObject();

    }, 1000);
}

// ======================================
// WRONG
// ======================================

function wrongAnswer() {

    playAudio(wrongSound);

    speak("Try again");

    cross.classList.remove("hidden");

    tryAgainBtn.classList.remove("hidden");
}

// ======================================
// TRY AGAIN
// ======================================

tryAgainBtn.addEventListener("click", () => {

    cross.classList.add("hidden");

    tryAgainBtn.classList.add("hidden");

    speak(
        `Drag the ${currentItem.name}`
    );

});

// ======================================
// FINISH GAME
// ======================================

function finishGame() {

    bgMusic.pause();

    gameScreen.classList.add("hidden");

    completionScreen.classList.remove("hidden");

    const percent =
        Math.round(
            (score / objects.length) * 100
        );

    finalScore.textContent =
        `Score: ${score} / ${objects.length}`;

    percentage.textContent =
        `${percent}%`;

    if (percent === 100) {

        stars.innerHTML = "⭐⭐⭐";

    } else if (percent >= 80) {

        stars.innerHTML = "⭐⭐";

    } else {

        stars.innerHTML = "⭐";
    }

    speak(
        "Congratulations. You completed the game."
    );

    createConfetti();
}

// ======================================
// PLAY AGAIN
// ======================================

playAgainBtn.addEventListener("click", () => {

    score = 0;

    currentIndex = 0;

    scoreSpan.textContent = 0;

    completionScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    bgMusic.currentTime = 0;

    bgMusic.play().catch(() => {});

    loadObject();

});

// ======================================
// CONFETTI
// ======================================

function createConfetti() {

    for (let i = 0; i < 40; i++) {

        const confetti =
            document.createElement("div");

        confetti.className =
            "confetti";

        confetti.style.left =
            Math.random() * 100 + "%";

        confetti.style.animationDelay =
            Math.random() * 2 + "s";

        document.body.appendChild(
            confetti
        );

        setTimeout(() => {

            confetti.remove();

        }, 4000);
    }
}
