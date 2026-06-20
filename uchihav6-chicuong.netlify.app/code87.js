(function() {
    const ScreenRefreshEngine = {
        targetInterval: 1000 / 120, 
        lastTick: performance.now(),
        isForced: false,
        animationId: null
    };

    function execute120HzLock(currentTimestamp) {
        if (!ScreenRefreshEngine.isForced) return;

        const timeDelta = currentTimestamp - ScreenRefreshEngine.lastTick;

        if (timeDelta >= ScreenRefreshEngine.targetInterval) {
            ScreenRefreshEngine.lastTick = currentTimestamp - (timeDelta % ScreenRefreshEngine.targetInterval);
            
            window.dispatchEvent(new CustomEvent('hardwareHzRefresh', {
                detail: { timestamp: currentTimestamp, hz: 120 }
            }));
        }

        ScreenRefreshEngine.animationId = requestAnimationFrame(execute120HzLock);
    }

    window.addEventListener('touchstart', function() {
        ScreenRefreshEngine.isForced = true;
        if (!ScreenRefreshEngine.animationId) {
            ScreenRefreshEngine.animationId = requestAnimationFrame(execute120HzLock);
        }
    }, { passive: true, capture: true });

    window.addEventListener('touchend', function() {
        ScreenRefreshEngine.isForced = false;
        if (ScreenRefreshEngine.animationId) {
            cancelAnimationFrame(ScreenRefreshEngine.animationId);
            ScreenRefreshEngine.animationId = null;
        }
    }, { passive: true, capture: true });
})();