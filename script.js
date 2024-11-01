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

// Tải mô hình MobileNet từ TensorFlow.js
async function loadModel() {
    try {
        model = await mobilenet.load();
        console.log("Model MobileNet đã được tải thành công");
    } catch (error) {
        console.error("Lỗi khi tải mô hình MobileNet:", error);
        result.innerText = "Không thể tải mô hình. Kiểm tra kết nối mạng!";
    }
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
        try {
            const predictions = await model.classify(canvas);
            const topPrediction = predictions[0];
            result.innerText = `Kết quả: ${topPrediction.className} - Tỉ lệ: ${(topPrediction.probability * 100).toFixed(2)}%`;
        } catch (error) {
            console.error("Lỗi khi phân loại hình ảnh:", error);
            result.innerText = "Lỗi khi phân loại hình ảnh!";
        }
    } else {
        result.innerText = "Mô hình chưa sẵn sàng!";
    }
}
