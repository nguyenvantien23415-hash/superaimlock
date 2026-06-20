(function() {
    window.addEventListener('load', function() {
        // Tự động tìm kiếm "Đầu" (Head) của nội dung trang web (Thẻ H1 hoặc tiêu đề bài viết)
        let targetHead = document.querySelector('h1') || document.querySelector('.title, [class*="title"], [id*="title"]');
        
        if (!targetHead) return;

        let isLocked = false;

        function lockViewToHead() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const targetPos = targetHead.getBoundingClientRect().top + scrollY;

            // Khi người dùng cuộn đến gần vùng "Đầu", kích hoạt AimLock khóa góc nhìn vào đó
            if (scrollY > (targetPos - 150) && scrollY < (targetPos + 150) && !isLocked) {
                isLocked = true;
                
                // Khóa chết và di chuyển camera (cuộn) mượt mà thẳng vào tâm mục tiêu
                window.scrollTo({
                    top: targetPos - 20, // Khóa khoảng cách an toàn cách đỉnh 20px
                    behavior: 'smooth'
                });

                // Giải phóng khóa sau 1 giây để người dùng có thể tiếp tục cuộn nếu muốn
                setTimeout(() => { isLocked = false; }, 1000);
            }
        }

        window.addEventListener('scroll', lockViewToHead, { passive: true });
    });
})();