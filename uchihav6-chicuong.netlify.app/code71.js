(function() {
    /**
     * HIGH-HERTZ INTERPOLATION SMOOTH ENGINE - MOBILE MAX
     * Đồng bộ hóa và làm mượt mọi hành vi kéo dịch chuyển trục, chống tụt khung hình (Drop FPS) trên mobile
     */
    window.Mobile_SmoothEngine = {
        alpha: 0.16, // Hệ số mượt mà tối ưu cho màn hình cảm ứng di động
        
        interpolateMobileVector: function(current, target, deltaModifier) {
            const adjustedAlpha = 1 - Math.pow(1 - this.alpha, deltaModifier || 1);
            return {
                x: current.x + (target.x - current.x) * adjustedAlpha,
                y: current.y + (target.y - current.y) * adjustedAlpha
            };
        }
    };
    console.log("Mobile Smooth Engine Max: Đã mở khóa thuật toán nội suy tần số quét cao.");
})();