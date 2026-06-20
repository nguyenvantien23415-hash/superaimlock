(function() {
    /**
     * SUPREME FLICK-AIM (LIA ĐẦU) ENGINE - MAXIMUM OVERCLOCK VERSION
     * Tự động quét không gian và tăng tốc ma trận lia tâm trực tiếp trúng đầu mục tiêu siêu tốc
     */
    const initSupremeMobileFlickAim = function() {
        const FlickAimCore = {
            flickScanRadius: 380,   // Phạm vi ma trận quét lia mục tiêu diện rộng
            flickVelocityMax: 0.99, // Tốc độ quét lia thẳng tới đầu (Mức tối đa phản hồi tức thì)
            isTracking: false,
            animationId: null
        };

        let activeTouchX = 0, activeTouchY = 0;

        function captureMobileTouch(e) {
            if (e.touches.length > 0) {
                activeTouchX = e.touches[0].clientX;
                activeTouchY = e.touches[0].clientY;
            }
        }
        window.addEventListener('touchstart', captureMobileTouch, { passive: true, capture: true });
        window.addEventListener('touchmove', captureMobileTouch, { passive: true, capture: true });

        function processSupremeFlickAim() {
            if (!FlickAimCore.isTracking) return;

            const elements = document.querySelectorAll('h1, h2, h3, button, a, [role="button"], .target, .enemy, img');
            let optimalTarget = null;
            let absoluteShortestDist = FlickAimCore.flickScanRadius;

            for (let i = 0; i < elements.length; i++) {
                const box = elements[i].getBoundingClientRect();
                const targetHeadX = box.left + box.width / 2;
                const targetHeadY = box.top + 4; // Khóa chuẩn tọa độ đỉnh đầu

                const distance = Math.hypot(targetHeadX - activeTouchX, targetHeadY - activeTouchY);
                if (distance < absoluteShortestDist) {
                    absoluteShortestDist = distance;
                    optimalTarget = { x: targetHeadX, y: targetHeadY };
                }
            }

            if (optimalTarget) {
                // Thuật toán tạo gia tốc chuyển góc siêu tốc (High-Velocity Flick Vector)
                const finalFlickVectorX = (optimalTarget.x - activeTouchX) * FlickAimCore.flickVelocityMax;
                const finalFlickVectorY = (optimalTarget.y - activeTouchY) * FlickAimCore.flickVelocityMax;

                window.scrollBy({
                    left: finalFlickVectorX,
                    top: finalFlickVectorY,
                    behavior: 'auto' // Bứt phá và ghi đè hoàn toàn mọi thuộc tính mượt của CSS Styles
                });
            }

            FlickAimCore.animationId = requestAnimationFrame(processSupremeFlickAim);
        }

        window.addEventListener('touchstart', function() {
            FlickAimCore.isTracking = true;
            if (!FlickAimCore.animationId) {
                FlickAimCore.animationId = requestAnimationFrame(processSupremeFlickAim);
            }
        }, { passive: true, capture: true });

        const breakSupremeFlickSystem = function() {
            FlickAimCore.isTracking = false;
            if (FlickAimCore.animationId) {
                cancelAnimationFrame(FlickAimCore.animationId);
                FlickAimCore.animationId = null;
            }
        };

        window.addEventListener('touchend', breakSupremeFlickSystem, { passive: true, capture: true });
        window.addEventListener('touchcancel', breakSupremeFlickSystem, { passive: true, capture: true });
    };

    initSupremeMobileFlickAim();
})();