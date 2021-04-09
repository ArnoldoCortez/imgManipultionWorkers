"use strict"

function spin() {
    const spinner = document.getElementById("spinner");
    let angle = 0;
    setInterval(() => {
        angle++;
        spinner.style.transform = `rotate(${angle}deg)`;
    },20)
}

spin();

// //Image Processing
// const fileinput = document.getElementById('fileinput');
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const srcImage = new Image;

// const red = document.getElementById('red');
// const green = document.getElementById('green');
// const blue = document.getElementById('blue');

// const R_OFFSET = 0;
// const G_OFFSET = 1;
// const B_OFFSET = 2;

// let imgData = null;
// let originalPixels = null;
// let currentPixels = null;

// fileinput.onchange = function (e) {
//   if (e.target.files && e.target.files.item(0)) {
//     srcImage.src = URL.createObjectURL(e.target.files[0]);
//   }
// }

// srcImage.onload = function () {
//   canvas.width = srcImage.width;
//   canvas.height = srcImage.height;
//   ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height);
//   imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height);
//   originalPixels = imgData.data.slice();
//   console.log(imgData)
// }

// function getIndex(x=0, y=0) {
//   return (x + y * srcImage.width) * 4;
// }

// function clamp(value) {
//   return Math.max(0, Math.min(Math.floor(value), 255))
// }

// function addRed(x, y, value) {
//   const index = getIndex(x, y) + R_OFFSET;
//   const currentValue = currentPixels[index];
//   currentPixels[index] = clamp(currentValue + value);
// }

// function addGreen(x, y, value) {
//   const index = getIndex(x, y) + G_OFFSET;
//   const currentValue = currentPixels[index];
//   currentPixels[index] = clamp(currentValue + value);
// }

// function addBlue(x, y, value) {
//   const index = getIndex(x, y) + B_OFFSET;
//   const currentValue = currentPixels[index];
//   currentPixels[index] = clamp(currentValue + value);
// }

// function commitChanges() {
//   for (let i = 0; i < imgData.data.length; i++) {
//     imgData.data[i] = currentPixels[i];
//   }

//   ctx.putImageData(imgData, 0, 0, 0, 0, srcImage.width, srcImage.height)
// }

// function runPipeline() {
//   currentPixels = originalPixels.slice();

//   const redFilter = Number(red.value);
//   const greenFilter = Number(green.value);
//   const blueFilter = Number(blue.value);

//   for (let i = 0; i < srcImage.height; i++) {
//     for (let j = 0; j < srcImage.width; j++) {
   
//       addRed(j, i, redFilter);
//       addGreen(j, i, greenFilter);
//       addBlue(j, i, blueFilter);

//     }
//   }
  
//   commitChanges();
// }

// red.onchange = runPipeline;
// green.onchange = runPipeline;
// blue.onchange = runPipeline;


//----------------------Using webWorkers------------------------

const myWorker = new Worker('worker.js');

const fileinput = document.getElementById('fileinput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const srcImage = new Image;

let imgData = null;
let originalPixels = null;
let currentPixels = null;

const red = document.getElementById('red');
const green = document.getElementById('green');
const blue = document.getElementById('blue');

fileinput.onchange = function (e) {
  if (e.target.files && e.target.files.item(0)) {
    srcImage.src = URL.createObjectURL(e.target.files[0]);
  }
}

srcImage.onload = function () {
  canvas.width = srcImage.width;
  canvas.height = srcImage.height;
  ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height);
  imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height);
  originalPixels = imgData.data.slice();

  myWorker.postMessage(["onload", srcImage.height, srcImage.width, originalPixels, imgData]);
}

myWorker.onmessage = function(event){
  imgData = event.data;

  ctx.putImageData(imgData, 0, 0, 0, 0, srcImage.width, srcImage.height);
}

red.onchange = function(){
  myWorker.postMessage([Number(red.value), Number(green.value), Number(blue.value)]);
};

green.onchange = function(){
  myWorker.postMessage([Number(red.value), Number(green.value), Number(blue.value)]);
};

blue.onchange = function(){
  myWorker.postMessage([Number(red.value), Number(green.value), Number(blue.value)]);
};




