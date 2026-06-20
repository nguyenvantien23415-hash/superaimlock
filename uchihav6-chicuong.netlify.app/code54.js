(function() {
    const fpsTarget = 120;
    const frameTime = 1000 / fpsTarget; // ~8.33ms mỗi khung hình
    let lastFrameTime = performance.now();

    function renderLoop(timestamp) {
        const elapsed = timestamp - lastFrameTime;

        if (elapsed >= frameTime) {
            // Tính toán bù trừ thời gian thừa để giữ nhịp độ khung hình ổn định ở mức 120 FPS
            lastFrameTime = timestamp - (elapsed % frameTime);
            
            // Kích hoạt một sự kiện ảo ép luồng giao diện cập nhật liên tục
            window.dispatchEvent(new CustomEvent('core_fps_tick'));
        }
        
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
})();