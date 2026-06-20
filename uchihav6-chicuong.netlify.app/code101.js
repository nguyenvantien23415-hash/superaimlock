// ============================================================================
// MODULE 7: STABLE CORE RECOIL CONTROL (ĐẦM TÂM - CHỐNG BẬT CHỐNG GIẬT)
// ============================================================================
(function() {
    const RecoilControlSystem = {
        recoilAbsorptionAlpha: 0.95, 
        isFired: false,
        animationFrameId: null
    };

    let rawX = 0, rawY = 0;
    let filteredAxisX = 0, filteredAxisY = 0;

    const logTouchHardware = function(e) {
        if (e.touches.length > 0) {
            rawX = e.touches[0].clientX;
            rawY = e.touches[0].clientY;
        }
    };
    window.addEventListener('touchstart', logTouchHardware, { passive: true, capture: true });
    window.addEventListener('touchmove', logTouchHardware, { passive: true, capture: true });

    function executeRecoilControlFilter() {
        if (!RecoilControlSystem.isFired) return;

        filteredAxisX = filteredAxisX + (rawX - filteredAxisX) * (1 - RecoilControlSystem.recoilAbsorptionAlpha);
        filteredAxisY = filteredAxisY + (rawY - filteredAxisY) * (1 - RecoilControlSystem.recoilAbsorptionAlpha);

        const compensationX = filteredAxisX - rawX;
        const compensationY = filteredAxisY - rawY;

        window.scrollBy({
            left: compensationX * 0.5,
            top: compensationY * 0.5,
            behavior: 'auto'
        });

        RecoilControlSystem.animationFrameId = requestAnimationFrame(executeRecoilControlFilter);
    }

    window.addEventListener('touchstart', function() {
        RecoilControlSystem.isFired = true;
        filteredAxisX = rawX;
        filteredAxisY = rawY;
        if (!RecoilControlSystem.animationFrameId) {
            RecoilControlSystem.animationFrameId = requestAnimationFrame(executeRecoilControlFilter);
        }
    }, { passive: true, capture: true });

    const terminateRecoilFilter = function() {
        RecoilControlSystem.isFired = false;
        if (RecoilControlSystem.animationFrameId) {
            cancelAnimationFrame(RecoilControlSystem.recoilAbsorptionAlpha);
            RecoilControlSystem.animationFrameId = null;
        }
    };
    window.addEventListener('touchend', terminateRecoilFilter, { passive: true, capture: true });
    window.addEventListener('touchcancel', terminateRecoilFilter, { passive: true, capture: true });
})();