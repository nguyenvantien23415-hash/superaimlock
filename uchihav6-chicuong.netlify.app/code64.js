(function() {
    window.addEventListener('DOMContentLoaded', function() {
        let el = document.querySelector('header') || document.querySelector('[class*="header"], [id*="header"], [class*="nav"], [class*="menu"]');
        if (!el) return;

        function resetCenter() {
            if (window.pageYOffset > el.offsetTop) {
                // Ép đưa về tâm màn hình tuyệt đối, khóa Box-Sizing
                el.style.setProperty('box-sizing', 'border-box', 'important');
                el.style.setProperty('left', '50%', 'important');
                el.style.setProperty('transform', 'translateX(-50%)', 'important');
                el.style.setProperty('margin', '0 auto', 'important');
                
                // Giữ độ rộng tối đa chuẩn theo khung nhìn, không cho phép tràn hoặc co
                el.style.setProperty('width', '100%', 'important');
                el.style.setProperty('max-width', '100vw', 'important');
            }
        }
        window.addEventListener('scroll', resetCenter, { passive: true });
        window.addEventListener('resize', resetCenter);
    });
})();