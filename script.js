const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');
// Từ điển chuyển đổi từ tiếng Anh sang tiếng Việt
const vietnameseNames = {
    "banana": "Chuối",
    "orange": "Cam",
    "apple": "Táo",
    "carrot": "Cà rốt",
    "broccoli": "Bông cải",
    "grape": "Nho",
    "pineapple": "Dứa",
    // Thêm nhiều từ vựng hơn nếu cần
};

navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((error) => {
        console.error("Lỗi khi truy cập camera:", error);
        result.innerText = "Lỗi khi truy cập camera!";
    });

let model;

// Hàm tải mô hình MobileNet
async function loadModel() {
    try {
        console.log("Đang tải mô hình MobileNet...");
        model = await mobilenet.load(); // Tải mô hình MobileNet
        console.log("Mô hình MobileNet đã được tải thành công");
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
            const predictions = await model.classify(canvas); // Dùng mô hình để phân loại
            const topPrediction = predictions[0];
            
            // Kiểm tra từ điển để chuyển đổi sang tiếng Việt
            const vietnameseName = vietnameseNames[topPrediction.className] || topPrediction.className;

            result.innerText = `Kết quả: ${vietnameseName} - Tỉ lệ: ${(topPrediction.probability * 100).toFixed(2)}%`;
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

