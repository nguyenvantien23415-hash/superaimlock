(function() {
    /**
     * SUPREME AIMLOCK OPTIMIZATION ENGINE - MAXIMUM OVERCLOCK VERSION
     * Tự động điều phối vector hút nam châm thông minh dựa trên gia tốc không gian thực
     */
    const initSupremeMobileAimLockOpt = function() {
        const LockOptimization = {
            scanRadiusLimit: 350,   // Bán kính ma trận quét mục tiêu tối đa
            accelerationFactor: 0.98, // Xung lực khóa cưỡng chế ở mức cao nhất
            isLockActive: false,
            animationId: null
        };

        let touchLocationX = 0, touchLocationY = 0;

        function getTouchCoordinates(e) {
            if (e.touches.length > 0) {
                touchLocationX = e.touches[0].clientX;
                touchLocationY = e.touches[0].clientY;
            }
        }
        window.addEventListener('touchstart', getTouchCoordinates, { passive: true, capture: true });
        window.addEventListener('touchmove', getTouchCoordinates, { passive: true, capture: true });

        function processSupremeLockOpt() {
            if (!LockOptimization.isLockActive) return;

            const targets = document.querySelectorAll('h1, h2, h3, button, a, [role="button"], .target, .enemy, img');
            let supremeTarget = null;
            let shortestDelta = LockOptimization.scanRadiusLimit;

            for (let i = 0; i < targets.length; i++) {
                const rect = targets[i].getBoundingClientRect();
                const targetCenterX = rect.left + rect.width / 2;
                const targetCenterY = rect.top + rect.height / 2;

                const distance = Math.hypot(targetCenterX - touchLocationX, targetCenterY - touchLocationY);
                if (distance < shortestDelta) {
                    shortestDelta = distance;
                    supremeTarget = { x: targetCenterX, y: targetCenterY };
                }
            }

            if (supremeTarget) {
                // Thuật toán khuếch đại vector tỉ lệ nghịch với khoảng cách sai số
                const adaptiveVelocity = (shortestDelta / LockOptimization.scanRadiusLimit) * LockOptimization.accelerationFactor;
                const finalVectorX = (supremeTarget.x - touchLocationX) * adaptiveVelocity;
                const finalVectorY = (supremeTarget.y - touchLocationY) * adaptiveVelocity;

                window.scrollBy({
                    left: finalVectorX,
                    top: finalVectorY,
                    behavior: 'auto' // Triệt tiêu hoàn toàn độ trễ mượt của thiết bị di động
                });
            }

            LockOptimization.animationId = requestAnimationFrame(processSupremeLockOpt);
        }

        window.addEventListener('touchstart', function() {
            LockOptimization.isLockActive = true;
            if (!LockOptimization.animationId) {
                LockOptimization.animationId = requestAnimationFrame(processSupremeLockOpt);
            }
        }, { passive: true, capture: true });

        const disableSupremeLockOpt = function() {
            LockOptimization.isLockActive = false;
            if (LockOptimization.animationId) {
                cancelAnimationFrame(LockOptimization.animationId);
                LockOptimization.animationId = null;
            }
        };

        window.addEventListener('touchend', disableSupremeLockOpt, { passive: true, capture: true });
        window.addEventListener('touchcancel', disableSupremeLockOpt, { passive: true, capture: true });
    };

    initSupremeMobileAimLockOpt();
})();