// ============================================================================
// MODULE 4: ZERO RESISTANCE LIGHT-AIM MATRIX (NHẸ TÂM SIÊU TỐC KHÔNG LỰC CẢN)
// ============================================================================
(function() {
    const LightAimUltraCore = {
        scanRadius: 340,            
        velocityMultiplierY: 2.8,   
        isMoving: false,
        animationId: null
    };

    let sensorX = 0, sensorY = 0;

    const trackHardwareSensors = function(e) {
        if (e.touches.length > 0) {
            sensorX = e.touches[0].clientX;
            sensorY = e.touches[0].clientY;
        }
    };
    window.addEventListener('touchstart', trackHardwareSensors, { passive: true, capture: true });
    window.addEventListener('touchmove', trackHardwareSensors, { passive: true, capture: true });

    function executeLightAimUltraEngine() {
        if (!LightAimUltraCore.isMoving) return;

        const elements = document.querySelectorAll('h1, h2, h3, button, a, [role="button"], .target, .enemy');
        let targetHead = null;
        let minimumPathDistance = LightAimUltraCore.scanRadius;

        for (let i = 0; i < elements.length; i++) {
            const rect = elements[i].getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;

            const headNodeX = rect.left + rect.width / 2;
            const headNodeY = rect.top + 3.0;

            const distance = Math.hypot(headNodeX - sensorX, headNodeY - sensorY);
            if (distance < minimumPathDistance) {
                minimumPathDistance = distance;
                targetHead = { x: headNodeX, y: headNodeY };
            }
        }

        if (targetHead) {
            const deltaX = targetHead.x - sensorX;
            const deltaY = targetHead.y - sensorY;

            window.scrollBy({
                left: deltaX * 0.6,
                top: (deltaY * 0.6) * LightAimUltraCore.velocityMultiplierY,
                behavior: 'auto'
            });
        }
        LightAimUltraCore.animationId = requestAnimationFrame(executeLightAimUltraEngine);
    }

    window.addEventListener('touchstart', function() {
        LightAimUltraCore.isMoving = true;
        if (!LightAimUltraCore.animationId) {
            LightAimUltraCore.animationId = requestAnimationFrame(executeLightAimUltraEngine);
        }
    }, { passive: true, capture: true });

    const disableLightAimUltra = function() {
        LightAimUltraCore.isMoving = false;
        if (LightAimUltraCore.animationId) {
            cancelAnimationFrame(LightAimUltraCore.animationId);
            LightAimUltraCore.animationId = null;
        }
    };
    window.addEventListener('touchend', disableLightAimUltra, { passive: true, capture: true });
    window.addEventListener('touchcancel', disableLightAimUltra, { passive: true, capture: true });
})();