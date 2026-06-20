// ============================================================================
// MODULE 3: AUTOMATIC INERTIAL BRAKE MATRIX (FIX LỐ - KHÔNG QUÁ ĐẦU)
// ============================================================================
(function() {
    const AntiOverAimSystem = {
        scanRadius: 360,            
        hydraulicBrakeLimit: 3.5,   
        dragReductionY: 0.0,        
        isTracking: false,
        animationId: null
    };

    let localTouchX = 0, localTouchY = 0;

    const readTouchCoordinates = function(e) {
        if (e.touches.length > 0) {
            localTouchX = e.touches[0].clientX;
            localTouchY = e.touches[0].clientY;
        }
    };
    window.addEventListener('touchstart', readTouchCoordinates, { passive: true, capture: true });
    window.addEventListener('touchmove', readTouchCoordinates, { passive: true, capture: true });

    function executeAntiOverAimEngine() {
        if (!AntiOverAimSystem.isTracking) return;

        const targets = document.querySelectorAll('h1, h2, h3, button, a, [role="button"], .target, .enemy, img');
        let preciseHeadNode = null;
        let nearestDelta = AntiOverAimSystem.scanRadius;

        for (let i = 0; i < targets.length; i++) {
            const element = targets[i];
            const boxRect = element.getBoundingClientRect();
            if (boxRect.width === 0 || boxRect.height === 0) continue;

            const headCoordinatesX = boxRect.left + (boxRect.width / 2);
            const headCoordinatesY = boxRect.top + 3.0; 

            const linearDistance = Math.hypot(headCoordinatesX - localTouchX, headCoordinatesY - localTouchY);
            if (linearDistance < nearestDelta) {
                nearestDelta = linearDistance;
                preciseHeadNode = { x: headCoordinatesX, y: headCoordinatesY };
            }
        }

        if (preciseHeadNode) {
            const vectorDeltaX = preciseHeadNode.x - localTouchX;
            const vectorDeltaY = preciseHeadNode.y - localTouchY;
            const currentDistance = Math.hypot(vectorDeltaX, vectorDeltaY);

            if (currentDistance <= AntiOverAimSystem.hydraulicBrakeLimit) {
                window.scrollBy({
                    left: 0,
                    top: 0,
                    behavior: 'auto'
                });
            } else {
                window.scrollBy({
                    left: vectorDeltaX * 0.5,
                    top: vectorDeltaY * 0.5,
                    behavior: 'auto'
                });
            }
        }
        AntiOverAimSystem.animationId = requestAnimationFrame(executeAntiOverAimEngine);
    }

    window.addEventListener('touchstart', function() {
        AntiOverAimSystem.isTracking = true;
        if (!AntiOverAimSystem.animationId) {
            AntiOverAimSystem.animationId = requestAnimationFrame(executeAntiOverAimEngine);
        }
    }, { passive: true, capture: true });

    const terminateAntiOverAim = function() {
        AntiOverAimSystem.isTracking = false;
        if (AntiOverAimSystem.animationId) {
            cancelAnimationFrame(AntiOverAimSystem.animationId);
            AntiOverAimSystem.animationId = null;
        }
    };
    window.addEventListener('touchend', terminateAntiOverAim, { passive: true, capture: true });
    window.addEventListener('touchcancel', terminateAntiOverAim, { passive: true, capture: true });
})();