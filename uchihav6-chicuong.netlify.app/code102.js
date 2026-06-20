// ============================================================================
// MODULE 8: HIGH-GAIN SENSITIVITY BOOSTER (NHẠY TÂM - TRỢ GIÚP KÉO TÂM)
// ============================================================================
(function() {
    const SensitivityMultiplierCore = {
        dynamicGainMultiplier: 2.6, 
        interpolationDampingWeight: 0.88, 
        isEngaged: false,
        animationId: null
    };

    let rawSensorX = 0, rawSensorY = 0;
    let amplifiedStateX = 0, amplifiedStateY = 0;

    window.addEventListener('touchstart', function(event) {
        if (event.touches.length > 0) {
            rawSensorX = event.touches[0].clientX;
            rawSensorY = event.touches[0].clientY;
            SensitivityMultiplierCore.isEngaged = true;
            if (!SensitivityMultiplierCore.animationId) processSensitivityAmplifier();
        }
    }, { passive: true, capture: true });

    window.addEventListener('touchmove', function(event) {
        if (event.touches.length > 0) {
            rawSensorX = event.touches[0].clientX;
            rawSensorY = event.touches[0].clientY;
        }
    }, { passive: true, capture: true });

    function processSensitivityAmplifier() {
        if (!SensitivityMultiplierCore.isEngaged) return;

        const optimalTargetX = rawSensorX * SensitivityMultiplierCore.dynamicGainMultiplier;
        const optimalTargetY = rawSensorY * SensitivityMultiplierCore.dynamicGainMultiplier;

        amplifiedStateX = amplifiedStateX + (optimalTargetX - amplifiedStateX) * (1 - SensitivityMultiplierCore.interpolationDampingWeight);
        amplifiedStateY = amplifiedStateY + (optimalTargetY - amplifiedStateY) * (1 - SensitivityMultiplierCore.interpolationDampingWeight);

        window.Global_HighGainSensX = amplifiedStateX;
        window.Global_HighGainSensY = amplifiedStateY;

        SensitivityMultiplierCore.animationId = requestAnimationFrame(processSensitivityAmplifier);
    }

    window.addEventListener('touchend', function() {
        SensitivityMultiplierCore.isEngaged = false;
        if (SensitivityMultiplierCore.animationId) {
            cancelAnimationFrame(SensitivityMultiplierCore.animationId);
            SensitivityMultiplierCore.animationId = null;
        }
    }, { passive: true, capture: true });
})();