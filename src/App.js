import React, { useState } from "react";
import {startSpeechRecognition, stopSpeechRecognition} from "./SpeechToText";

function App() {
  const [transcription, setTranscription] = useState('');
  const handleStart = () => {
    startSpeechRecognition((result) => {
      setTranscription(result);
    });
  };

  const handleStop = () => {
    stopSpeechRecognition();
  };
  return (
      <div>
        <button onClick={handleStart}>Start</button>
        <button onClick={handleStop}>Stop</button>
        <label>{transcription}</label>
      </div>
  );
}

export default App;
