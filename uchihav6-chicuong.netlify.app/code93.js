(function() {
    const BulletStabilizer = {
        scanRadiusLimit: 400,       // Phạm vi quét các phần tử mục tiêu xung quanh điểm chạm (pixels)
        dispersionReduction: 1.0,   // Lực cưỡng chế triệt tiêu độ lệch tâm (1.0 = Tối đa 100%)
        targetOffsetTop: 3.5,       // Căn chỉnh điểm ghim tâm cố định tại mục tiêu
        isStabilizing: false,
        animationId: null
    };

    let touchX = 0, touchY = 0;
    let alignedX = 0, alignedY = 0;

    // Trích xuất tọa độ cảm ứng từ phần cứng màn hình di động với tần suất cao
    const readMobileHardwareTouch = function(event) {
        if (event.touches.length > 0) {
            touchX = event.touches[0].clientX;
            touchY = event.touches[0].clientY;
        }
    };

    window.addEventListener('touchstart', readMobileHardwareTouch, { passive: true, capture: true });
    window.addEventListener('touchmove', readMobileHardwareTouch, { passive: true, capture: true });

    function executeBulletStabilizer() {
        if (!BulletStabilizer.isStabilizing) return;

        // Quét toàn bộ ma trận các cấu trúc phần tử hình ảnh, văn bản và mục tiêu trên DOM HTML
        const dynamicTargets = document.querySelectorAll('h1, h2, h3, h4, h5, h6, button, a, [role="button"], .target, .enemy, header, img, video, canvas, [class*="target"], [id*="target"], [class*="enemy"], [id*="enemy"]');
        let perfectTargetNode = null;
        let shortestGeometricDistance = BulletStabilizer.scanRadiusLimit;

        for (let i = 0; i < dynamicTargets.length; i++) {
            const currentElement = dynamicTargets[i];
            const boundingBox = currentElement.getBoundingClientRect();
            
            // Bỏ qua các mục tiêu ẩn hoặc không có kích thước hiển thị thực tế
            if (boundingBox.width === 0 || boundingBox.height === 0) continue;

            // Xác định trục dọc trung tâm và điểm ghim chuẩn của mục tiêu
            const nodeCenterX = boundingBox.left + (boundingBox.width / 2);
            const nodeTargetY = boundingBox.top + BulletStabilizer.targetOffsetTop;

            const linearDistance = Math.hypot(nodeCenterX - touchX, nodeTargetY - touchY);

            if (linearDistance < shortestGeometricDistance) {
                shortestGeometricDistance = linearDistance;
                perfectTargetNode = { x: nodeCenterX, y: nodeTargetY };
            }
        }

        if (perfectTargetNode) {
            // THUẬT TOÁN FIX LẠC ĐẠN CHỐNG SAI LỆCH ĐƯỜNG BAY
            // Ép toàn bộ các sai số chuyển động ngẫu nhiên của ngón tay (Jitter/Spread) về đường thẳng tuyệt đối
            alignedX = perfectTargetNode.x;
            alignedY = perfectTargetNode.y;

            const stabilizationVectorX = (alignedX - touchX) * BulletStabilizer.dispersionReduction;
            const stabilizationVectorY = (alignedY - touchY) * BulletStabilizer.dispersionReduction;

            // Cưỡng chế dịch chuyển hệ thống màn hình, cố định tâm đạn dính chặt vào tiêu điểm mục tiêu
            window.scrollBy({
                left: stabilizationVectorX,
                top: stabilizationVectorY,
                behavior: 'auto' // Ghi đè tức thì mọi hiệu ứng trễ cuộn của CSS Styles
            });
        }

        BulletStabilizer.animationId = requestAnimationFrame(executeBulletStabilizer);
    }

    // Kích hoạt hệ thống khóa ổn định đường đạn ngay khi chạm màn hình
    window.addEventListener('touchstart', function() {
        BulletStabilizer.isStabilizing = true;
        alignedX = touchX;
        alignedY = touchY;
        if (!BulletStabilizer.animationId) {
            BulletStabilizer.animationId = requestAnimationFrame(executeBulletStabilizer);
        }
    }, { passive: true, capture: true });

    // Giải phóng và hủy bộ nhớ đệm vòng lặp khi nhấc ngón tay
    const terminateStabilizerCore = function() {
        BulletStabilizer.isStabilizing = false;
        if (BulletStabilizer.animationId) {
            cancelAnimationFrame(BulletStabilizer.animationId);
            BulletStabilizer.animationId = null;
        }
    };

    window.addEventListener('touchend', terminateStabilizerCore, { passive: true, capture: true });
    window.addEventListener('touchcancel', terminateStabilizerCore, { passive: true, capture: true });
})();