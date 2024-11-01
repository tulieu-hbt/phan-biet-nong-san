// Thêm thư viện Teachable Machine Image
// Bạn cần thêm dòng này trong phần <head> của HTML
// <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js"></script>

const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');

// Từ điển chuyển đổi từ tiếng Anh sang tiếng Việt cho các nông sản
const vietnameseNames = {
    "banana": "Chuối",
    "orange": "Cam",
    "apple": "Táo",
    "carrot": "Cà rốt",
    "broccoli": "Bông cải",
    "grape": "Nho",
    "pineapple": "Dứa",
    "dragon fruit": "Thanh long",
    // Thêm nhiều từ vựng hơn nếu cần
};

// Khởi động camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((error) => {
        console.error("Lỗi khi truy cập camera:", error);
        result.innerText = "Lỗi khi truy cập camera!";
    });

let model;

// Hàm tải mô hình từ Teachable Machine
async function loadModel() {
    try {
        console.log("Đang tải mô hình từ Teachable Machine...");
        const modelURL = "model/model.json"; // Đường dẫn tới model.json
        const metadataURL = "model/metadata.json"; // Đường dẫn tới metadata.json nếu có
        model = await tmImage.load(modelURL, metadataURL);
        console.log("Mô hình đã được tải thành công");
        result.innerText = "Mô hình đã sẵn sàng. Hãy chụp hình!";
    } catch (error) {
        console.error("Lỗi khi tải mô hình:", error);
        result.innerText = "Không thể tải mô hình!";
    }
}

// Gọi hàm tải mô hình khi trang mở
loadModel();

// Hàm chụp ảnh từ camera
function captureImage() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    classifyImage(canvas);
}

// Hàm phân loại hình ảnh
async function classifyImage(canvas) {
    result.innerText = "Đang nhận diện...";

    if (model) {
        try {
            console.log("Đang phân loại hình ảnh...");
            const predictions = await model.predict(canvas);
            const topPrediction = predictions[0];

            // Lấy tên đối tượng tiếng Anh từ kết quả phân loại
            const predictedName = topPrediction.className.toLowerCase();

            // Kiểm tra tên tiếng Anh có trong từ điển không
            if (vietnameseNames.hasOwnProperty(predictedName)) {
                const vietnameseName = vietnameseNames[predictedName];
                result.innerText = `Kết quả: ${vietnameseName} - Tỉ lệ: ${(topPrediction.probability * 100).toFixed(2)}%`;
            } else {
                result.innerText = "Đây không phải là nông sản";
            }

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

// Thêm sự kiện khi nhấn nút chụp ảnh
const captureButton = document.getElementById('capture-button');
captureButton.addEventListener('click', captureImage);
