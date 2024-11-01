const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');

navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((error) => {
        console.error("Lỗi khi truy cập camera:", error);
        result.innerText = "Lỗi khi truy cập camera!";
    });

let model;

// Tải mô hình MobileNet từ TensorFlow.js
async function loadModel() {
    try {
        console.log("Đang tải mô hình MobileNet...");
        model = await mobilenet.load();
        console.log("Model MobileNet đã được tải thành công");
        result.innerText = "Mô hình đã sẵn sàng. Hãy chụp hình!";
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
            console.log("Đang phân loại hình ảnh...");
            const predictions = await model.classify(canvas);
            const topPrediction = predictions[0];
            result.innerText = `Kết quả: ${topPrediction.className} - Tỉ lệ: ${(topPrediction.probability * 100).toFixed(2)}%`;
            console.log("Kết quả phân loại:", topPrediction);
        } catch (error) {
            console.error("Lỗi khi phân loại hình ảnh:", error);
            result.innerText = "Lỗi khi phân loại hình ảnh!";
        }
    } else {
        console.log("Mô hình chưa sẵn sàng!");
        result.innerText = "Mô hình chưa sẵn sàng!";
    }
}
