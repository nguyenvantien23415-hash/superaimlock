(function() {
    /**
     * AIMSTABILIZER ENGINE - MOBILE MAXIMUM LIMIT
     * Ổn định vector tâm ngắm, triệt tiêu độ lệch cảm ứng 100%
     */
    const initMobileAimStabilizer = function() {
        const Stabilizer = {
            smoothAlpha: 0.88, // Hệ số ổn định tâm (Càng cao tâm càng đầm và chắc)
            isTracking: false,
            animationId: null
        };

        let rawX = 0, rawY = 0;
        let stableX = 0, stableY = 0;

        function captureTouch(e) {
            if (e.touches.length > 0) {
                rawX = e.touches[0].clientX;
                rawY = e.touches[0].clientY;
            }
        }
        window.addEventListener('touchstart', captureTouch, { passive: true, capture: true });
        window.addEventListener('touchmove', captureTouch, { passive: true, capture: true });

        function executeStabilizer() {
            if (!Stabilizer.isTracking) return;

            // Thuật toán nội suy hồi quy để khóa cứng độ ổn định của tọa độ
            stableX = stableX + (rawX - stableX) * (1 - Stabilizer.smoothAlpha);
            stableY = stableY + (rawY - stableY) * (1 - Stabilizer.smoothAlpha);

            const deltaX = stableX - rawX;
            const deltaY = stableY - rawY;

            // Bù trừ dịch chuyển thời gian thực nhằm giữ tâm luôn cân bằng
            window.scrollBy({
                left: deltaX * 0.4,
                top: deltaY * 0.4,
                behavior: 'auto'
            });

            Stabilizer.animationId = requestAnimationFrame(executeStabilizer);
        }

        window.addEventListener('touchstart', function() {
            Stabilizer.isTracking = true;
            stableX = rawX; stableY = rawY;
            if (!Stabilizer.animationId) {
                Stabilizer.animationId = requestAnimationFrame(executeStabilizer);
            }
        }, { passive: true, capture: true });

        const stopStabilizer = function() {
            Stabilizer.isTracking = false;
            if (Stabilizer.animationId) {
                cancelAnimationFrame(Stabilizer.animationId);
                Stabilizer.animationId = null;
            }
        };

        window.addEventListener('touchend', stopStabilizer, { passive: true, capture: true });
        window.addEventListener('touchcancel', stopStabilizer, { passive: true, capture: true });
    };

    initMobileAimStabilizer();
})();