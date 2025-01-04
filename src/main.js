// Access the DOM elements
const video = document.getElementById('camera');
const canvas = document.getElementById('image-canvas');
const captureBtn = document.getElementById('capture-btn');
const takePhotoBtn = document.getElementById('take-photo-btn');
const context = canvas.getContext('2d');

// Open Video on click
captureBtn.addEventListener('click', () => {
    // Request access to the user's camera
    navigator.mediaDevices.getUserMedia({video: true})
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch(() => {
            alert("Error accessing the camera");
        });
    video.style.display = 'block';
    captureBtn.style.display = 'none';
    takePhotoBtn.style.display = 'block';
    canvas.style.display = 'none';
});

//takes photo of video and renders it on canvas
takePhotoBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    video.style.display = 'none';
//remove takePhotoBtn so and display capture-btn again so that only
// one photo at a time can be taken
    takePhotoBtn.style.display = 'none';
    captureBtn.style.display = 'block';
    canvas.style.display = 'block';

})




