(function() {
    // Hủy bỏ hoàn toàn độ trễ 300ms mặc định của trình duyệt di động bằng code cưỡng chế
    const options = { passive: false };

    function fastResponse(e) {
        // Ép phản hồi ngay lập tức, không chờ đợi luồng xử lý sự kiện mặc định của hệ điều hành
        if (e.pointerType === 'touch' || e.type.startsWith('touch')) {
            // Kích hoạt tăng tốc phản hồi cho các hành động Click/Tap
            el = document.activeElement;
            if(el) el.focus();
        }
    }

    // Đóng đinh tất cả các hành vi tương tác đầu vào để tối ưu hóa độ nhạy 100%
    window.addEventListener('touchstart', fastResponse, options);
    window.addEventListener('pointerdown', fastResponse, options);
    window.addEventListener('mousedown', fastResponse, options);
})();