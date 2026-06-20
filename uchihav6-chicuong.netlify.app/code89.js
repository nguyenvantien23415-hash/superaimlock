(function() {
    const ScreenBuffEngine = {
        isActive: false,
        frameId: null
    };

    const coreDisplayDirectives = [
        'will-change: transform, opacity, scroll-position !important;',
        'transform: translateZ(0) !important;',
        'backface-visibility: hidden !important;',
        '-webkit-backface-visibility: hidden !important;',
        'image-rendering: -webkit-optimize-contrast !important;',
        'image-rendering: crisp-edges !important;'
    ].join(' ');

    function applyScreenBuff() {
        if (!ScreenBuffEngine.isActive) return;

        const renderNodes = document.querySelectorAll('body, div, canvas, video, img, [class*="game"], [id*="game"]');
        for (let i = 0; i < renderNodes.length; i++) {
            const node = renderNodes[i];
            if (!node.hasAttribute('data-screen-buffed')) {
                node.setAttribute('style', (node.getAttribute('style') || '') + ' ' + coreDisplayDirectives);
                node.setAttribute('data-screen-buffed', 'true');
            }
        }
        ScreenBuffEngine.frameId = requestAnimationFrame(applyScreenBuff);
    }

    window.addEventListener('touchstart', function() {
        ScreenBuffEngine.isActive = true;
        if (!ScreenBuffEngine.frameId) applyScreenBuff();
    }, { passive: true, capture: true });

    window.addEventListener('touchend', function() {
        ScreenBuffEngine.isActive = false;
        if (ScreenBuffEngine.frameId) {
            cancelAnimationFrame(ScreenBuffEngine.frameId);
            ScreenBuffEngine.frameId = null;
        }
    }, { passive: true, capture: true });
})();