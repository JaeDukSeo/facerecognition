var width = 320;
var height = 0;
var streaming = false;
let video = document.querySelector("#video");
let canvas = document.querySelector("#canvas");
let picture = document.querySelector("#picture");
let takePictureBtn = document.querySelector("#takePictureBtn");
let downloadPictureBtn = document.querySelector("#downloadPictureBtn");
let clearPictureBtn = document.querySelector("#clearPictureBtn");

function startup() {
  getMediaDevices();
  videoEventListener();
  takePictureBtnEventListener();
  clearPicture();
}

// use navigator to get video media device
function getMediaDevices() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then((stream) => {
      // pass stream object to video src
      video.srcObject = stream;
      // play video
      video.play();
    })
    .catch((err) => {
      alert("Error occured: ", err);
    });
}

// add "canplay" event listener on video and set its width & height
function videoEventListener() {
  video.addEventListener(
    "canplay",
    (event) => {
      // check if streaming is false (i.e if we're already streaming or not)
      if (!streaming) {
        // set height of video container
        height = video.videoHeight / (video.videoWidth / width);

        // if height is invalid number then set height manually
        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
      }
    },
    // event is in bubbling phase
    false
  );
}

// on click of take picture btn call takePicture function
function takePictureBtnEventListener() {
  takePictureBtn.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      takePicture();
    },
    false
  );
}

// clear picture
function clearPicture() {
  let context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  let data = canvas.toDataURL("image/png");
  picture.setAttribute("src", data);
}

// take picture
function takePicture() {
  let context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    // draw image on canvas captured from video streaming
    context.drawImage(video, 0, 0, width, height);
    
    // encode screenshot captured
    let data = canvas.toDataURL("image/png");

    // pass encoded url to picture's src attribute
    picture.setAttribute("src", data);
  } else {
    clearPicture();
  }
}

clearPictureBtn.addEventListener("click", (event) => {
  clearPicture();
});

// on click of download btn encode scrennshot and convert it to octet stream. Then create `a` element and finally download screenshot. 
downloadPictureBtn.addEventListener("click", function (event) {
  event.preventDefault();

  let image = canvas
    .toDataURL("image/png", 1.0)
    .replace("image/png", "image/octet-stream");

  let link = document.createElement("a");
  link.download = "me.png";
  link.href = image;
  link.click();
});

// on page load call load function in bubbling phase
window.addEventListener("load", startup, false);
