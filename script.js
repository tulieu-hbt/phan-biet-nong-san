const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');

// Khởi động camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((error) => {
        console.error("Lỗi khi truy cập camera:", error);
    });

// Chụp ảnh từ camera
function captureImage() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Lấy hình ảnh từ canvas và gửi đến model AI
    classifyImage(canvas.toDataURL('image/png'));
}

// Hàm gọi mô hình AI mẫu và hiển thị kết quả
async function classifyImage(imageData) {
    result.innerText = "Đang nhận diện...";

    // Đây là ví dụ sử dụng mô hình mẫu của Teachable Machine.
    // Thay URL dưới đây bằng link mô hình của bạn sau khi huấn luyện
    const modelURL = "URL_CUA_MO_HINH_TRAIN";
    
    // Tải mô hình và phân loại
    const model = await tmImage.load(modelURL);
    const predictions = await model.predict(canvas);

    // Hiển thị kết quả
    result.innerText = `Kết quả: ${predictions[0].className} - Tỉ lệ: ${predictions[0].probability.toFixed(2) * 100}%`;
}
