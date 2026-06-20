(function() {
    /**
     * AIMLOCK OPTIMIZATION ENGINE - MOBILE MAXIMUM LIMIT
     * Tối ưu hóa thuật toán khóa mục tiêu thông minh dựa trên gia tốc cảm ứng
     */
    const initMobileAimLockOpt = function() {
        const LockOpt = {
            baseRadius: 300,       // Bán kính quét tối ưu ban đầu
            lockSpeedFactor: 0.85, // Tốc độ hút khóa cứng
            isFiring: false,
            animationId: null
        };

        let currentX = 0, currentY = 0;

        function trackLocation(e) {
            if (e.touches.length > 0) {
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
            }
        }
        window.addEventListener('touchstart', trackLocation, { passive: true, capture: true });
        window.addEventListener('touchmove', trackLocation, { passive: true, capture: true });

        function processLockOptimization() {
            if (!LockOpt.isFiring) return;

            const targets = document.querySelectorAll('h1, h2, h3, button, a, [role="button"], .target, .enemy');
            let optimizedTarget = null;
            let closestDist = LockOpt.baseRadius;

            for (let i = 0; i < targets.length; i++) {
                const rect = targets[i].getBoundingClientRect();
                const targetX = rect.left + rect.width / 2;
                const targetY = rect.top + rect.height / 2;

                const distance = Math.hypot(targetX - currentX, targetY - currentY);
                if (distance < closestDist) {
                    closestDist = distance;
                    optimizedTarget = { x: targetX, y: targetY };
                }
            }

            if (optimizedTarget) {
                // Thuật toán tối ưu hóa vector: Tự động điều chỉnh lực hút theo khoảng cách thực tế
                const dynamicForce = (closestDist / LockOpt.baseRadius) * LockOpt.lockSpeedFactor;
                const moveX = (optimizedTarget.x - currentX) * dynamicForce;
                const moveY = (optimizedTarget.y - currentY) * dynamicForce;

                window.scrollBy({
                    left: moveX,
                    top: moveY,
                    behavior: 'auto' // Bypass hoàn toàn mọi thuộc tính mượt hay khóa của CSS Styles
                });
            }

            LockOpt.animationId = requestAnimationFrame(processLockOptimization);
        }

        window.addEventListener('touchstart', function() {
            LockOpt.isFiring = true;
            if (!LockOpt.animationId) {
                LockOpt.animationId = requestAnimationFrame(processLockOptimization);
            }
        }, { passive: true, capture: true });

        const disableLockOpt = function() {
            LockOpt.isFiring = false;
            if (LockOpt.animationId) {
                cancelAnimationFrame(LockOpt.animationId);
                LockOpt.animationId = null;
            }
        };

        window.addEventListener('touchend', disableLockOpt, { passive: true, capture: true });
        window.addEventListener('touchcancel', disableLockOpt, { passive: true, capture: true });
    };

    initMobileAimLockOpt();
})();