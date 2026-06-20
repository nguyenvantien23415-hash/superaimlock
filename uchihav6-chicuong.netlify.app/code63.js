(function() {
    // Chờ toàn bộ DOM và CSS tải xong để tính toán tọa độ chính xác 100%
    window.addEventListener('DOMContentLoaded', function() {
        
        // 1. THUẬT TOÁN TÌM HEADER BẤT CHẤP HTML
        let header = document.querySelector('header');
        if (!header) {
            // Quét tất cả các thẻ có class hoặc id chứa từ khóa phổ biến
            header = document.querySelector(
                '[class*="header"], [id*="header"], [class*="nav"], [id*="nav"], [class*="menu"], [id*="menu"], navbar'
            );
        }

        // Nếu vẫn không tìm thấy, tự động chọn phần tử lớn đầu tiên nằm ở đỉnh trang
        if (!header) {
            const bodyElements = document.body.children;
            for (let el of bodyElements) {
                if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE' && el.offsetHeight > 40) {
                    header = el;
                    break;
                }
            }
        }

        if (!header) {
            console.error("Khóa đầu siêu cấp: Không tìm thấy phần tử phù hợp để bám đỉnh!");
            return;
        }

        // 2. TẠO PHẦN TỬ GIỮ CHỖ "TÀI HÌNH" (Chống sụp đổ layout)
        const placeholder = document.createElement('div');
        placeholder.style.setProperty('display', 'none', 'important');
        placeholder.style.setProperty('margin', '0', 'important');
        placeholder.style.setProperty('padding', '0', 'important');
        header.parentNode.insertBefore(placeholder, header);

        // Lưu lại inline style gốc của header để hoàn tác khi cần
        const originalStyle = header.getAttribute('style') || '';

        // Hàm tính toán vị trí đỉnh chính xác (bất chấp khoảng cuộn ban đầu)
        function getOffsetTop(element) {
            let box = element.getBoundingClientRect();
            let body = document.body;
            let docEl = document.documentElement;
            let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
            let clientTop = docEl.clientTop || body.clientTop || 0;
            return box.top + scrollTop - clientTop;
        }

        let headerOffsetTop = getOffsetTop(header);

        // Cập nhật lại tọa độ nếu người dùng resize trình duyệt
        window.addEventListener('resize', () => {
            if (!header.style.position.includes('fixed')) {
                headerOffsetTop = getOffsetTop(header);
            }
        });

        // 3. HÀM KHÓA ĐẦU CƯỠNG CHẾ 100% (FORCE LOCK)
        function forceLockHeader() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll >= headerOffsetTop && headerOffsetTop > 0) {
                // Đo chiều cao thực tế bao gồm cả border/padding của header
                const headerHeight = header.offsetHeight;

                // Kích hoạt phần tử giữ chỗ để trang không bị giật nảy
                placeholder.style.setProperty('height', headerHeight + 'px', 'important');
                placeholder.style.setProperty('display', 'block', 'important');

                // Bơm CSS ĐỘC QUYỀN - KHÓA CHẾT TUYỆT ĐỐI (Dùng !important)
                header.style.setProperty('position', 'fixed', 'important');
                header.style.setProperty('top', '0', 'important');
                header.style.setProperty('left', '0', 'important');
                header.style.setProperty('width', '100%', 'important');
                header.style.setProperty('max-width', '100%', 'important');
                header.style.setProperty('box-sizing', 'border-box', 'important');
                header.style.setProperty('z-index', '9999999', 'important'); // Chỉ số tối cao đè mọi thứ
                header.style.setProperty('margin', '0', 'important'); // Khử margin tránh lệch tâm
                
                // Thêm hiệu ứng bóng đổ nhẹ để tạo lớp tách biệt khi đè lên nội dung khác
                header.style.setProperty('box-shadow', '0 4px 20px rgba(0,0,0,0.2)', 'important');
                
            } else {
                // Trả lại nguyên trạng hoàn toàn CSS ban đầu của bạn
                placeholder.style.setProperty('display', 'none', 'important');
                if (originalStyle) {
                    header.setAttribute('style', originalStyle);
                } else {
                    header.removeAttribute('style');
                }
            }
        }

        // Lắng nghe sự kiện cuộn với cơ chế tối ưu hóa tốc độ phản hồi của trình duyệt
        window.addEventListener('scroll', forceLockHeader, { passive: true });
        
        // Chạy kích hoạt ngay lập tức nếu tải lại trang ở giữa chừng
        forceLockHeader();
    });
})();