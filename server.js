/**
 * BlueStep Shoes E-Commerce - Node.js Express Server
 *
 * Cấu trúc thư mục:
 *  ├── public/          -> Tài nguyên tĩnh (css, js, images)
 *  ├── views/           -> Giao diện các trang (index.html, cart.html, checkout.html, admin.html)
 *  ├── routes/          -> Điều hướng API (/api) và Trang (/pages)
 *  └── data/            -> File JSON lưu trữ dữ liệu (orders.json, products.json)
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import pagesRouter from './routes/pages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware phân tích cú pháp body JSON và URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Phục vụ tài nguyên tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

// Fallback phục vụ CSS & JS từ thư mục gốc
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// 2. Định tuyến API (/api/products, /api/orders) lưu đọc file JSON
app.use('/api', apiRouter);

// 3. Định tuyến hiển thị trang giao diện người dùng
app.use('/', pagesRouter);

// Khởi chạy server lắng nghe trên cổng 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================================');
  console.log(`👟 BlueStep Shoes Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`👉 Trang chủ sản phẩm:   http://localhost:${PORT}/`);
  console.log(`👉 Trang giỏ hàng:       http://localhost:${PORT}/cart`);
  console.log(`👉 Trang thanh toán:     http://localhost:${PORT}/checkout`);
  console.log(`👉 Trang quản trị admin: http://localhost:${PORT}/admin`);
  console.log(`👉 API Danh sách giày:   http://localhost:${PORT}/api/products`);
  console.log(`👉 API Đơn hàng (JSON):  http://localhost:${PORT}/api/orders`);
  console.log('📁 Dữ liệu đơn hàng được lưu trực tiếp vào: data/orders.json');
  console.log('========================================================');
});
