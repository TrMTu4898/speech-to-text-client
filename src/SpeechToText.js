import io from 'socket.io-client';

const sdk = require("microsoft-cognitiveservices-speech-sdk");
const SPEECH_KEY = "8413587b5f7a42dcba46239ed25e24ac";
const SPEECH_REGION = "eastasia";
const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
speechConfig.speechRecognitionLanguage = "vi-VN";
const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
let recognizer;
let interimResults = '';
let resultCallback;

//Sau khi tham gia room gọi hàm connect socket
const user_info = {
    TOKEN: 'your_token_here',
    ID: '87f68b70-389d-44d7-8276-f49c8186d975',
    NAME: '',
    USERID: 'e2606448-5248-44c3-92c1-19326186ff94',
    ROLE: 'HOST',
    MEETINGID: '006d78c5-4427-4de3-a0e8-1e1ef0dafc63'
}

const socket = io.connect('ws://127.0.0.1:5000/', {
    auth: user_info
});

const startSpeechRecognition = (onResult) =>{
    
    resultCallback = onResult;
    recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)
    recognizer.recognizing = (_, event)=>{
        //console.log('Interim result:', event.result.text)
        interimResults += ` ${event.result.text}`
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
            interimResults="Nếu sau khi thực hiện các bước trên mà vấn đề vẫn tồn tại, bạn có thể cần xem xét các logs chi tiết hơn từ máy chủ WebSocket hoặc trình duyệt để biết thông tin chi tiết hơn về lý do kết nối bị từ chối."
            // Gửi kết quả về server
            socket.emit('speech_to_text_result', interimResults);
            interimResults = ''
        }
    }, 0.5 * 60 * 1000 )
    //Nhận kết quả từ server
    socket.on('speechToKeywords', (result) => {
        console.log('Result:', result);
    });
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
        //đóng kết nối socket
        socket.disconnect()
    }
}
export { startSpeechRecognition, stopSpeechRecognition };



