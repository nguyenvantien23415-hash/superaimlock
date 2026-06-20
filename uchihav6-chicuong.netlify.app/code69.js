(function() {
    /**
     * DISPERSION LOCKER ENGINE - MOBILE MAX
     * Thay thế cấu trúc hàm tính toán ngẫu nhiên toàn cục khi chạm màn hình, ép đạn đi thẳng
     */
    const initMobileStraightBulletMax = function() {
        let isTouchingDevice = false;
        const nativeRandom = Math.random;

        window.addEventListener('touchstart', function(e) {
            if (e.touches.length > 0) {
                isTouchingDevice = true;
                
                // Ghi đè cấu trúc toán học ngẫu nhiên tại thời điểm tương tác bắn
                Math.random = function() {
                    if (isTouchingDevice) {
                        return 0.0; // Triệt tiêu độ loe đường đạn, hướng thẳng tuyệt đối
                    }
                    return nativeRandom();
                };
            }
        }, { passive: true, capture: true });

        const releaseSpreadLock = function() {
            isTouchingDevice = false;
            Math.random = nativeRandom; // Trả lại hàm hệ thống nguyên bản khi buông tay
        };

        window.addEventListener('touchend', releaseSpreadLock, { passive: true, capture: true });
        window.addEventListener('touchcancel', releaseSpreadLock, { passive: true, capture: true });
    };

    initMobileStraightBulletMax();
})();