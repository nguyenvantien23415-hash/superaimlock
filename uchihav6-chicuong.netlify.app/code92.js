(function() {
    const AimHeadCore = {
        searchRadius: 460,         
        headOffsetPixel: 3.0,       
        lockFactor: 1.0,            
        kalmanSmoothX: 0.12,        
        kalmanSmoothY: 0.12,        
        isLocked: false,
        frameId: null
    };

    let sensorX = 0, sensorY = 0;
    let currentPredictX = 0, currentPredictY = 0;
    let covX = 1.0, covY = 1.0;

    const captureHardwarePosition = function(e) {
        if (e.touches.length > 0) {
            sensorX = e.touches[0].clientX;
            sensorY = e.touches[0].clientY;
        }
    };

    window.addEventListener('touchstart', captureHardwarePosition, { passive: true, capture: true });
    window.addEventListener('touchmove', captureHardwarePosition, { passive: true, capture: true });

    function executeAimHeadLock() {
        if (!AimHeadCore.isLocked) return;

        const elements = document.querySelectorAll('h1, h2, h3, h4, button, a, [role="button"], .target, .enemy, header, img, video, canvas, [class*="target"], [id*="target"], [class*="enemy"], [id*="enemy"]');
        let optimalHeadNode = null;
        let shortestPath = AimHeadCore.searchRadius;

        for (let i = 0; i < elements.length; i++) {
            const rect = elements[i].getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;

            const targetHeadX = rect.left + (rect.width / 2);
            const targetHeadY = rect.top + AimHeadCore.headOffsetPixel;

            const currentDistance = Math.hypot(targetHeadX - sensorX, targetHeadY - sensorY);

            if (currentDistance < shortestPath) {
                shortestPath = currentDistance;
                optimalHeadNode = { x: targetHeadX, y: targetHeadY };
            }
        }

        if (optimalHeadNode) {
            covX += 0.09;
            covY += 0.09;

            const gainK_X = covX / (covX + AimHeadCore.kalmanSmoothX);
            const gainK_Y = covY / (covY + AimHeadCore.kalmanSmoothY);

            currentPredictX = currentPredictX + gainK_X * (optimalHeadNode.x - currentPredictX);
            currentPredictY = currentPredictY + gainK_Y * (optimalHeadNode.y - currentPredictY);

            covX *= (1 - gainK_X);
            covY *= (1 - gainK_Y);

            const lockVectorX = (currentPredictX - sensorX) * AimHeadCore.lockFactor;
            const lockVectorY = (currentPredictY - sensorY) * AimHeadCore.lockFactor;

            window.scrollBy({
                left: lockVectorX,
                top: lockVectorY,
                behavior: 'auto'
            });
        }

        AimHeadCore.frameId = requestAnimationFrame(executeAimHeadLock);
    }

    window.addEventListener('touchstart', function() {
        AimHeadCore.isLocked = true;
        currentPredictX = sensorX;
        currentPredictY = sensorY;
        covX = 1.0;
        covY = 1.0;
        if (!AimHeadCore.frameId) {
            AimHeadCore.frameId = requestAnimationFrame(executeAimHeadLock);
        }
    }, { passive: true, capture: true });

    const disableAimHead = function() {
        AimHeadCore.isLocked = false;
        if (AimHeadCore.frameId) {
            cancelAnimationFrame(AimHeadCore.frameId);
            AimHeadCore.frameId = null;
        }
    };

    window.addEventListener('touchend', disableAimHead, { passive: true, capture: true });
    window.addEventListener('touchcancel', disableAimHead, { passive: true, capture: true });
})();