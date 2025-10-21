// ------------------- Speech Recognition Setup -------------------
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript.trim();
    console.log("Voice Input:", transcript); // Check in console
    handleVoiceCommand(transcript);
};

recognition.onerror = (event) => {
    console.error("Recognition error:", event.error);
    speak("Sorry, there was an error with speech recognition. Please click anywhere to restart.");
};

// ------------------- Speech Synthesis -------------------
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
}

// ------------------- Start Recognition on User Interaction -------------------
window.onload = () => {
    speakIntro();
    // Start recognition on first click
    document.body.addEventListener("click", startRecognitionOnce, { once: true });
};

function startRecognitionOnce() {
    recognition.start();
    speak("Voice recognition started. You can speak now.");
}

// ------------------- Handle Voice Commands -------------------
function handleVoiceCommand(text) {
    text = text.toLowerCase();

    // ---------- LOGIN PAGE ----------
    if (document.getElementById("username")) {
        if (text.includes("username is")) {
            document.getElementById("username").value = text.replace("username is", "").trim();
            speak("Username recorded. Now say your password.");
        } else if (text.includes("password is")) {
            document.getElementById("password").value = text.replace("password is", "").trim();
            speak("Password recorded. Say login to continue.");
        } else if (text.includes("login")) {
            speak("Logging in...");
            setTimeout(() => window.location.href = "upload.html", 1000);
        }
    }

    // ---------- UPLOAD PAGE ----------
    if (document.getElementById("fileInput")) {
        if (text.includes("upload file")) {
            document.getElementById("fileInput").click();
            speak("Please select your file.");
        } else if (text.includes("submit video")) {
            const file = document.getElementById("fileInput").files[0];
            if (!file) speak("No file selected. Please say upload file first.");
            else {
                speak("File uploaded successfully. Processing video now.");
                setTimeout(() => window.location.href = "result.html", 1000);
            }
        }
    }

    // ---------- RESULT PAGE ----------
    if (document.getElementById("resultsBox")) {
        if (text.includes("repeat results")) announceResults();
    }
}

// ------------------- Result Page Functions -------------------
const detectedObjects = [
    { name: "Car", position: "ahead" },
    { name: "Zebra crossing", position: "center" },
    { name: "Person", position: "right" }
];

function announceResults() {
    const resultsBox = document.getElementById("resultsBox");
    resultsBox.innerHTML = detectedObjects.map(o => `${o.name} - ${o.position}`).join("<br>");
    detectedObjects.forEach(obj => speak(`There is a ${obj.name} ${obj.position}.`));
}

function downloadResults() {
    const text = detectedObjects.map(o => `${o.name} - ${o.position}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "results.txt";
    link.click();
}

// ------------------- Intro Prompts -------------------
function speakIntro() {
    if (document.getElementById("username")) speak("Please say your username to begin login.");
    if (document.getElementById("fileInput")) speak("Say upload file to select your video.");
    if (document.getElementById("resultsBox")) announceResults();
}
