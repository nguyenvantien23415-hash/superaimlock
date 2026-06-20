// ============================================================================
// MODULE 6: ABSOLUTE HEADLOCK VECTOR VIP (KHÓA CỨNG ĐẦU MỤC TIÊU VIP)
// ============================================================================
(function() {
    const AbsoluteHeadLockVip = {
        scanRadiusMax: 500,         
        absoluteHeadForce: 1.0,     
        preciseHeadOffset: 2.5,     
        isLocked: false,
        animationFrameId: null
    };

    let hardwareTouchX = 0, hardwareTouchY = 0;

    const parseTouchPosition = function(event) {
        if (event.touches.length > 0) {
            hardwareTouchX = event.touches[0].clientX;
            hardwareTouchY = event.touches[0].clientY;
        }
    };
    window.addEventListener('touchstart', parseTouchPosition, { passive: true, capture: true });
    window.addEventListener('touchmove', parseTouchPosition, { passive: true, capture: true });

    function executeAbsoluteHeadLockMatrix() {
        if (!AbsoluteHeadLockVip.isLocked) return;

        const structuralDOMTargets = document.querySelectorAll('h1, h2, h3, h4, button, a, [role="button"], .target, .enemy, header, img, video, canvas, [class*="target"], [id*="target"], [class*="enemy"], [id*="enemy"]');
        let perfectHeadTarget = null;
        let minimumGeometricDistance = AbsoluteHeadLockVip.scanRadiusMax;

        for (let i = 0; i < structuralDOMTargets.length; i++) {
            const currentElement = structuralDOMTargets[i];
            const boundingClientRect = currentElement.getBoundingClientRect();
            if (boundingClientRect.width === 0 || boundingClientRect.height === 0) continue;

            const centralHeadNodeX = boundingClientRect.left + (boundingClientRect.width / 2);
            const absoluteHeadNodeY = boundingClientRect.top + AbsoluteHeadLockVip.preciseHeadOffset;

            const linearDistance = Math.hypot(centralHeadNodeX - hardwareTouchX, absoluteHeadNodeY - hardwareTouchY);
            if (linearDistance < minimumGeometricDistance) {
                minimumGeometricDistance = linearDistance;
                perfectHeadTarget = { x: centralHeadNodeX, y: absoluteHeadNodeY };
            }
        }

        if (perfectHeadTarget) {
            const mandatoryVectorX = (perfectHeadTarget.x - hardwareTouchX) * AbsoluteHeadLockVip.absoluteHeadForce;
            const mandatoryVectorY = (perfectHeadTarget.y - hardwareTouchY) * AbsoluteHeadLockVip.absoluteHeadForce;

            window.scrollBy({
                left: mandatoryVectorX,
                top: mandatoryVectorY,
                behavior: 'auto'
            });
        }
        AbsoluteHeadLockVip.animationFrameId = requestAnimationFrame(executeAbsoluteHeadLockMatrix);
    }

    window.addEventListener('touchstart', function() {
        AbsoluteHeadLockVip.isLocked = true;
        if (!AbsoluteHeadLockVip.animationFrameId) {
            AbsoluteHeadLockVip.animationFrameId = requestAnimationFrame(executeAbsoluteHeadLockMatrix);
        }
    }, { passive: true, capture: true });

    const terminateHeadLockCore = function() {
        AbsoluteHeadLockVip.isLocked = false;
        if (AbsoluteHeadLockVip.animationFrameId) {
            cancelAnimationFrame(AbsoluteHeadLockVip.animationFrameId);
            AbsoluteHeadLockVip.animationFrameId = null;
        }
    };
    window.addEventListener('touchend', terminateHeadLockCore, { passive: true, capture: true });
    window.addEventListener('touchcancel', terminateHeadLockCore, { passive: true, capture: true });
})();