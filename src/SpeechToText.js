const sdk = require("microsoft-cognitiveservices-speech-sdk");
const SPEECH_KEY  = "3ee8ac5bef9c4ba181422b923dce6fa3"
const SPEECH_REGION = "southeastasia"
const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION)
speechConfig.speechRecognitionLanguage = "vi-VN";
const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput()
let recognizer;

const startSpeechRecognition = (onResult) =>{
    recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)
    recognizer.recognizing = (_, event)=>{
        console.log('Interim result:', event.result.text)
    }
    recognizer.recognized =(_, event)=>{
        const finalResult = event.result.text;
        onResult(finalResult);
    }
    recognizer.startContinuousRecognitionAsync(
        ()=>{},
        (error) =>{
            console.log('Speech recognition error:', error)
        }
    )
}

const stopSpeechRecognition = () =>{
    if (recognizer) {
        recognizer.stopContinuousRecognitionAsync(
            () => {},
            () => {}
        );
    }
}
export { startSpeechRecognition, stopSpeechRecognition };