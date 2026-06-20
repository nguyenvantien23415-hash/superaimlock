(function() {
    /**
     * LIGHT-AIM & ANTI-OVERAIM ENGINE - MAXIMUM OVERCLOCK VERSION
     * Trợ lực kéo tâm siêu nhẹ, tự động phanh cứng điểm dừng tại đầu mục tiêu không bị vọt quá
     */
    const initSupremeMobileLightAim = function() {
        const LightAimEngine = {
            scanRange: 320,        // Phạm vi ma trận quét nam châm
            velocityBoostY: 2.5,   // Hệ số làm nhẹ tâm (Khuếch đại gia tốc vuốt trục Y lên đầu)
            hydraulicBrake: 4,     // Ngưỡng khoảng cách kích hoạt phanh cưỡng chế (pixels)
            isMoving: false,
            animationId: null
        };

        let deviceTouchX = 0, deviceTouchY = 0;

        function trackMobileTouch(e) {
            if (e.touches.length > 0) {
                deviceTouchX = e.touches[0].clientX;
                deviceTouchY = e.touches[0].clientY;
            }
        }
        window.addEventListener('touchstart', trackMobileTouch, { passive: true, capture: true });
        window.addEventListener('touchmove', trackMobileTouch, { passive: true, capture: true });

        function processSupremeLightAim() {
            if (!LightAimEngine.isMoving) return;

            const targets = document.querySelectorAll('h1, h2, h3, button, a, [role="button"], .target, .enemy');
            let targetHeadPosition = null;
            let nearestDistance = LightAimEngine.scanRange;

            for (let i = 0; i < targets.length; i++) {
                const rect = targets[i].getBoundingClientRect();
                const preciseHeadX = rect.left + rect.width / 2;
                const preciseHeadY = rect.top + 4; // Tọa độ đỉnh đầu mục tiêu

                const distance = Math.hypot(preciseHeadX - deviceTouchX, preciseHeadY - deviceTouchY);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    targetHeadPosition = { x: preciseHeadX, y: preciseHeadY };
                }
            }

            if (targetHeadPosition) {
                const deltaX = targetHeadPosition.x - deviceTouchX;
                const deltaY = targetHeadPosition.y - deviceTouchY;
                const realTimeDistance = Math.hypot(deltaX, deltaY);

                // THUẬT TOÁN ĐIỀU PHỐI PHANH CỨNG TOÁN HỌC
                if (realTimeDistance > LightAimEngine.hydraulicBrake) {
                    // Ngoài vùng phanh: Khuếch đại lực vuốt trục Y giúp kéo tâm cực kỳ nhẹ nhàng và chuẩn hướng
                    window.scrollBy({
                        left: deltaX * 0.55,
                        top: (deltaY * 0.55) * LightAimEngine.velocityBoostY,
                        behavior: 'auto'
                    });
                } else {
                    // Đã dính đỉnh đầu: Lực kéo tự động triệt tiêu hoàn toàn về 0, chặn đứng hiện tượng quá đầu
                    window.scrollBy({ left: 0, top: 0, behavior: 'auto' });
                }
            }

            LightAimEngine.animationId = requestAnimationFrame(processSupremeLightAim);
        }

        window.addEventListener('touchstart', function() {
            LightAimEngine.isMoving = true;
            if (!LightAimEngine.animationId) {
                LightAimEngine.animationId = requestAnimationFrame(processSupremeLightAim);
            }
        }, { passive: true, capture: true });

        const stopLightAimEngine = function() {
            LightAimEngine.isMoving = false;
            if (LightAimEngine.animationId) {
                cancelAnimationFrame(LightAimEngine.animationId);
                LightAimEngine.animationId = null;
            }
        };

        window.addEventListener('touchend', stopLightAimEngine, { passive: true, capture: true });
        window.addEventListener('touchcancel', stopLightAimEngine, { passive: true, capture: true });
    };

    initSupremeMobileLightAim();
})();