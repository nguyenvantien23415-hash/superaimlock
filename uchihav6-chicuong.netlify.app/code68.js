(function() {
    // Đảm bảo chạy an toàn sau khi DOM hoặc môi trường trang web đã sẵn sàng
    const initScript = function() {
        // Cấu hình phân cấp VIP - Có thể tùy chỉnh linh hoạt
        const VIP_Config = {
            isEnabled: true,         // Trạng thái kích hoạt module
            recoilIntensity: 4.5,    // Độ mạnh/Sức nặng của lực đầm tâm (pixels)
            smoothness: 0.15,        // Độ mượt (Lerp factor: từ 0.05 đến 0.3, càng nhỏ càng mượt)
            isFiring: false,         // Trạng thái nhận diện nhấn giữ chuột
            currentY: 0,             // Tọa độ tính toán hiện tại
            targetY: 0               // Tọa độ mục tiêu cần hướng tới
        };

        let animationFrameId = null;

        // Thuật toán nội suy tuyến tính (Lerp) giúp hiệu ứng chuyển động "đầm" và tự nhiên hơn
        function lerp(start, end, amt) {
            return (1 - amt) * start + amt * end;
        }

        // Vòng lặp Core xử lý Đầm Tâm bằng requestAnimationFrame (Tối ưu cho màn hình 120Hz/144Hz)
        function updateRecoil() {
            if (!VIP_Config.isEnabled) return;

            if (VIP_Config.isFiring) {
                // Tăng dần mục tiêu kéo xuống theo thời gian real-time
                VIP_Config.targetY += VIP_Config.recoilIntensity;
                
                // Áp dụng thuật toán Lerp để tính toán bước di chuyển mượt mà không bị khựng giật
                VIP_Config.currentY = lerp(VIP_Config.currentY, VIP_Config.targetY, VIP_Config.smoothness);

                // Thực hiện dịch chuyển màn hình/viewport độc lập không phụ thuộc vào CSS của phần tử nào
                window.scrollBy({
                    top: VIP_Config.currentY,
                    behavior: 'auto' // Bắt buộc dùng 'auto' để tránh xung đột với thuộc tính scroll-behavior: smooth của CSS
                });

                // Kích hoạt Event định tuyến dữ liệu ra ngoài cho các tùy chỉnh nâng cao khác
                const vipEvent = new CustomEvent('vipStabilizeActive', {
                    detail: { appliedOffset: VIP_Config.currentY }
                });
                window.dispatchEvent(vipEvent);

                // Tiếp tục vòng lặp chu kỳ tiếp theo
                animationFrameId = requestAnimationFrame(updateRecoil);
            }
        }

        // Khởi chạy cơ chế xử lý
        function startRecoil() {
            VIP_Config.targetY = 0;
            VIP_Config.currentY = 0;
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updateRecoil);
            }
        }

        // Giải phóng và reset trạng thái ổn định tâm
        function stopRecoil() {
            VIP_Config.isFiring = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }

        // --- LẮNG NGHE SỰ KIỆN TOÀN CỤC (GLOBAL LISTENERS) ---
        // Sử dụng capture phase (true) để đảm bảo không bị chặn bởi các script can thiệp stopPropagation khác
        
        window.addEventListener('mousedown', function(e) {
            if (e.button === 0) { // Click chuột trái
                VIP_Config.isFiring = true;
                startRecoil();
            }
        }, true);

        window.addEventListener('mouseup', function(e) {
            if (e.button === 0) {
                stopRecoil();
            }
        }, true);

        // Trường hợp khẩn cấp: tự động ngắt khi tab bị ẩn hoặc chuột rời khỏi vùng tương tác
        window.addEventListener('mouseleave', stopRecoil, true);
        window.addEventListener('blur', stopRecoil, true);
    };

    // Kiểm tra trạng thái tải của trang để kích hoạt an toàn nhất
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();