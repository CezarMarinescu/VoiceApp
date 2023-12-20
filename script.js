

function populateCanvas(callback) {

    console.log("Populating canvas...");
    drawCalendar();

    callback();
}
function drawCalendar() {
    console.log("Drawing calendar...");
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const cellWidth = 100;
    const cellHeight = 100; 
    const numRows = 5; 
    const numColumns = 7;
    const timeSectionWidth = 60; 
    const totalWidth = numColumns * cellWidth + timeSectionWidth;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    canvas.width = totalWidth; 

    context.fillStyle = 'white';
    context.font = '16px Arial'; 

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numColumns; col++) {
            const x = col * cellWidth;
            const y = row * cellHeight;

            context.strokeRect(x, y, cellWidth, cellHeight); 

            if (row === 0) {

                context.fillText(days[col], x + 10, y + 20);
            } else {

                const date = col + (row - 1) * numColumns;
                context.fillText(date, x + 10, y + 20);
            }
        }
    }

    context.fillStyle = 'gray';
    context.fillRect(numColumns * cellWidth, 0, timeSectionWidth, numRows * cellHeight);


    context.fillStyle = 'white';
    context.font = '10px Arial'; 
    for (let i = 0; i < 24; i++) {
        const hourText = (i < 10) ? '0' + i + ':00' : i + ':00';
        context.fillText(hourText, numColumns * cellWidth + 5, i * (cellHeight / 2) + 15);
    }




    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (mouseX < numColumns * cellWidth && mouseY < numRows * cellHeight) {
            const clickedCol = Math.floor(mouseX / cellWidth);
            const clickedRow = Math.floor(mouseY / cellHeight);

            if (clickedRow !== 0) {
                const selectedDate = clickedCol + (clickedRow - 1) * numColumns + 1; 
                console.log('Selected Date:', selectedDate);
            }
        }
        if (mouseX >= numColumns * cellWidth) {
            const clickedHour = Math.floor((mouseY * 24) / (numRows * cellHeight)); 
            console.log('Selected Hour:', clickedHour);
        }
    });
}



let audio;

// PLAY MUSIC and Reminders

function setReminder(task, time, selectedSound) {
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

function createSoundMap(sounds) {
    const soundMap = {};
    sounds.forEach(sound => {
        soundMap[sound.name.toLowerCase()] = sound.path;
    });
    return soundMap;
}

const recognition = new webkitSpeechRecognition(); 
recognition.continuous = false; 

document.getElementById('submitBtn').addEventListener('click', function () {
    recognition.start();
    document.getElementById('response').textContent = "Listening...";
});

recognition.onresult = function (event) {
    const result = event.results[0][0].transcript.toLowerCase(); 
    console.log('Recognized speech: ' + result);
    fetch('sounds.json')
        .then(response => response.json())
        .then(data => {
           
            const soundMap = createSoundMap(data.sounds);

            if (Object.keys(soundMap).includes(result)) {
                const selectedSound = soundMap[result];

                if (result === "stop") {
                    if (audio) {
                        audio.pause();
                        audio.currentTime = 0;
                        document.getElementById('response').textContent = "Music stopped.";

                        const canvas = document.getElementById('canvas');
                    const context = canvas.getContext('2d');
                    const image = new Image();
                    image.src = "images/Untitled-1.jpg"; 
                    image.onload = function() {
                        context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    };
                    }
                } 
                else if (result === "set") {
                    console.log("Set reminder");
                    populateCanvas(() => {
                        const task = selectedSound;
                        const time = Date.now() + 3000; 
                        setReminder(task, time, selectedSound);
                    });
                } 
                else {
                    console.log("Playing sound: " + selectedSound);
                    audio = new Audio(selectedSound);
                    audio.play();
                    document.getElementById('response').textContent = "Playing sound: " + selectedSound;
                
                    const canvas = document.getElementById('canvas');
                    const context = canvas.getContext('2d');
                    const image = new Image();
                    image.src = "images/hero-image.fill.size_1200x900.v1659974499.jpg"; 
                    image.onload = function() {
                        context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    };
                }
            } else {
                document.getElementById('response').textContent = "Sorry, I didn't recognize the sound name. Please try again.";
            }
        })
        .catch(error => console.error('Error loading JSON file:', error));
};

recognition.onerror = function (event) {
    console.error('Speech recognition error:', event.error);
};


