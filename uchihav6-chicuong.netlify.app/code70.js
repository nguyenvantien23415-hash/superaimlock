(function() {
    /**
     * MAGNETIC TARGET AIM SYSTEM - MOBILE MAX
     * Quét ma trận phần tử HTML và tự động hút tiêu điểm về vị trí trung tâm mục tiêu
     */
    const initMobileTargetAimMax = function() {
        const MagnetConfig = {
            radius: 260,       // Vòng tròn bán kính quét trên màn hình di động
            pullFactor: 0.75,   // Sức hút nam châm cảm ứng
            isTouching: false,
            animationId: null
        };

        let tX = 0, tY = 0;

        function updateTouchCoordinates(e) {
            if (e.touches.length > 0) {
                tX = e.touches[0].clientX;
                tY = e.touches[0].clientY;
            }
        }
        window.addEventListener('touchstart', updateTouchCoordinates, { passive: true, capture: true });
        window.addEventListener('touchmove', updateTouchCoordinates, { passive: true, capture: true });

        function executeMobileMagnet() {
            if (!MagnetConfig.isTouching) return;

            // Thu thập các thẻ phần tử mục tiêu trên mọi cấu trúc HTML di động
            const elements = document.querySelectorAll('h1, h2, button, a, [role="button"], .target, .enemy');
            let nearest = null;
            let minDistance = MagnetConfig.radius;

            for (let i = 0; i < elements.length; i++) {
                const rect = elements[i].getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const distance = Math.hypot(centerX - tX, centerY - tY);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = { x: centerX, y: centerY };
                }
            }

            if (nearest) {
                // Tính toán sai lệch vector toán học để hút tâm ngắm dính vào mục tiêu
                const moveX = (nearest.x - tX) * MagnetConfig.pullFactor;
                const moveY = (nearest.y - tY) * MagnetConfig.pullFactor;

                window.scrollBy({ left: moveX, top: moveY, behavior: 'auto' });
            }

            MagnetConfig.animationId = requestAnimationFrame(executeMobileMagnet);
        }

        window.addEventListener('touchstart', function() {
            MagnetConfig.isTouching = true;
            if (!MagnetConfig.animationId) {
                MagnetConfig.animationId = requestAnimationFrame(executeMobileMagnet);
            }
        }, { passive: true, capture: true });

        window.addEventListener('touchend', function() {
            MagnetConfig.isTouching = false;
            if (MagnetConfig.animationId) {
                cancelAnimationFrame(MagnetConfig.animationId);
                MagnetConfig.animationId = null;
            }
        }, { passive: true, capture: true });
    };

    initMobileTargetAimMax();
})();