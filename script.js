const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');

navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((error) => {
        console.error("Lỗi khi truy cập camera:", error);
    });

let model;

// Tải mô hình Teachable Machine
async function loadModel() {
    const modelURL = "URL_CUA_MO_HINH_TRAIN";  // Thay bằng URL mô hình thực tế
    model = await tmImage.load(modelURL);
    console.log("Model loaded");
}

// Gọi hàm tải mô hình khi trang mở
loadModel();

function captureImage() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    classifyImage(canvas);
}

async function classifyImage(canvas) {
    result.innerText = "Đang nhận diện...";
    
    if (model) {
        const predictions = await model.predict(canvas);
        const topPrediction = predictions[0];
        
        result.innerText = `Kết quả: ${topPrediction.className} - Tỉ lệ: ${(topPrediction.probability * 100).toFixed(2)}%`;
    } else {
        result.innerText = "Mô hình chưa sẵn sàng!";
    }
}
