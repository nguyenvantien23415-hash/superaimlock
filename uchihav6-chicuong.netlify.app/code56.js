(function() {
    window.addEventListener('load', function() {
        let target = document.querySelector('header') || document.querySelector('[class*="header"], [id*="header"], [class*="nav"], [class*="menu"]');
        if (!target) return;

        // Đo đạc tọa độ gốc trong không gian 2D của trang web
        const targetRect = target.getBoundingClientRect();
        const absoluteTop = targetRect.top + window.pageYOffset;

        function aimLock() {
            // Lấy vị trí cuộn thời gian thực của trục Y với độ chính xác cao nhất
            const currentY = window.pageYOffset || document.documentElement.scrollTop;

            if (currentY >= absoluteTop) {
                // Kích hoạt cơ chế AimLock - Khóa chết mục tiêu tại đỉnh màn hình
                target.style.setProperty('position', 'fixed', 'important');
                target.style.setProperty('top', '0px', 'important');
                target.style.setProperty('left', '0px', 'important');
                target.style.setProperty('z-index', '9999999', 'important');
            } else {
                // Giải phóng mục tiêu khi quay về vị trí cũ
                target.style.removeProperty('position');
                target.style.removeProperty('top');
                target.style.removeProperty('left');
                target.style.removeProperty('z-index');
            }
        }
        // Khóa mục tiêu liên tục theo tần suất cuộn của chuột
        window.addEventListener('scroll', aimLock, { passive: true });
        aimLock();
    });
})();