(function() {
    window.addEventListener('load', function() {
        let el = document.querySelector('header') || document.querySelector('[class*="header"], [id*="header"], [class*="nav"], [class*="menu"]');
        if (!el) return;

        let lastScrollTop = 0;
        const originTop = el.getBoundingClientRect().top + window.pageYOffset;

        function limitOverscroll() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScroll >= originTop) {
                // Tính toán vận tốc và hướng cuộn (Cuộn lên hay cuộn xuống)
                let delta = currentScroll - lastScrollTop;
                
                if (delta > 20) { 
                    // Nếu vuốt quá nhanh xuống dưới: Giới hạn lố đầu trên, giữ khoảng cách mượt
                    el.style.setProperty('top', '-5px', 'important'); 
                } else if (delta < -20) {
                    // Nếu khựng lại hoặc cuộn ngược lên: Ghìm nhẹ tạo độ nảy đàn hồi tinh tế
                    el.style.setProperty('top', '0px', 'important');
                }
            } else {
                el.style.removeProperty('top');
            }
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }
        
        // Theo dõi biến động liên tục để điều chỉnh biên độ lố đầu
        window.addEventListener('scroll', limitOverscroll, { passive: true });
    });
})();