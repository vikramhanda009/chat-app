const socket = io();

// DOM Elements
const $messageForm = document.querySelector("#message-form");
const $messageInput = $messageForm.querySelector("input");
const $messageButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;

// Listen for messages from the server
socket.on('message', (message) => {
    console.log('msg from server: ', message);

    // Render the message with Mustache.js
    const html = Mustache.render(messageTemplate, { 'message':message.text,
        'createdAt':moment(message.createdAt).format('D-M-YYYY h:mm:ss a')        ,
        
     });
    $messages.insertAdjacentHTML('beforeend', html);
});

// Listen for location messages
socket.on('locationMessage', (msg) => {
    console.log('Location from server: ', msg);

    // Render location message with Mustache.js
    const html = Mustache.render(locationMessageTemplate, {  'url':msg.url,
        'createdAt':moment(msg.createdAt).format('D-M-YYYY h:mm:ss a')        ,
         });
    $messages.insertAdjacentHTML('beforeend', html);
});

// Send message function
function sendMessage(event) {
    event.preventDefault();

    $messageButton.setAttribute('disabled', 'disabled');
    const message = $messageInput.value;

    if (message) {
        socket.emit('sendMessage', message, (error) => {
            $messageButton.removeAttribute('disabled');
            $messageInput.value = '';
            $messageInput.focus();

            if (error) {
                console.log("Error:", error);
            }
        });
    }
}

// Send location function
function sendLocation(event) {
    event.preventDefault();

    $sendLocationButton.setAttribute('disabled', 'disabled');

    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log("Location shared");
        });
    }, () => {
        $sendLocationButton.removeAttribute('disabled');
        alert('Unable to retrieve location.');
    });
}

// Add event listeners
$messageForm.addEventListener('submit', sendMessage);
$sendLocationButton.addEventListener('click', sendLocation);
