const video = document.getElementById('camera');
const canvas = document.getElementById('image-canvas');
const captureBtn = document.getElementById('capture-btn');
const takePhotoBtn = document.getElementById('take-photo-btn');
const context = canvas.getContext('2d');
const imageDropZone = document.getElementById('image-drop-zone');
const inputFile = document.getElementById('imageInput');
const choosePhotoBtn = document.getElementById('choose-photo-btn');
const generatePaletteBtn = document.getElementById('generate-palette-btn');
const colorPickerContainer = document.getElementById('color-picker-container');
const applyPickerBtn = document.getElementById('apply-picker-button');
const cancelPickerBtn = document.getElementById('cancel-picker-button');
const palette = document.getElementById('palette');
const addColorBtn = document.getElementById('add-color-btn');
const hexColor = document.getElementById('hex-color');
const complementaryColorBtn = document.getElementById('complementary-color');
let hexElements = null;

const ctx = canvas.getContext('2d', {willReadFrequently: true});
const img = new Image();

//displays the default image onto the canvas when website is loaded. Also displays the color palette of that image.
img.src = "public/logo_png.png";
img.onload = () => {
    imageLoad();
}

//generates the default palette to be displayed in the color palette container.
palette.appendChild(createPaletteColor("#bc5dc7"));
palette.appendChild(createPaletteColor("#a7cc87"));
palette.appendChild(createPaletteColor("#61a6c4"));
palette.appendChild(createPaletteColor("#d8a464"));
palette.appendChild(createPaletteColor("#e45cae"));

const colorThief = new ColorThief();

//if a color in the palette is currently selected, the element will be saved in this variable.
let currentlySelectedColor = null;
//the element displaying the hex code of the currently selected color element.
let currentlySelectedHexCode = null;

//the object used to display the color picker box on the screen.
const colorPicker = new iro.ColorPicker("#picker", {
    width: 250, color: "rgb(255, 0, 0)", border: "none", layout: [{
        component: iro.ui.Box,
    }, {
        component: iro.ui.Slider, options: {
            id: 'hue-slider', sliderType: 'hue'
        }
    }]
});

let hexValueCopy = null;

//opens color picker and generates a new color to be appended to the list of colors in the palette.
addColorBtn.addEventListener('click', () => {
    let newPaletteColor = createPaletteColor("#ebe6ee");
    currentlySelectedColor = newPaletteColor.children[0];
    currentlySelectedHexCode = newPaletteColor.children[1];
    palette.appendChild(newPaletteColor);
    colorPickerContainer.style.visibility = 'visible';
    colorPicker.color.hexString = "#ebe6ee";
    hexColor.value = "#ebe6ee";
})

complementaryColorBtn.addEventListener('click', () => {
    calculateComplementaryColor(colorPicker.color.hsl);
})

function calculateComplementaryColor(hslColor) {
    hslColor.h = (hslColor.h + 180) % 360;
    colorPicker.color.hsl = hslColor;
}

//updates color picker if new valid hex-code was entered.
hexColor.addEventListener('change', () => {
    const currentColor = hexColor.value;
    if(validHexCode(currentColor)) {
        colorPicker.color.hexString = currentColor;
    }
})

/**
 * Checks whether input hexCode is actually a valid hex code.
 * @param hexCode the string to check.
 * @returns {boolean} returns true if valid hexCode, false otherwise.
 */
function validHexCode(hexCode) {
   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexCode || '');
}
hexColor.addEventListener('change', () => {})

/*
when hovering above a displayed hex-value, the text 'Copy' will be displayed to indicate to the user,
that he can copy the hex-code by clicking on it.
 */
palette.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('hex-value')) {
        hexValueCopy = e.target.textContent;
        e.target.textContent = "Copy";
    }
});

palette.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('hex-value')) {
        e.target.textContent = hexValueCopy;
    }
});

/*
copies the currently clicked hex-code to clipboard.
 */
palette.addEventListener('click', (e) => {
    if (e.target.classList.contains('hex-value')) {
        navigator.clipboard.writeText(hexValueCopy);
        showSnackbar();
    }
})

/**
 * used to display snackbar after copy action.
 * Code taken from https://www.w3schools.com/howto/howto_js_snackbar.asp.
 */
function showSnackbar() {
    let snackbarElement = document.getElementById('snackbar');
    snackbarElement.className = 'show';
    setTimeout(function () {
        snackbarElement.className = snackbarElement.className.replace("show", "");
    }, 3000);
}


generatePaletteBtn.addEventListener('click', () => {
    generatePalette();
})

