xhttp = new XMLHttpRequest();
const APIUrl = "https://api.thecatapi.com/v1/images/search";
const APIKey = ""; 
const CAT_IMAGES_ID = "cat-images";
const CLEAR_CAT_BUTTON_ID = "clear-cats";
/*
images: 
	stores all image id’s
offCenterCats: 
	Keeps stack of all images off center, last in list is always the one moved up when come back is called
centerCats: 
	Keeps stack of centered images, last in list si always first to move when cat time is called
 */
let currentImage = null;
let images = [];
let offCenterCats = [];
let centerCats = [];
let clicked = false;
let imageToMove = null;
let z = 1;

function setCatImage() {
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var image = new Image();
      const data = xhttp.response;
      const catData = data[0];
      image.style.height = "200px";
      image.style.width = "auto";
      image.src = catData.url;
      document.getElementById("cat-images").appendChild(image);
      addNewImageId();
    }
  };
  xhttp.open("GET", APIUrl, true);
  xhttp.setRequestHeader("x-api-key", APIKey);
  xhttp.responseType = "json";
  xhttp.send();
}

// this count creates new image id, called in setCatImage()
var ImageIdCount = 0;
function addNewImageId() {
  var imgId = "image" + ImageIdCount;
  images.push(imgId);
  document.images[ImageIdCount].setAttribute("id", imgId);
  ImageIdCount += 1;
}

function catTime() { // called by "Cat Time!!!" button"
  if (images.length == 0) { // Executed on first click
    setCatImage();
    clicked = true;
  } else {
    imageToMove = whichImageToMove(); // Make sure current centered image is element top move
    moveImageDown(imageToMove); // Changes element class -> actually moves the image
    if (images.length == offCenterCats.length) {
      setCatImage(); // New cat image set if only one cat in center
    }
  }
}

function moveRight() {
  if (clicked == true) {
    imageToMove = whichImageToMove();
    moveImageRight(imageToMove);
    if (images.length == offCenterCats.length) {
      setCatImage();
    }
  }
}

function moveLeft() {
  if (clicked == true) {
    imageToMove = whichImageToMove();
    moveImageLeft(imageToMove);
    if (images.length == offCenterCats.length) {
      setCatImage();
    }
  }
}

function moveImageLeft(image) {
  image.setAttribute("class", "moveLeft");
  offCenterCats.push(image);
  chageZIndex(image);
}

function moveImageDown(image) {
  image.setAttribute("class", "moveDown");
  offCenterCats.push(image);
  chageZIndex(image);
}

function moveImageRight(image) {
  image.setAttribute("class", "moveRight");
  offCenterCats.push(image);
  chageZIndex(image);
}

// Selects the correct image to move
function whichImageToMove() { 
  if (images.length == offCenterCats.length + 1) {
    return document.getElementById(images[images.length - 1]);
  } else {
    return centerCats.pop();
  }
}

function chageZIndex(image) {
  if (z > 1) z--;
  setTimeout(function () {
    image.style.zIndex = "";
  }, 500);
}

function comeBack() {
  if (offCenterCats.length > 0) {
    currentImage = offCenterCats.pop();
    centerCats.push(currentImage);
    if (currentImage.getAttribute("class") == "moveDown") {
      currentImage.setAttribute("class", "comeBackFromDown");
      currentImage.style.zIndex = z++;
    } else if (currentImage.getAttribute("class") == "moveRight") {
      currentImage.setAttribute("class", "comeBackFromRight");
      currentImage.style.zIndex = z++;
    } else if (currentImage.getAttribute("class") == "moveLeft") {
      currentImage.setAttribute("class", "comeBackFromLeft");
      currentImage.style.zIndex = z++;
    }
  }
}

function clearCats() {
  if (document) {
    const catImages = document.getElementById(CAT_IMAGES_ID);
    Array.from(catImages ? catImages.children : []).forEach((child) => child && child.parentElement && child.parentElement.removeChild(child));
    currentImage = null;
    images = [];
    offCenterCats = [];
    centerCats = [];
    clicked = false;
    imageToMove = null;
    ImageIdCount = 0;
    z = 1;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const clearButton = document.getElementById(CLEAR_CAT_BUTTON_ID);
  if (clearButton) {
    clearButton.addEventListener("click", clearCats);
  }
});
