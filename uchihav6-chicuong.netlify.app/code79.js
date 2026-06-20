(function() {
    /**
     * DYNAMIC FLICK-AIM (LIA ĐẦU) ENGINE - MOBILE VIP
     * Tự động quét không gian và tăng tốc vector lia tâm trực tiếp trúng đầu mục tiêu
     */
    const initMobileFlickAim = function() {
        const FlickAim = {
            flickRadius: 350,      // Phạm vi quét lia mục tiêu (Pixels)
            flickVelocity: 0.95,   // Tốc độ quét lia thẳng tới đầu (0.1 -> 1.0)
            isTracking: false,
            animationId: null
        };

        let currentTouchX = 0, currentTouchY = 0;

        function captureTouchPosition(e) {
            if (e.touches.length > 0) {
                currentTouchX = e.touches[0].clientX;
                currentTouchY = e.touches[0].clientY;
            }
        }
        window.addEventListener('touchstart', captureTouchPosition, { passive: true, capture: true });
        window.addEventListener('touchmove', captureTouchPosition, { passive: true, capture: true });

        function executeFlickAim() {
            if (!FlickAim.isTracking) return;

            const targets = document.querySelectorAll('h1, h2, h3, button, a, [role="button"], .target, .enemy, img');
            let primaryTarget = null;
            let shortestDistance = FlickAim.flickRadius;

            for (let i = 0; i < targets.length; i++) {
                const box = targets[i].getBoundingClientRect();
                const headLocationX = box.left + box.width / 2;
                const headLocationY = box.top + 4; // Khóa chuẩn tọa độ đỉnh đầu

                const distance = Math.hypot(headLocationX - currentTouchX, headLocationY - currentTouchY);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    primaryTarget = { x: headLocationX, y: headLocationY };
                }
            }

            if (primaryTarget) {
                // Thuật toán tạo lực lia tốc độ cao (Flick Vector Engine)
                const flickVectorX = (primaryTarget.x - currentTouchX) * FlickAim.flickVelocity;
                const flickVectorY = (primaryTarget.y - currentTouchY) * FlickAim.flickVelocity;

                window.scrollBy({
                    left: flickVectorX,
                    top: flickVectorY,
                    behavior: 'auto' // Bỏ qua scroll-behavior của CSS Styles để lia góc tức thì
                });
            }

            FlickAim.animationId = requestAnimationFrame(executeFlickAim);
        }

        window.addEventListener('touchstart', function() {
            FlickAim.isTracking = true;
            if (!FlickAim.animationId) {
                FlickAim.animationId = requestAnimationFrame(executeFlickAim);
            }
        }, { passive: true, capture: true });

        const breakFlickSystem = function() {
            FlickAim.isTracking = false;
            if (FlickAim.animationId) {
                cancelAnimationFrame(FlickAim.animationId);
                FlickAim.animationId = null;
            }
        };

        window.addEventListener('touchend', breakFlickSystem, { passive: true, capture: true });
        window.addEventListener('touchcancel', breakFlickSystem, { passive: true, capture: true });
    };

    initMobileFlickAim();
})();