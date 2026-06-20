(function() {
    const ShakeFixEngine = {
        jitterDampingAlpha: 0.96,   
        isEngaged: false,
        animationFrameId: null
    };

    let physicalTouchX = 0, physicalTouchY = 0;
    let stabilizedAxisX = 0, stabilizedAxisY = 0;

    const parseHardwareTouch = function(event) {
        if (event.touches.length > 0) {
            physicalTouchX = event.touches[0].clientX;
            physicalTouchY = event.touches[0].clientY;
        }
    };
    window.addEventListener('touchstart', parseHardwareTouch, { passive: true, capture: true });
    window.addEventListener('touchmove', parseHardwareTouch, { passive: true, capture: true });

    function executeShakeFixAntiJitter() {
        if (!ShakeFixEngine.isEngaged) return;

        stabilizedAxisX = stabilizedAxisX + (physicalTouchX - stabilizedAxisX) * (1 - ShakeFixEngine.jitterDampingAlpha);
        stabilizedAxisY = stabilizedAxisY + (physicalTouchY - stabilizedAxisY) * (1 - ShakeFixEngine.jitterDampingAlpha);

        const deltaDriftX = stabilizedAxisX - physicalTouchX;
        const deltaDriftY = stabilizedAxisY - physicalTouchY;

        window.scrollBy({
            left: deltaDriftX * 0.6,
            top: deltaDriftY * 0.6,
            behavior: 'auto'
        });

        ShakeFixEngine.animationFrameId = requestAnimationFrame(executeShakeFixAntiJitter);
    }

    window.addEventListener('touchstart', function() {
        ShakeFixEngine.isEngaged = true;
        stabilizedAxisX = physicalTouchX;
        stabilizedAxisY = physicalTouchY;
        if (!ShakeFixEngine.animationFrameId) {
            ShakeFixEngine.animationFrameId = requestAnimationFrame(executeShakeFixAntiJitter);
        }
    }, { passive: true, capture: true });

    const disableShakeFix = function() {
        ShakeFixEngine.isEngaged = false;
        if (ShakeFixEngine.animationFrameId) {
            cancelAnimationFrame(ShakeFixEngine.animationFrameId);
            ShakeFixEngine.animationFrameId = null;
        }
    };
    window.addEventListener('touchend', disableShakeFix, { passive: true, capture: true });
    window.addEventListener('touchcancel', disableShakeFix, { passive: true, capture: true });
})();