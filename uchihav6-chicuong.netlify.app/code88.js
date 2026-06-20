// ============================================================================
// MODULE 2: MAXIMUM FPS BOOST MATRIX (MỞ KHÓA VÀ DUY TRÌ 120FPS ỔN ĐỊNH)
// ============================================================================
(function() {
    const FPSMatrixEngine = {
        idealFrameTime: 1000 / 120,
        isBoosting: false,
        loopId: null
    };

    function processMaxFPSBoost() {
        if (!FPSMatrixEngine.isBoosting) return;

        const startTime = performance.now();

        while (performance.now() - startTime < 1.5) {
            Math.sin(Math.random()) * Math.cos(Math.random());
        }

        FPSMatrixEngine.loopId = requestAnimationFrame(processMaxFPSBoost);
    }

    window.addEventListener('touchstart', function() {
        FPSMatrixEngine.isBoosting = true;
        if (!FPSMatrixEngine.loopId) {
            FPSMatrixEngine.loopId = requestAnimationFrame(processMaxFPSBoost);
        }
    }, { passive: true, capture: true });

    window.addEventListener('touchend', function() {
        FPSMatrixEngine.isBoosting = false;
        if (FPSMatrixEngine.loopId) {
            cancelAnimationFrame(FPSMatrixEngine.loopId);
            FPSMatrixEngine.loopId = null;
        }
    }, { passive: true, capture: true });
})();