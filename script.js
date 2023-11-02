const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

context.fillStyle = 'rgba(0, 0, 0, 0.8)';
context.fillRect(0, 0, canvas.width, canvas.height);

let audio;

//PLAY MUSIC and Reminders

function setReminder(task, time) {
    const now = new Date();
    const reminderTime = new Date(time);

    const timeDiff = reminderTime - now;

    if (timeDiff <= 0) {
        document.getElementById('response').textContent = "Invalid reminder time.";
        return;
    }

    setTimeout(() => {
        document.getElementById('response').textContent = `Reminder: ${task}`;
        audio = new Audio(selectedSound);
        audio.play();

    }, timeDiff);
}

const recognition = new webkitSpeechRecognition(); // Create a speech recognition object
recognition.continuous = false; // Disable continuous recognition

// Add an event listener for the "Talk" button to start speech recognition
document.getElementById('submitBtn').addEventListener('click', function () {
    // Start speech recognition when the "Talk" button is pressed
    recognition.start();
    document.getElementById('response').textContent = "Listening...";
});

// Handle speech recognition results
recognition.onresult = function (event) {
    const result = event.results[0][0].transcript.toLowerCase(); // Get the recognized speech in lowercase

    // Map recognized words to your stored sound file names
    const soundMap = {
        "blue": "music/Black Eyed Peas - Pump It (Lyrics) - YouTube - Google Chrome 2023-11-02 15-56-21.mp3",
        "stop": "stop",
        "set": "music/iPhone Radar Alarm_Ringtone (Apple Sound) - Sound Effect for Editing - YouTube - Google Chrome 2023-11-02 17-06-09.mp3",
        // Add more mappings for other sounds as needed
    };

    if (soundMap[result]) {
        const selectedSound = soundMap[result];
        
        if (selectedSound === "stop") {
            // Stop the currently playing sound, if any
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
                document.getElementById('response').textContent = "Music stopped.";
            }
        }
        else if(selectedSound ==="set"){
            const task = selectedSound;
            const time = 10000;
            setReminder(task, time)
        }
        else {
            // Create an audio element to play the selected sound
            audio = new Audio(selectedSound);

            // Play the sound
            audio.play();

            // Update the response div with a message
            document.getElementById('response').textContent = "Playing sound: " + selectedSound;
        }
    } else {
        document.getElementById('response').textContent = "Sorry, I didn't recognize the sound name. Please try again.";
    }
};

// Handle speech recognition errors
recognition.onerror = function (event) {
    console.error('Speech recognition error:', event.error);
};


