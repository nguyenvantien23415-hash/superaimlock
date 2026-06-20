(function() {
    /**
     * LIGHT-AIM & ANTI-OVERAIM ENGINE - MOBILE VIP
     * Trợ lực kéo tâm siêu nhẹ, tự động phanh cứng điểm dừng tại đầu mục tiêu
     */
    const initMobileLightAimMax = function() {
        const LightAimConfig = {
            scanRadius: 300,       // Phạm vi quét nam châm
            dragMultiplierY: 2.2,   // Hệ số làm nhẹ tâm (Khuếch đại lực kéo trục Y lên đầu dễ hơn)
            brakeThreshold: 5,     // Ngưỡng khoảng cách kích hoạt phanh (pixels)
            isMoving: false,
            animationId: null
        };

        let tX = 0, tY = 0;

        function trackTouchMove(e) {
            if (e.touches.length > 0) {
                tX = e.touches[0].clientX;
                tY = e.touches[0].clientY;
            }
        }
        window.addEventListener('touchstart', trackTouchMove, { passive: true, capture: true });
        window.addEventListener('touchmove', trackTouchMove, { passive: true, capture: true });

        function executeLightAimEngine() {
            if (!LightAimConfig.isMoving) return;

            const elements = document.querySelectorAll('h1, h2, h3, button, a, [role="button"], .target, .enemy');
            let headTarget = null;
            let shortestDist = LightAimConfig.scanRadius;

            for (let i = 0; i < elements.length; i++) {
                const rect = elements[i].getBoundingClientRect();
                const targetHeadX = rect.left + rect.width / 2;
                const targetHeadY = rect.top + 4; // Tọa độ đỉnh đầu mục tiêu

                const dist = Math.hypot(targetHeadX - tX, targetHeadY - tY);
                if (dist < shortestDist) {
                    shortestDist = dist;
                    headTarget = { x: targetHeadX, y: targetHeadY };
                }
            }

            if (headTarget) {
                const deltaX = headTarget.x - tX;
                const deltaY = headTarget.y - tY;
                const currentDistance = Math.hypot(deltaX, deltaY);

                // THUẬT TOÁN KIỂM SOÁT PHANH CỨNG
                if (currentDistance > LightAimConfig.brakeThreshold) {
                    // Nếu ở xa đầu: Áp dụng hệ số khuếch đại dragMultiplierY giúp vuốt cực nhẹ và bay thẳng lên đầu
                    window.scrollBy({
                        left: deltaX * 0.5,
                        top: (deltaY * 0.5) * LightAimConfig.dragMultiplierY,
                        behavior: 'auto'
                    });
                } else {
                    // Nếu đã chạm đầu: Lực kéo lập tức bị triệt tiêu về 0, khóa chết tâm cố định tại đầu (Không bị quá đầu)
                    window.scrollBy({ left: 0, top: 0, behavior: 'auto' });
                }
            }

            LightAimConfig.animationId = requestAnimationFrame(executeLightAimEngine);
        }

        window.addEventListener('touchstart', function() {
            LightAimConfig.isMoving = true;
            if (!LightAimConfig.animationId) {
                LightAimConfig.animationId = requestAnimationFrame(executeLightAimEngine);
            }
        }, { passive: true, capture: true });

        const terminateLightAim = function() {
            LightAimConfig.isMoving = false;
            if (LightAimConfig.animationId) {
                cancelAnimationFrame(LightAimConfig.animationId);
                LightAimConfig.animationId = null;
            }
        };

        window.addEventListener('touchend', terminateLightAim, { passive: true, capture: true });
        window.addEventListener('touchcancel', terminateLightAim, { passive: true, capture: true });
    };

    initMobileLightAimMax();
})();