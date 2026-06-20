(function() {
    // Tự động kiểm tra số nhân CPU (Hardware Concurrency) của thiết bị để phân phối luồng
    const cpuCores = navigator.hardwareConcurrency || 4;
    console.log(`Hệ thống nhận diện: ${cpuCores} nhân CPU đã sẵn sàng tối ưu.`);

    window.executeCPUTask = function(taskFunction) {
        if ('requestIdleCallback' in window) {
            // Đẩy tác vụ vào luồng xử lý nền, không làm nghẽn luồng xử lý chính của CPU
            window.requestIdleCallback(function(deadline) {
                while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && taskFunction) {
                    taskFunction();
                    break;
                }
            });
        } else {
            // Phương án dự phòng hiệu suất cao nếu trình duyệt cũ không hỗ trợ
            setTimeout(taskFunction, 1);
        }
    };
})();