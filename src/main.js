// Access the DOM elements
import ColorThief from "colorthief/dist/color-thief.js";

const video = document.getElementById('camera');
const canvas = document.getElementById('image-canvas');
const captureBtn = document.getElementById('capture-btn');
const takePhotoBtn = document.getElementById('take-photo-btn');
const context = canvas.getContext('2d');
const imageDropZone = document.getElementById('image-drop-zone');
const inputFile = document.getElementById('imageInput');
const choosePhotoBtn = document.getElementById('choose-photo-btn');
const generatePaletteBtn = document.getElementById('generate-palette-btn');

const ctx =  canvas.getContext('2d');
const img = new Image();
const colorThief = new ColorThief();
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

    takePhotoBtn.style.display = 'inline-flex';
    canvas.style.display = 'none';

    //to prevent that image can be uploaded while camera is active.
    imageDropZone.style.display = 'none';
    choosePhotoBtn.style.display = 'none';
});

//takes photo of video and renders it on canvas
takePhotoBtn.addEventListener('click', () => {
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    //generate image from canvas
    img.src = canvas.toDataURL('image/png');
    video.style.display = 'none';

//remove takePhotoBtn so and display capture-btn, drop-zone and choosePhotoBtn again so that only
// one photo at a time can be taken
    takePhotoBtn.style.display = 'none';
    captureBtn.style.display = 'inline-flex';
    canvas.style.display = 'block';
    choosePhotoBtn.style.display = 'inline-flex';
    imageDropZone.style.display = 'flex';
})

//draws image uploaded via button onto canvas.
inputFile.addEventListener('change', uploadImage);

generatePaletteBtn.addEventListener('click', () => {})

function uploadImage() {
    canvas.style.display = 'block';
    const file = inputFile.files[0];
    if (file) {
        img.src = URL.createObjectURL(file);

        img.onload = function() {

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
        };
    }
}

//add drag and drop logic for dropping the source image onto the page
imageDropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    imageDropZone.classList.add('drag-over');
})

imageDropZone.addEventListener('dragleave', () => {
    imageDropZone.classList.remove('drag-over');
});

imageDropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    inputFile.files = e.dataTransfer.files;
    imageDropZone.classList.remove('drag-over');
    uploadImage();
})












