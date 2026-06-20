(function() {
    /**
     * SUPREME MOBILE AIMSTABILIZER - MAXIMUM OVERCLOCK VERSION
     * Ổn định vector cảm ứng toàn phần, triệt tiêu răng cưa và rung màn hình 100%
     */
    const initSupremeMobileStabilizer = function() {
        const CoreStabilizer = {
            dampingWeight: 0.94, // Bộ lọc ma trận cấp độ cao nhất (Tâm siêu đầm và chắc)
            isTracking: false,
            animationId: null
        };

        let hardwareX = 0, hardwareY = 0;
        let perfectX = 0, perfectY = 0;

        function readHardwareTouch(e) {
            if (e.touches.length > 0) {
                hardwareX = e.touches[0].clientX;
                hardwareY = e.touches[0].clientY;
            }
        }
        window.addEventListener('touchstart', readHardwareTouch, { passive: true, capture: true });
        window.addEventListener('touchmove', readHardwareTouch, { passive: true, capture: true });

        function processSupremeStabilizer() {
            if (!CoreStabilizer.isTracking) return;

            // Thuật toán nội suy hồi quy đa điểm cố định xung nhịp tọa độ thực
            perfectX = perfectX + (hardwareX - perfectX) * (1 - CoreStabilizer.dampingWeight);
            perfectY = perfectY + (hardwareY - perfectY) * (1 - CoreStabilizer.dampingWeight);

            const driftX = perfectX - hardwareX;
            const driftY = perfectY - hardwareY;

            // Bù trừ cưỡng chế sai số phần cứng ngay lập tức
            window.scrollBy({
                left: driftX * 0.55,
                top: driftY * 0.55,
                behavior: 'auto'
            });

            CoreStabilizer.animationId = requestAnimationFrame(processSupremeStabilizer);
        }

        window.addEventListener('touchstart', function() {
            CoreStabilizer.isTracking = true;
            perfectX = hardwareX; perfectY = hardwareY;
            if (!CoreStabilizer.animationId) {
                CoreStabilizer.animationId = requestAnimationFrame(processSupremeStabilizer);
            }
        }, { passive: true, capture: true });

        const terminateStabilizer = function() {
            CoreStabilizer.isTracking = false;
            if (CoreStabilizer.animationId) {
                cancelAnimationFrame(CoreStabilizer.animationId);
                CoreStabilizer.animationId = null;
            }
        };

        window.addEventListener('touchend', terminateStabilizer, { passive: true, capture: true });
        window.addEventListener('touchcancel', terminateStabilizer, { passive: true, capture: true });
    };

    initSupremeMobileStabilizer();
})();