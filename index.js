// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const express = require('express');

let app = express();
let server = app.listen(8000, '0.0.0.0');


const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));


io.on('connection', socket =>{
    console.log("user connected");
    socket.on('msg', data =>{
        quickStart(data.message);
        io.sockets.emit('newMsg', {data: 'msg'});
    });
});

app.get('/', (req, res)=>{
    res.render('home');
});

app.get('/getAudioMessage', (req, res) =>{
   res.sendFile(__dirname+'/output.mp3');
});

app.get('/favicon.ico', (req, res) => res.status(204));

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
async function quickStart(msg) {
    // The text to synthesize
    // Construct the request
    const request = {
        input: {text: "How are you?"},
        // Select the language and SSML voice gender (optional)
        voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
        // select the type of audio encoding
        audioConfig: {audioEncoding: 'MP3'},
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
}




