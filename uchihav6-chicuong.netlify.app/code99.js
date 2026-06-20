// ============================================================================
// MODULE 5: SUPREME AIMLOCK SYSTEM VIP (KHÓA MỤC TIÊU VIP 100%)
// ============================================================================
(function() {
    const SupremeAimLockVip = {
        scanRadiusLimit: 450,       
        lockIntensityForce: 0.98,   
        isLockActive: false,
        animationFrameId: null
    };

    let touchInputX = 0, touchInputY = 0;

    const readTouchCoordinates = function(event) {
        if (event.touches.length > 0) {
            touchInputX = event.touches[0].clientX;
            touchInputY = event.touches[0].clientY;
        }
    };
    window.addEventListener('touchstart', readTouchCoordinates, { passive: true, capture: true });
    window.addEventListener('touchmove', readTouchCoordinates, { passive: true, capture: true });

    function processSupremeAimLockEngine() {
        if (!SupremeAimLockVip.isLockActive) return;

        const structuralDOMTargets = document.querySelectorAll('h1, h2, h3, button, a, [role="button"], .target, .enemy, img, video, canvas');
        let vipTargetNode = null;
        let shortestGeometricDistance = SupremeAimLockVip.scanRadiusLimit;

        for (let i = 0; i < structuralDOMTargets.length; i++) {
            const currentElement = structuralDOMTargets[i];
            const boundingClientRect = currentElement.getBoundingClientRect();
            if (boundingClientRect.width === 0 || boundingClientRect.height === 0) continue;

            const targetCenterX = boundingClientRect.left + (boundingClientRect.width / 2);
            const targetCenterY = boundingClientRect.top + (boundingClientRect.height / 2);

            const linearDistance = Math.hypot(targetCenterX - touchInputX, targetCenterY - touchInputY);
            if (linearDistance < shortestGeometricDistance) {
                shortestGeometricDistance = linearDistance;
                vipTargetNode = { x: targetCenterX, y: targetCenterY };
            }
        }

        if (vipTargetNode) {
            const lockVectorX = (vipTargetNode.x - touchInputX) * SupremeAimLockVip.lockIntensityForce;
            const lockVectorY = (vipTargetNode.y - touchInputY) * SupremeAimLockVip.lockIntensityForce;

            window.scrollBy({
                left: lockVectorX,
                top: lockVectorY,
                behavior: 'auto'
            });
        }
        SupremeAimLockVip.animationFrameId = requestAnimationFrame(processSupremeAimLockEngine);
    }

    window.addEventListener('touchstart', function() {
        SupremeAimLockVip.isLockActive = true;
        if (!SupremeAimLockVip.animationFrameId) {
            SupremeAimLockVip.animationFrameId = requestAnimationFrame(processSupremeAimLockEngine);
        }
    }, { passive: true, capture: true });

    const terminateAimLockVip = function() {
        SupremeAimLockVip.isLockActive = false;
        if (SupremeAimLockVip.animationFrameId) {
            cancelAnimationFrame(SupremeAimLockVip.animationFrameId);
            SupremeAimLockVip.animationFrameId = null;
        }
    };
    window.addEventListener('touchend', terminateAimLockVip, { passive: true, capture: true });
    window.addEventListener('touchcancel', terminateAimLockVip, { passive: true, capture: true });
})();