/**
 * Removes the previously displayed palette and generates the new input palette based on the img.
 * The number of colors generated is determined by the value in the 'number-of-colors' input.
 */
function generatePalette() {

    //remove previous palette.
    palette.innerHTML = '';

    if (img.complete) {
        const paletteColors = colorThief.getPalette(img, getNumberOfColors());
        for (let paletteColor of paletteColors) {
            const hexPaletteColor = rgbToHex(paletteColor);
            palette.appendChild(createPaletteColor(hexPaletteColor));
        }
    }

    //select all currently displayed hexElements to make the event listener for the copy function possible
    hexElements = document.querySelectorAll('.hex-value');
}


//changes the selected color (and its adjacent hex code) to match the color that is selected
//in the color picker.
applyPickerBtn.addEventListener('click', e => {
    currentlySelectedColor.style.backgroundColor = `${colorPicker.color.hexString}`;
    currentlySelectedHexCode.innerHTML = `${colorPicker.color.hexString}`;
    colorPickerContainer.style.visibility = 'hidden';
})

//closes the color picker without changing the selected color.
cancelPickerBtn.addEventListener('click', e => {
    colorPickerContainer.style.visibility = 'hidden';
})

// Update the displayed hex color when picked color in color picker is modified
colorPicker.on('color:change', (color) => {
    hexColor.value = color.hexString;
});

/**
 * Generates a palette color displaying the color in a box with the hex-code value below.
 * @param color the color (as a hex code) to display.
 * @returns {HTMLDivElement} the divElement that displays the input color.
 */
function createPaletteColor(color) {
    let paletteColor = document.createElement('div');
    let displayColor = document.createElement('div');
    let hexValue = document.createElement('div');
    hexValue.classList.add('hex-value');
    hexValue.innerHTML = `${color}`;
    displayColor.style.backgroundColor = `${color}`;
    displayColor.classList.add('color-display');
    paletteColor.classList.add('palette-color');
    paletteColor.appendChild(displayColor);
    paletteColor.appendChild(hexValue);

    //Adds click event to the newly generated color display
    displayColor.addEventListener('click', () => {
        initialiseColorPicker(displayColor.style.backgroundColor);
        currentlySelectedColor = displayColor;
        currentlySelectedHexCode = hexValue;
        hexColor.value = color;
    });
    return paletteColor;
}

/**
 * Displays the color picker in the middle of the screen on top of the other elements
 * and sets the initial color of the color picker to the passed colorRGB.
 * @param colorRGB the color value (as a rgb String) to display on the color picker.
 */

function initialiseColorPicker(colorRGB) {
    colorPicker.color.rgbString = colorRGB;
    colorPickerContainer.style.visibility = 'visible';
}


/**
 * gets the currently input number of colors and sets a default value when the input was not valid.
 if the input was not valid a default palette of 5 colors will be generated.
 */
function getNumberOfColors() {
    const numberOfColorsInput = document.getElementById('number-of-colors');
    const numberOfColors = parseInt(numberOfColorsInput.value, 10);
    if (validNumberInput(numberOfColors)) {
        return numberOfColors;
    } else return 5;
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

    //switch to palette section if screen is small and website is divided into two sections.
    showSection('image-area-container');
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


/**
 * Renders the image currently in inputFile.files onto canvas.
 */
function uploadImage() {
    canvas.style.display = 'block';
    const file = inputFile.files[0];
    if (file && validImageInput(file)) {
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            imageLoad()
        }
    }
}

/**
 * Draws img onto canvas.
 */
function imageLoad() {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
}

/**
 * Checks if the file is of the type 'image/png', 'image/jpg' or  'image/jpeg'. If not false is returned and an
 * alert message displayed.
 * Otherwise, true is returned.
 * @param file the file to inspect.
 */
function validImageInput(file) {
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
        alert("Invalid type " + file.type);
        return false;
    }
    return true;
}

//converts the color thief input to a hex value for display, taken from their website.
function rgbToHex(decimals) {
    return `#${decimals.map((d) => d.toString(16).padStart(2, '0')).join('')}`;
}


//add drag and drop logic for dropping the source image onto the website.
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


/**
 Displays the section with the given section-id on the screen if the section id is valid.
 @param sectionId the id of the section to display.
 **/
window.showSection = function (sectionId) {

    //remove previous section from screen
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    //make previously selected button the not selected button.
    document.querySelectorAll('.navbar-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    const activeSection = document.getElementById(sectionId);

    if (activeSection) {
        activeSection.classList.add('active');
    }

    const activeButton = document.querySelector(`.navbar-btn[onclick="showSection('${sectionId}')"]`);
    if (activeButton) {
        activeButton.classList.add('selected');
    }
}











