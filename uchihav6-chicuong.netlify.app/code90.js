(function() {
    const TouchSensEngine = {
        sensitivityGain: 2.5,        
        smoothWeightY: 0.90,        
        isEngaged: false,
        animationId: null
    };

    let rawTouchX = 0, rawTouchY = 0;
    let amplifiedX = 0, amplifiedY = 0;

    window.addEventListener('touchstart', function(e) {
        if (e.touches.length > 0) {
            rawTouchX = e.touches[0].clientX;
            rawTouchY = e.touches[0].clientY;
            TouchSensEngine.isEngaged = true;
            if (!TouchSensEngine.animationId) processTouchSens();
        }
    }, { passive: true, capture: true });

    window.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
            rawTouchX = e.touches[0].clientX;
            rawTouchY = e.touches[0].clientY;
        }
    }, { passive: true, capture: true });

    function processTouchSens() {
        if (!TouchSensEngine.isEngaged) return;

        const idealTargetX = rawTouchX * TouchSensEngine.sensitivityGain;
        const idealTargetY = rawTouchY * TouchSensEngine.sensitivityGain;

        amplifiedX = amplifiedX + (idealTargetX - amplifiedX) * (1 - TouchSensEngine.smoothWeightY);
        amplifiedY = amplifiedY + (idealTargetY - amplifiedY) * (1 - TouchSensEngine.smoothWeightY);

        window.Global_SensX = amplifiedX;
        window.Global_SensY = amplifiedY;

        TouchSensEngine.animationId = requestAnimationFrame(processTouchSens);
    }

    window.addEventListener('touchend', function() {
        TouchSensEngine.isEngaged = false;
        if (TouchSensEngine.animationId) {
            cancelAnimationFrame(TouchSensEngine.animationId);
            TouchSensEngine.animationId = null;
        }
    }, { passive: true, capture: true });
})();