const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const FormatUtils = require('../common/utils/format.utils');

// Tạo folder để lưu trữ file log nếu chưa tồn tại
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Tạo logger object
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    // format.json()
    format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} ${level}: ${message}${stack || ''}`;
    })
  ),
  transports: [
    //new transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error'}),
    new transports.File({ filename: path.join(logDirectory, 'combined.log')})
  ]
});

// // Nếu không ở môi trường sản phẩm, hiển thị log ra console
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new transports.Console({
//     format: format.combine(
//       format.colorize(),
//       format.simple()
//     )
//   }));
// }
module.exports = logger;
