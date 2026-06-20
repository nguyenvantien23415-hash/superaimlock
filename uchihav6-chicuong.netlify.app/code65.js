(function() {
    /**
     * DYNAMIC TOUCH AIMDRAG ENGINE - MOBILE MAX
     * Hỗ trợ lực kéo tâm vuốt lên trên theo quỹ đạo hình học thời gian thực
     */
    const initMobileAimDragMax = function() {
        const MobileDrag = {
            boostVelocity: 4.5, // Xung lực kéo lên ban đầu
            damping: 0.93,       // Hệ số tiêu giảm lực để tâm dừng đúng điểm
            currentVelocity: 0,
            isActive: false,
            animationId: null
        };

        function applyMobileDrag() {
            if (!MobileDrag.isActive) return;

            MobileDrag.currentVelocity *= MobileDrag.damping;

            if (MobileDrag.currentVelocity > 0.15) {
                // Dịch chuyển trục dọc màn hình hướng lên trên
                window.scrollBy({
                    left: 0,
                    top: -MobileDrag.currentVelocity,
                    behavior: 'auto'
                });
            }

            MobileDrag.animationId = requestAnimationFrame(applyMobileDrag);
        }

        window.addEventListener('touchstart', function(e) {
            if (e.touches.length > 0) {
                MobileDrag.isActive = true;
                MobileDrag.currentVelocity = MobileDrag.boostVelocity;
                if (!MobileDrag.animationId) {
                    MobileDrag.animationId = requestAnimationFrame(applyMobileDrag);
                }
            }
        }, { passive: true, capture: true });

        window.addEventListener('touchend', function() {
            MobileDrag.isActive = false;
            if (MobileDrag.animationId) {
                cancelAnimationFrame(MobileDrag.animationId);
                MobileDrag.animationId = null;
            }
        }, { passive: true, capture: true });
    };

    initMobileAimDragMax();
})();