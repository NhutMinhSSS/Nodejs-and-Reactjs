const corsOptions = {
  origin: function (origin, callback) {
    // Danh sách các địa chỉ IP được phép
    const allowedIPs = ['192.168.1.15', '192.168.1.7', '171.245.160.248'];

    // Kiểm tra xem địa chỉ IP của yêu cầu có nằm trong danh sách được phép hay không
    if (allowedIPs.includes(origin)) {
      // Nếu địa chỉ IP nằm trong danh sách, cho phép CORS
      callback(null, true);
    } else {
      // Nếu địa chỉ IP không nằm trong danh sách, từ chối CORS
      callback(new Error('Not allowed by CORS'));
    }
  }
};

module.exports = corsOptions;