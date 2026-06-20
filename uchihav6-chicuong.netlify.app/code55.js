(function() {
    // Ép trình duyệt thiết lập cấu hình render liên tục ở tần suất cao nhất
    function forceHighRefreshRate() {
        // Sử dụng requestAnimationFrame lồng nhau để tối ưu hóa chu kỳ quét màn hình
        window.requestAnimationFrame(function() {
            // Thực hiện một thao tác đọc/ghi siêu nhẹ để kích hoạt chu kỳ làm mới màn hình
            const trigger = document.documentElement.offsetHeight; 
            forceHighRefreshRate();
        });
    }
    
    // Chạy cưỡng chế ngay khi cấu hình hệ thống sẵn sàng
    if (window.requestAnimationFrame) {
        forceHighRefreshRate();
    }
})();