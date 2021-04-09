let imgWidth = 0;
let imgHeight = 0;
let originalPixels = null;
let currentPixels = null;
let imgData = null;

const R_OFFSET = 0;
const G_OFFSET = 1;
const B_OFFSET = 2;

function getIndex(x=0, y=0) {
  return (x + y * imgWidth) * 4;
}

function clamp(value) {
  return Math.max(0, Math.min(Math.floor(value), 255))
}

function addRed(x, y, value) {
  const index = getIndex(x, y) + R_OFFSET;
  const currentValue = currentPixels[index];
  currentPixels[index] = clamp(currentValue + value);
}

function addGreen(x, y, value) {
  const index = getIndex(x, y) + G_OFFSET;
  const currentValue = currentPixels[index];
  currentPixels[index] = clamp(currentValue + value);
}

function addBlue(x, y, value) {
  const index = getIndex(x, y) + B_OFFSET;
  const currentValue = currentPixels[index];
  currentPixels[index] = clamp(currentValue + value);
}

function commitChanges() {
  for (let i = 0; i < imgData.data.length; i++) {
    imgData.data[i] = currentPixels[i];
  }

  postMessage(imgData);
}

function runPipeline(redFilter, greenFilter, blueFilter) {
  currentPixels = originalPixels.slice();

  for (let i = 0; i < imgHeight; i++) {
    for (let j = 0; j < imgWidth; j++) {
   
      addRed(j, i, redFilter);
      addGreen(j, i, greenFilter);
      addBlue(j, i, blueFilter);

    }
  }
  
  commitChanges();
}


onmessage = function(event) {

  if(event.data[0] === "onload"){
    imgHeight = event.data[1];
    imgWidth = event.data[2];
    originalPixels = event.data[3];
    imgData = event.data[4];
  }else{
    const redFilter = event.data[0];
    const greenFilter = event.data[1];
    const blueFilter = event.data[2];
    runPipeline(redFilter, greenFilter, blueFilter);
  }

}