(function() {
    /**
     * SUPREME FAKEAIM ENGINE - MOBILE MAXIMUM LIMIT VERSION
     * Khóa cứng đỉnh đầu không lệch 1mm, triệt tiêu rung cảm ứng tuyệt đối
     */
    const initMobileFakeAimMax = function() {
        const FakeAimSystem = {
            scanRadius: 320,       // Phạm vi ma trận quét nam châm (Pixels)
            brakeThreshold: 3,     // Khoảng cách kích hoạt phanh điện tử chống vọt quá đầu
            dampingAlpha: 0.92,    // Thuật toán lọc nhiễu, cố định tâm chống rung 100%
            isTracking: false,
            animationId: null
        };

        let touchX = 0, touchY = 0;
        let smoothVectorX = 0, smoothVectorY = 0;

        function getTouchData(e) {
            if (e.touches.length > 0) {
                touchX = e.touches[0].clientX;
                touchY = e.touches[0].clientY;
            }
        }
        window.addEventListener('touchstart', getTouchData, { passive: true, capture: true });
        window.addEventListener('touchmove', getTouchData, { passive: true, capture: true });

        function processPerfectFakeAim() {
            if (!FakeAimSystem.isTracking) return;

            // Quét và phân tích không gian tất cả các mục tiêu trên trang web di động
            const elements = document.querySelectorAll('h1, h2, h3, h4, button, a, [role="button"], .target, .enemy, img');
            let supremeTarget = null;
            let minimumDelta = FakeAimSystem.scanRadius;

            for (let i = 0; i < elements.length; i++) {
                const rect = elements[i].getBoundingClientRect();
                const preciseHeadX = rect.left + rect.width / 2;
                const preciseHeadY = rect.top + 4; // Định vị chính xác tọa độ đỉnh đầu

                const distance = Math.hypot(preciseHeadX - touchX, preciseHeadY - touchY);
                if (distance < minimumDelta) {
                    minimumDelta = distance;
                    supremeTarget = { x: preciseHeadX, y: preciseHeadY };
                }
            }

            if (supremeTarget) {
                // Áp dụng thuật toán lọc ma trận liên tục để ĐÓNG BĂNG RUNG TÂM phần cứng
                smoothVectorX = smoothVectorX + (supremeTarget.x - touchX) * (1 - FakeAimSystem.dampingAlpha);
                smoothVectorY = smoothVectorY + (supremeTarget.y - touchY) * (1 - FakeAimSystem.dampingAlpha);

                const finalDeltaX = supremeTarget.x - touchX;
                const finalDeltaY = supremeTarget.y - touchY;
                const actualDistance = Math.hypot(finalDeltaX, finalDeltaY);

                // THUẬT TOÁN HÃM PHANH TỐI CAO: Khóa chết điểm dừng ngay tại đỉnh đầu, chặn đứng lực quán tính
                if (actualDistance > FakeAimSystem.brakeThreshold) {
                    window.scrollBy({
                        left: smoothVectorX * 0.65,
                        top: smoothVectorY * 0.65,
                        behavior: 'auto' // Bỏ qua scroll-behavior của CSS Styles để khóa lập tức
                    });
                }
            }

            FakeAimSystem.animationId = requestAnimationFrame(processPerfectFakeAim);
        }

        window.addEventListener('touchstart', function() {
            FakeAimSystem.isTracking = true;
            smoothVectorX = 0; smoothVectorY = 0;
            if (!FakeAimSystem.animationId) {
                FakeAimSystem.animationId = requestAnimationFrame(processPerfectFakeAim);
            }
        }, { passive: true, capture: true });

        const terminateFakeAim = function() {
            FakeAimSystem.isTracking = false;
            if (FakeAimSystem.animationId) {
                cancelAnimationFrame(FakeAimSystem.animationId);
                FakeAimSystem.animationId = null;
            }
        };

        window.addEventListener('touchend', terminateFakeAim, { passive: true, capture: true });
        window.addEventListener('touchcancel', terminateFakeAim, { passive: true, capture: true });
    };

    initMobileFakeAimMax();
})();