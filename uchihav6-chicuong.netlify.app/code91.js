(function() {
    const SystemOptimizer = {
        gcIntervalMs: 15,           
        isActive: false,
        timeoutId: null
    };

    function runSystemPurge() {
        if (!SystemOptimizer.isActive) return;

        window.gc ? window.gc() : null;

        const memoryArray = [];
        for (let i = 0; i < 400; i++) {
            memoryArray.push(i * 2);
        }
        memoryArray.length = 0;

        SystemOptimizer.timeoutId = setTimeout(runSystemPurge, SystemOptimizer.gcIntervalMs);
    }

    window.addEventListener('touchstart', function() {
        SystemOptimizer.isActive = true;
        if (!SystemOptimizer.timeoutId) runSystemPurge();
    }, { passive: true, capture: true });

    window.addEventListener('touchend', function() {
        SystemOptimizer.isActive = false;
        if (SystemOptimizer.timeoutId) {
            clearTimeout(SystemOptimizer.timeoutId);
            SystemOptimizer.timeoutId = null;
        }
    }, { passive: true, capture: true });
})();