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
const colorPicker = new iro.ColorPicker("#picker", {
    width: 250,
    color: "rgb(255, 0, 0)",
    borderWidth: 1,
    borderColor: "#fff",
    layout: [
        {
            component: iro.ui.Box,
        },
        {
            component: iro.ui.Slider,
            options: {
                id: 'hue-slider',
                sliderType: 'hue'
            }
        }
    ]
});


generatePaletteBtn.addEventListener('click', e => {
    
    const palette = document.getElementById('palette');
    //remove previous palette.
    palette.innerHTML = '';
    
    console.log(img.width);
    if(img.complete) {
       const paletteColors = colorThief.getPalette(img, getNumberOfColors());
       for(let paletteColor of paletteColors) {
         palette.appendChild(createPaletteColor(paletteColor));
       }
    }
})

function createPaletteColor(color) {
    let paletteColor = document.createElement('div');
    let displayColor = document.createElement('div');
    let hexValue = document.createElement('div');
    hexValue.classList.add('hex-value');
    const colorHexValue = rgbToHex(color);
    hexValue.innerHTML = `${colorHexValue}`;
    displayColor.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    displayColor.classList.add('color-display');
    paletteColor.classList.add('palette-color');
    paletteColor.appendChild(displayColor);
    paletteColor.appendChild(hexValue);

    //Add click event to the newly generated color display
    displayColor.addEventListener('click', () => {

        alert(`You clicked on color: ${colorHexValue}`);
        console.log(`RGB: ${color[0]}, ${color[1]}, ${color[2]}`);
    });

    return paletteColor;
}

//gets the currently input number of colors and sets a default value when the input was not valid.
function getNumberOfColors() {
    const numberOfColorsInput = document.getElementById('number-of-colors');
    const numberOfColors =  parseInt(numberOfColorsInput.value, 10);
    if(validNumberInput(numberOfColors)) {
        return numberOfColors;
    }
    else return 5;
}

//checks for valid number input in the number-of-colors input field.
function validNumberInput(number) {
    return !(isNaN(number) || number < 1 || number > 15);
}

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
    img.src = canvas.toDataURL();
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

//converts the color thief input to a hex value for display, taken from their website
function rgbToHex(decimals) {
    return `#${decimals.map((d) => d.toString(16).padStart(2, '0')).join('')}`;
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













