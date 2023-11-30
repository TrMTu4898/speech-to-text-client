import io from 'socket.io-client'


const sdk = require("microsoft-cognitiveservices-speech-sdk");
const SPEECH_KEY  = "3ee8ac5bef9c4ba181422b923dce6fa3"
const SPEECH_REGION = "southeastasia"
const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION)
speechConfig.speechRecognitionLanguage = "vi-VN";
const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput()
let recognizer;
let interimResults = '';
let resultCallback;
const socket = io('http://127.0.0.1:5000')


const startSpeechRecognition = (onResult) =>{
    socket.on('connect', ()=>{
        console.log('Connected to server');
    })
    resultCallback = onResult;
    recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)
    recognizer.recognizing = (_, event)=>{
        //console.log('Interim result:', event.result.text)
        interimResults = event.result.text
    }
    recognizer.recognized =(_, event)=>{
        const finalResult = event.result.text;
        interimResults += ` ${finalResult}`
    }
    recognizer.startContinuousRecognitionAsync(
        ()=>{},
        (error) =>{
            console.log('Speech recognition error:', error)
        }
    )
    setInterval(()=>{
        if(interimResults){
            resultCallback(interimResults)
            socket.emit('speechToTextResult', interimResults)
            interimResults = ''
        }
    }, 0.5 * 60 * 1000 )
}

const stopSpeechRecognition = () =>{
    if (recognizer) {
        recognizer.stopContinuousRecognitionAsync(
            () => {},
            (error) => {
                console.error('Stop recognition error:', error);
            }
        );
    }
    if (socket){
        socket.disconnect()
    }
}
export { startSpeechRecognition, stopSpeechRecognition };