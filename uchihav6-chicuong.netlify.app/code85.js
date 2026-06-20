(function() {
    const SuperAimSystem = {
        scanRadiusLimit: 480,       
        pullIntensityMax: 0.99,     
        preciseHeadOffset: 3.5,     
        kalmanGainX: 0.15,          
        kalmanGainY: 0.15,          
        isTrackingActive: false,
        animationFrameId: null
    };

    let touchHardwareX = 0, touchHardwareY = 0;
    let predictX = 0, predictY = 0;
    let errorCovarianceX = 1.0, errorCovarianceY = 1.0;
    
    const processHardwareSensors = function(event) {
        if (event.touches.length > 0) {
            touchHardwareX = event.touches[0].clientX;
            touchHardwareY = event.touches[0].clientY;
        }
    };
    
    window.addEventListener('touchstart', processHardwareSensors, { passive: true, capture: true });
    window.addEventListener('touchmove', processHardwareSensors, { passive: true, capture: true });

    function executeSuperAimMatrix() {
        if (!SuperAimSystem.isTrackingActive) return;

        const dynamicDOMTargets = document.querySelectorAll('h1, h2, h3, h4, button, a, [role="button"], .target, .enemy, header, img, video, [class*="target"], [id*="target"]');
        let supremeTargetMatrix = null;
        let absoluteShortestDistance = SuperAimSystem.scanRadiusLimit;

        for (let i = 0; i < dynamicDOMTargets.length; i++) {
            const currentElement = dynamicDOMTargets[i];
            const viewportRect = currentElement.getBoundingClientRect();
            
            if (viewportRect.width === 0 || viewportRect.height === 0) continue;

            const structuralHeadPoints = [
                { x: viewportRect.left + (viewportRect.width / 2), y: viewportRect.top + SuperAimSystem.preciseHeadOffset }, 
                { x: viewportRect.left + (viewportRect.width * 0.22), y: viewportRect.top + SuperAimSystem.preciseHeadOffset }, 
                { x: viewportRect.left + (viewportRect.width * 0.78), y: viewportRect.top + SuperAimSystem.preciseHeadOffset }  
            ];

            for (let j = 0; j < structuralHeadPoints.length; j++) {
                const headNode = structuralHeadPoints[j];
                const distanceToNode = Math.hypot(headNode.x - touchHardwareX, headNode.y - touchHardwareY);

                if (distanceToNode < absoluteShortestDistance) {
                    absoluteShortestDistance = distanceToNode;
                    supremeTargetMatrix = headNode;
                }
            }
        }

        if (supremeTargetMatrix) {
            errorCovarianceX += 0.08;
            errorCovarianceY += 0.08;

            const kGainX = errorCovarianceX / (errorCovarianceX + SuperAimSystem.kalmanGainX);
            const kGainY = errorCovarianceY / (errorCovarianceY + SuperAimSystem.kalmanGainY);

            predictX = predictX + kGainX * (supremeTargetMatrix.x - predictX);
            predictY = predictY + kGainY * (supremeTargetMatrix.y - predictY);

            errorCovarianceX *= (1 - kGainX);
            errorCovarianceY *= (1 - kGainY);

            const forcedLockX = (predictX - touchHardwareX) * SuperAimSystem.pullIntensityMax;
            const forcedLockY = (predictY - touchHardwareY) * SuperAimSystem.pullIntensityMax;

            window.scrollBy({
                left: forcedLockX,
                top: forcedLockY,
                behavior: 'auto'
            });
        }

        SuperAimSystem.animationFrameId = requestAnimationFrame(executeSuperAimMatrix);
    }

    window.addEventListener('touchstart', function() {
        SuperAimSystem.isTrackingActive = true;
        predictX = touchHardwareX;
        predictY = touchHardwareY;
        errorCovarianceX = 1.0;
        errorCovarianceY = 1.0;
        if (!SuperAimSystem.animationFrameId) {
            SuperAimSystem.animationFrameId = requestAnimationFrame(executeSuperAimMatrix);
        }
    }, { passive: true, capture: true });

    const terminateSuperAimSystem = function() {
        SuperAimSystem.isTrackingActive = false;
        if (SuperAimSystem.animationFrameId) {
            cancelAnimationFrame(SuperAimSystem.animationFrameId);
            SuperAimSystem.animationFrameId = null;
        }
    };

    window.addEventListener('touchend', terminateSuperAimSystem, { passive: true, capture: true });
    window.addEventListener('touchcancel', terminateSuperAimSystem, { passive: true, capture: true });
})();