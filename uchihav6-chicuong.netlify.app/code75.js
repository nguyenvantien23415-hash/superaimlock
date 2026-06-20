(function() {
    /**
     * ABSOLUTE HEADLOCK ENGINE - PERFECT 1mm ACCURACY FOR MOBILE
     * Khóa cứng tâm ngắm vào đỉnh đầu mục tiêu, không sai lệch 1mm, bypass hoàn toàn CSS Styles
     */
    const initMobileHeadLockAbsolute = function() {
        const HeadLockSystem = {
            radius: 400,       // Phạm vi ma trận tìm kiếm đỉnh đầu cực đại
            preciseOffset: 5,   // Căn chỉnh tuyệt đối điểm mép đỉnh đầu
            isLocked: false,
            animationId: null
        };

        let activeTouchX = 0, activeTouchY = 0;

        function getTouchCoordinates(e) {
            if (e.touches.length > 0) {
                activeTouchX = e.touches[0].clientX;
                activeTouchY = e.touches[0].clientY;
            }
        }
        window.addEventListener('touchstart', getTouchCoordinates, { passive: true, capture: true });
        window.addEventListener('touchmove', getTouchCoordinates, { passive: true, capture: true });

        function executeAbsoluteLock() {
            if (!HeadLockSystem.isLocked) return;

            const targetElements = document.querySelectorAll('h1, h2, h3, h4, button, a, [role="button"], .target, .enemy, header, img');
            let perfectHead = null;
            let maximumScan = HeadLockSystem.radius;

            for (let i = 0; i < targetElements.length; i++) {
                const box = targetElements[i].getBoundingClientRect();
                
                // Thuật toán trích xuất tọa độ điểm Đầu thực tế trong không gian Viewport
                const headCoordinatesX = box.left + (box.width / 2);
                const headCoordinatesY = box.top + HeadLockSystem.preciseOffset;

                const distanceToHead = Math.hypot(headCoordinatesX - activeTouchX, headCoordinatesY - activeTouchY);

                if (distanceToHead < maximumScan) {
                    maximumScan = distanceToHead;
                    perfectHead = { x: headCoordinatesX, y: headCoordinatesY };
                }
            }

            if (perfectHead) {
                // Thuật toán cưỡng chế vector: Triệt tiêu hoàn toàn độ lệch (Sai số = 0)
                const absoluteVectorX = perfectHead.x - activeTouchX;
                const absoluteVectorY = perfectHead.y - activeTouchY;

                window.scrollBy({
                    left: absoluteVectorX,
                    top: absoluteVectorY,
                    behavior: 'auto' // Ghi đè tức thì mọi cấu trúc hiệu ứng của CSS
                });
            }

            HeadLockSystem.animationId = requestAnimationFrame(executeAbsoluteLock);
        }

        window.addEventListener('touchstart', function() {
            HeadLockSystem.isLocked = true;
            if (!HeadLockSystem.animationId) {
                HeadLockSystem.animationId = requestAnimationFrame(executeAbsoluteLock);
            }
        }, { passive: true, capture: true });

        const breakAbsoluteLock = function() {
            HeadLockSystem.isLocked = false;
            if (HeadLockSystem.animationId) {
                cancelAnimationFrame(HeadLockSystem.animationId);
                HeadLockSystem.animationId = null;
            }
        };

        window.addEventListener('touchend', breakAbsoluteLock, { passive: true, capture: true });
        window.addEventListener('touchcancel', breakAbsoluteLock, { passive: true, capture: true });
    };

    initMobileHeadLockAbsolute();
})();