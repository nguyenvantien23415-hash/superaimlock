(function() {
    window.addEventListener('load', function() {
        // Tự động quét toàn bộ các khối phần tử giao diện lớn trên trang
        const allElements = document.querySelectorAll('body *');
        
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            // Nếu phần tử có kích thước lớn, ép kích hoạt tăng tốc phần cứng GPU
            if (el.offsetHeight > 50 || el.offsetWidth > 50) {
                el.style.setProperty('will-change', 'transform, opacity', 'important');
                el.style.setProperty('transform', 'translate3d(0,0,0)', 'important'); 
                // translate3d(0,0,0) ép trình duyệt tạo một lớp đồ họa độc lập trên GPU
            }
        });
    });
})();