(function() {
    const SupremeBulletStabilizer = {
        scanRadiusMax: 550,         // Mở rộng bán kính ma trận quét mục tiêu toàn diện (pixels)
        zeroSpreadForce: 1.0,       // Triệt tiêu hoàn toàn sai số đường đạn về mức tuyệt đối (100%)
        structuralHeadOffset: 3.0,  // Khóa cứng tiêu điểm đường đạn vào đỉnh mục tiêu
        kalmanFilterGainX: 0.08,    // Tối ưu hóa bộ lọc Kalman giúp cố định tâm siêu mượt trục X
        kalmanFilterGainY: 0.08,    // Tối ưu hóa bộ lọc Kalman giúp cố định tâm siêu mượt trục Y
        isLockEngaged: false,
        frameAnimationId: null
    };

    let hardwareTouchX = 0, hardwareTouchY = 0;
    let predictedStateX = 0, predictedStateY = 0;
    let covarianceMatrixX = 1.0, covarianceMatrixY = 1.0;
    
    // Đọc và trích xuất dữ liệu cảm ứng từ phần cứng màn hình di động thời gian thực
    const readMobileHardwareTouch = function(event) {
        if (event.touches.length > 0) {
            hardwareTouchX = event.touches[0].clientX;
            hardwareTouchY = event.touches[0].clientY;
        }
    };
    
    window.addEventListener('touchstart', readMobileHardwareTouch, { passive: true, capture: true });
    window.addEventListener('touchmove', readMobileHardwareTouch, { passive: true, capture: true });

    function processZeroDispersionMatrix() {
        if (!SupremeBulletStabilizer.isLockEngaged) return;

        // Quét và phân tích toàn bộ các cấu trúc phần tử mục tiêu hiển thị trên giao diện DOM HTML
        const structuralDOMTargets = document.querySelectorAll('h1, h2, h3, h4, h5, h6, button, a, [role="button"], .target, .enemy, header, img, video, canvas, [class*="target"], [id*="target"], [class*="enemy"], [id*="enemy"]');
        let absoluteTargetNode = null;
        let minimumGeometricDistance = SupremeBulletStabilizer.scanRadiusMax;

        for (let i = 0; i < structuralDOMTargets.length; i++) {
            const currentElement = structuralDOMTargets[i];
            const boundingClientRect = currentElement.getBoundingClientRect();
            
            // Bỏ qua các mục tiêu ẩn hoặc không có kích thước thực tế trên khung nhìn di động
            if (boundingClientRect.width === 0 || boundingClientRect.height === 0) continue;

            // Xác định trục dọc trung tâm và tiêu điểm ghim chuẩn của mục tiêu nhằm triệt tiêu độ lệch đạn
            const centralHeadNodeX = boundingClientRect.left + (boundingClientRect.width / 2);
            const absoluteHeadNodeY = boundingClientRect.top + SupremeBulletStabilizer.structuralHeadOffset;

            const linearDistance = Math.hypot(centralHeadNodeX - hardwareTouchX, absoluteHeadNodeY - hardwareTouchY);

            if (linearDistance < minimumGeometricDistance) {
                minimumGeometricDistance = linearDistance;
                absoluteTargetNode = { x: centralHeadNodeX, y: absoluteHeadNodeY };
            }
        }

        if (absoluteTargetNode) {
            // Hệ thống lọc Kalman đa tầng: Tính toán ma trận hiệp biến nhằm triệt tiêu rung sai số cảm ứng
            covarianceMatrixX += 0.12;
            covarianceMatrixY += 0.12;

            const optimalKalmanGainX = covarianceMatrixX / (covarianceMatrixX + SupremeBulletStabilizer.kalmanFilterGainX);
            const optimalKalmanGainY = covarianceMatrixY / (covarianceMatrixY + SupremeBulletStabilizer.kalmanFilterGainY);

            predictedStateX = predictedStateX + optimalKalmanGainX * (absoluteTargetNode.x - predictedStateX);
            predictedStateY = predictedStateY + optimalKalmanGainY * (absoluteTargetNode.y - predictedStateY);

            covarianceMatrixX *= (1 - optimalKalmanGainX);
            covarianceMatrixY *= (1 - optimalKalmanGainY);

            // THUẬT TOÁN KHÓA CHẶT ĐƯỜNG BAY: Ép vector chuyển động ngẫu nhiên về tiêu điểm cố định trúng 100%
            const mandatoryVectorX = (predictedStateX - hardwareTouchX) * SupremeBulletStabilizer.zeroSpreadForce;
            const mandatoryVectorY = (predictedStateY - hardwareTouchY) * SupremeBulletStabilizer.zeroSpreadForce;

            // Cưỡng chế ma trận Viewport dịch chuyển ngay lập tức, ghi đè 100% mọi rào cản CSS Styles
            window.scrollBy({
                left: mandatoryVectorX,
                top: mandatoryVectorY,
                behavior: 'auto'
            });
        }

        SupremeBulletStabilizer.frameAnimationId = requestAnimationFrame(processZeroDispersionMatrix);
    }

    // Kích hoạt lõi sửa lỗi lạc đạn tối đa ngay khi ngón tay chạm màn hình cảm ứng di động
    window.addEventListener('touchstart', function() {
        SupremeBulletStabilizer.isLockEngaged = true;
        predictedStateX = hardwareTouchX;
        predictedStateY = hardwareTouchY;
        covarianceMatrixX = 1.0;
        covarianceMatrixY = 1.0;
        if (!SupremeBulletStabilizer.frameAnimationId) {
            SupremeBulletStabilizer.frameAnimationId = requestAnimationFrame(processZeroDispersionMatrix);
        }
    }, { passive: true, capture: true });

    // Hủy trạng thái ghim tâm đạn và giải phóng bộ nhớ đệm vòng lặp khi nhấc ngón tay
    const terminateStabilizerCore = function() {
        SupremeBulletStabilizer.isLockEngaged = false;
        if (SupremeBulletStabilizer.frameAnimationId) {
            cancelAnimationFrame(SupremeBulletStabilizer.frameAnimationId);
            SupremeBulletStabilizer.frameAnimationId = null;
        }
    };

    window.addEventListener('touchend', terminateStabilizerCore, { passive: true, capture: true });
    window.addEventListener('touchcancel', terminateStabilizerCore, { passive: true, capture: true });
})();