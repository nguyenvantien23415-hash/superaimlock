(function() {
    const StraightBulletSystem = {
        scanRadius: 520,            
        straightForceFactor: 1.0,   
        targetOffsetTop: 3.5,       
        isTracking: false,
        animationId: null
    };

    let pointerX = 0, pointerY = 0;

    const readMobileHardware = function(e) {
        if (e.touches.length > 0) {
            pointerX = e.touches[0].clientX;
            pointerY = e.touches[0].clientY;
        }
    };
    window.addEventListener('touchstart', readMobileHardware, { passive: true, capture: true });
    window.addEventListener('touchmove', readMobileHardware, { passive: true, capture: true });

    function executeStraightBulletMatrix() {
        if (!StraightBulletSystem.isTracking) return;

        const dynamicDOMTargets = document.querySelectorAll('h1, h2, h3, h4, button, a, [role="button"], .target, .enemy, header, img, video, canvas, [class*="target"], [id*="target"], [class*="enemy"], [id*="enemy"]');
        let perfectNode = null;
        let shortestDistance = StraightBulletSystem.scanRadius;

        for (let i = 0; i < dynamicDOMTargets.length; i++) {
            const currentElement = dynamicDOMTargets[i];
            const boundingBox = currentElement.getBoundingClientRect();
            if (boundingBox.width === 0 || boundingBox.height === 0) continue;

            const targetCenterX = boundingBox.left + (boundingBox.width / 2);
            const targetCenterY = boundingBox.top + StraightBulletSystem.targetOffsetTop;

            const currentDistance = Math.hypot(targetCenterX - pointerX, targetCenterY - pointerY);
            if (currentDistance < shortestDistance) {
                shortestDistance = currentDistance;
                perfectNode = { x: targetCenterX, y: targetCenterY };
            }
        }

        if (perfectNode) {
            const straightVectorX = (perfectNode.x - pointerX) * StraightBulletSystem.straightForceFactor;
            const straightVectorY = (perfectNode.y - pointerY) * StraightBulletSystem.straightForceFactor;

            window.scrollBy({
                left: straightVectorX,
                top: straightVectorY,
                behavior: 'auto'
            });
        }
        StraightBulletSystem.animationId = requestAnimationFrame(executeStraightBulletMatrix);
    }

    window.addEventListener('touchstart', function() {
        StraightBulletSystem.isTracking = true;
        if (!StraightBulletSystem.animationId) {
            StraightBulletSystem.animationId = requestAnimationFrame(executeStraightBulletMatrix);
        }
    }, { passive: true, capture: true });

    const terminateStraightBullet = function() {
        StraightBulletSystem.isTracking = false;
        if (StraightBulletSystem.animationId) {
            cancelAnimationFrame(StraightBulletSystem.animationId);
            StraightBulletSystem.animationId = null;
        }
    };
    window.addEventListener('touchend', terminateStraightBullet, { passive: true, capture: true });
    window.addEventListener('touchcancel', terminateStraightBullet, { passive: true, capture: true });
})();