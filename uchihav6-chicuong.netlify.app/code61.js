(function() {
    window.addEventListener('DOMContentLoaded', function() {
        let el = document.querySelector('header') || document.querySelector('[class*="header"], [id*="header"], [class*="nav"], [class*="menu"]');
        if (!el) return;

        // Tạo một lò xo đệm ảo vô hình để hấp thụ lực rung của Layout
        const antiShakeBuffer = document.createElement('div');
        antiShakeBuffer.style.setProperty('display', 'none', 'important');
        antiShakeBuffer.style.setProperty('visibility', 'hidden', 'important');
        antiShakeBuffer.style.setProperty('margin', '0', 'important');
        antiShakeBuffer.style.setProperty('padding', '0', 'important');
        el.parentNode.insertBefore(antiShakeBuffer, el);

        const originTop = el.getBoundingClientRect().top + window.pageYOffset;

        function shakeFix() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollY >= originTop) {
                // Tính toán chính xác độ dày thực tế (bao gồm cả viền và khoảng đệm)
                const realHeight = el.getBoundingClientRect().height;
                
                // Đóng đinh khoảng trống ngay lập tức để chặn đứng hiện tượng sụp đổ layout gây rung
                antiShakeBuffer.style.setProperty('height', realHeight + 'px', 'important');
                antiShakeBuffer.style.setProperty('display', 'block', 'important');
            } else {
                // Trả lại trạng thái tĩnh khi không cuộn qua
                antiShakeBuffer.style.setProperty('display', 'none', 'important');
            }
        }
        window.addEventListener('scroll', shakeFix, { passive: true });
    });
})();