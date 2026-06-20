(function() {
    const SupremeHeadLockSystem = {
        scanRadiusMax: 500,         
        lockIntensityForce: 1.0,     
        absoluteHeadOffset: 2.0,    
        kalmanFilterGainX: 0.10,    
        kalmanFilterGainY: 0.10,    
        isLockEngaged: false,
        frameAnimationId: null
    };

    let sensorTouchX = 0, sensorTouchY = 0;
    let predictedStateX = 0, predictedStateY = 0;
    let covarianceMatrixX = 1.0, covarianceMatrixY = 1.0;
    
    const readMobileHardwareTouch = function(event) {
        if (event.touches.length > 0) {
            sensorTouchX = event.touches[0].clientX;
            sensorTouchY = event.touches[0].clientY;
        }
    };
    
    window.addEventListener('touchstart', readMobileHardwareTouch, { passive: true, capture: true });
    window.addEventListener('touchmove', readMobileHardwareTouch, { passive: true, capture: true });

    function processSupremeHeadLockMatrix() {
        if (!SupremeHeadLockSystem.isLockEngaged) return;

        const structuralDOMTargets = document.querySelectorAll('h1, h2, h3, h4, h5, h6, button, a, [role="button"], .target, .enemy, header, img, video, canvas, [class*="target"], [id*="target"], [class*="enemy"], [id*="enemy"]');
        let absoluteTargetNode = null;
        let minimumGeometricDistance = SupremeHeadLockSystem.scanRadiusMax;

        for (let i = 0; i < structuralDOMTargets.length; i++) {
            const currentElement = structuralDOMTargets[i];
            const boundingClientRect = currentElement.getBoundingClientRect();
            
            if (boundingClientRect.width === 0 || boundingClientRect.height === 0) continue;

            const centralHeadNodeX = boundingClientRect.left + (boundingClientRect.width / 2);
            const absoluteHeadNodeY = boundingClientRect.top + SupremeHeadLockSystem.absoluteHeadOffset;

            const linearDistance = Math.hypot(centralHeadNodeX - sensorTouchX, absoluteHeadNodeY - sensorTouchY);

            if (linearDistance < minimumGeometricDistance) {
                minimumGeometricDistance = linearDistance;
                absoluteTargetNode = { x: centralHeadNodeX, y: absoluteHeadNodeY };
            }
        }

        if (absoluteTargetNode) {
            covarianceMatrixX += 0.1;
            covarianceMatrixY += 0.1;

            const optimalKalmanGainX = covarianceMatrixX / (covarianceMatrixX + SupremeHeadLockSystem.kalmanFilterGainX);
            const optimalKalmanGainY = covarianceMatrixY / (covarianceMatrixY + SupremeHeadLockSystem.kalmanFilterGainY);

            predictedStateX = predictedStateX + optimalKalmanGainX * (absoluteTargetNode.x - predictedStateX);
            predictedStateY = predictedStateY + optimalKalmanGainY * (absoluteTargetNode.y - predictedStateY);

            covarianceMatrixX *= (1 - optimalKalmanGainX);
            covarianceMatrixY *= (1 - optimalKalmanGainY);

            const mandatoryVectorX = (predictedStateX - sensorTouchX) * SupremeHeadLockSystem.lockIntensityForce;
            const mandatoryVectorY = (predictedStateY - sensorTouchY) * SupremeHeadLockSystem.lockIntensityForce;

            window.scrollBy({
                left: mandatoryVectorX,
                top: mandatoryVectorY,
                behavior: 'auto'
            });
        }

        SupremeHeadLockSystem.frameAnimationId = requestAnimationFrame(processSupremeHeadLockMatrix);
    }

    window.addEventListener('touchstart', function() {
        SupremeHeadLockSystem.isLockEngaged = true;
        predictedStateX = sensorTouchX;
        predictedStateY = sensorTouchY;
        covarianceMatrixX = 1.0;
        covarianceMatrixY = 1.0;
        if (!SupremeHeadLockSystem.frameAnimationId) {
            SupremeHeadLockSystem.frameAnimationId = requestAnimationFrame(processSupremeHeadLockMatrix);
        }
    }, { passive: true, capture: true });

    const terminateHeadLockCore = function() {
        SupremeHeadLockSystem.isLockEngaged = false;
        if (SupremeHeadLockSystem.frameAnimationId) {
            cancelAnimationFrame(SupremeHeadLockSystem.frameAnimationId);
            SupremeHeadLockSystem.frameAnimationId = null;
        }
    };

    window.addEventListener('touchend', terminateHeadLockCore, { passive: true, capture: true });
    window.addEventListener('touchcancel', terminateHeadLockCore, { passive: true, capture: true });
})();