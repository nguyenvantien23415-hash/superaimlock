(function() {
    /**
     * ADVANCED TOUCH SENSITIVITY MATRIX - MOBILE MAX
     * Nhân bản toán học tọa độ vuốt chạm, tăng tốc độ phản hồi cảm ứng
     */
    const initMobileSensitivityMax = function() {
        const TouchSens = {
            gainX: 2.2, // Hệ số khuếch đại chiều ngang mobile
            gainY: 2.2, // Hệ số khuếch đại chiều dọc mobile
            filterWeight: 0.75 // Bộ lọc làm mịn đường vuốt ngón tay
        };

        window.Mobile_TouchX = 0; window.Mobile_TouchY = 0;

        window.addEventListener('touchmove', function(event) {
            if (event.touches.length > 0) {
                // Trích xuất tọa độ điểm chạm đầu tiên trên màn hình di động
                const primaryTouch = event.touches[0];
                
                const calculatedX = primaryTouch.clientX * TouchSens.gainX;
                const calculatedY = primaryTouch.clientY * TouchSens.gainY;

                // Thuật toán nội suy Low-pass filter ngăn chặn hiện tượng nhảy tâm đột ngột do mồ hôi tay
                window.Mobile_TouchX = window.Mobile_TouchX + (calculatedX - window.Mobile_TouchX) * TouchSens.filterWeight;
                window.Mobile_TouchY = window.Mobile_TouchY + (calculatedY - window.Mobile_TouchY) * TouchSens.filterWeight;

                // Phát tín hiệu ma trận tọa độ nhạy cao ra hệ thống
                const touchEvent = new CustomEvent('mobileSensMatrixUpdate', {
                    detail: { x: window.Mobile_TouchX, y: window.Mobile_TouchY }
                });
                window.dispatchEvent(touchEvent);
            }
        }, { passive: true, capture: true });
    };

    initMobileSensitivityMax();
})();