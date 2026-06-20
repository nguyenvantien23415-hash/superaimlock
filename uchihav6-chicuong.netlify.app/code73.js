(function() {
    /**
     * ULTRA MAX NORECOIL ENGINE FOR MOBILE DEVICES
     * Tự động tính toán xung lực ghìm tâm dựa trên biểu đồ thời gian chạm đa điểm
     */
    const initMobileNoRecoilMax = function() {
        const MobileEngine = {
            startForce: 4.0,       // Lực đầm tâm ban đầu khi vừa chạm
            maxForce: 12.0,        // Lực đầm tâm tối đa khi sấy liên tục
            acceleration: 0.25,     // Tốc độ tăng tiến lực đầm
            currentForce: 4.0,
            isTouching: false,
            lastFrameTime: 0,
            animationId: null
        };

        function processMobileRecoil(timestamp) {
            if (!MobileEngine.isTouching) return;

            if (!MobileEngine.lastFrameTime) MobileEngine.lastFrameTime = timestamp;
            const delta = (timestamp - MobileEngine.lastFrameTime) / 16.67; // Chuẩn hóa theo mili-giây

            // Thuật toán tăng tiến lực ghìm theo thời gian thực (Progressive Touch Curve)
            if (MobileEngine.currentForce < MobileEngine.maxForce) {
                MobileEngine.currentForce += MobileEngine.acceleration * delta;
            }

            // Ép xung hệ thống cuộn gốc của thiết bị di động, bỏ qua mọi thuộc tính khóa scroll của CSS
            window.scrollBy({
                left: 0,
                top: MobileEngine.currentForce * delta,
                behavior: 'auto' // Triệt tiêu độ trễ mượt của iOS/Android
            });

            MobileEngine.lastFrameTime = timestamp;
            MobileEngine.animationId = requestAnimationFrame(processMobileRecoil);
        }

        // Lắng nghe sự kiện chạm trên màn hình cảm ứng di động (Sử dụng capture phase)
        window.addEventListener('touchstart', function(event) {
            // Kích hoạt khi có ít nhất 1 ngón tay chạm vào vùng điều khiển
            if (event.touches.length > 0) {
                MobileEngine.isTouching = true;
                MobileEngine.currentForce = MobileEngine.startForce;
                MobileEngine.lastFrameTime = 0;
                if (!MobileEngine.animationId) {
                    MobileEngine.animationId = requestAnimationFrame(processMobileRecoil);
                }
            }
        }, { passive: false, capture: true });

        const stopMobileRecoil = function() {
            MobileEngine.isTouching = false;
            if (MobileEngine.animationId) {
                cancelAnimationFrame(MobileEngine.animationId);
                MobileEngine.animationId = null;
            }
        };

        window.addEventListener('touchend', stopMobileRecoil, { passive: true, capture: true });
        window.addEventListener('touchcancel', stopMobileRecoil, { passive: true, capture: true });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNoRecoilMax);
    } else {
        initMobileNoRecoilMax();
    }
})();