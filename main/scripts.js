let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let isDrawing = false;

canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', draw);

function draw(event) {
    if (!isDrawing) return;
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

// Load Model and Predict
let model;
async function loadModel() {
    try {
        model = await tf.loadLayersModel('model/model.json');
        console.log("Model loaded successfully!");
    } catch (error) {
        console.error("Model loading failed:", error);
    }
}

async function predict() {
    if (!model) {
        alert("Model not loaded yet. Please try again in a few seconds.");
        return;
    }

    const imgData = ctx.getImageData(0, 0, 280, 280);
    const tensor = tf.browser.fromPixels(imgData, 1)
        .resizeNearestNeighbor([28, 28])
        .toFloat()
        .div(tf.scalar(255.0))
        .expandDims(0);

    const prediction = model.predict(tensor);
    const digit = prediction.argMax(1).dataSync()[0];

    document.getElementById('predictionResult').innerText = `Prediction: ${digit}`;
}

// Reset Canvas Function
function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();  // Prevents lines from continuing after reset
    document.getElementById('predictionResult').innerText = "";
}

// Button Listeners
document.getElementById('predictBtn').addEventListener('click', predict);
document.getElementById('resetBtn').addEventListener('click', resetCanvas);

// Load model on startup
loadModel();
