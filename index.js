const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const startRecordingBtn = document.querySelector(".start");
const stopRecordingBtn = document.querySelector(".stop");
const clearAreaBtn = document.querySelector(".clear");
const log = document.querySelector(".log");
const textArea = document.getElementById("transcript");

const recognition = new SpeechRecognition();

let transcript = "";
let count = 0;
let date = Date.now;
let isPressed = false;

function startRecord() {
  startRecordingBtn.disabled = true;
  startRecordingBtn.textContent = "RECORD ON";

  recognition.continuous = true;
  recognition.start();

  recognition.onerror = (event) => {
    console.log(event);
    let p = document.createElement("p");
    log.append(`[${date()}] ERROR: ` + event.error, p);
  };

  /* 
    event.results[0][0].transcript
    event.results[1][0].transcript
    event.results[2][0].transcript
    ....
  */

  recognition.onresult = (event) => {
    transcript += event.results[count++][0].transcript;
    textArea.value = transcript;
  };

  recognition.onend = (event) => {
    if (isPressed) {
      isPressed = false;
      return;
    };

    const restart = JSON.stringify(event);
    let p = document.createElement("p");
    log.append(`[${date()}] RESTART RECORD: ` + restart, p);
    count = 0;
    recognition.start();
  };
}

function stopRecord() {
  isPressed = true;
  count = 0;

  recognition.stop();
  startRecordingBtn.disabled = false;
  startRecordingBtn.textContent = "Start Record";
}

function clearTranscript() {
  transcript = "";
  textArea.value = "";
}

startRecordingBtn.addEventListener("click", startRecord, false);
stopRecordingBtn.addEventListener("click", stopRecord, false);
clearAreaBtn.addEventListener("click", clearTranscript, false);
