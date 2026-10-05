import express from 'express';
import path from 'path';

const router = express.Router();
const VIEWS_DIR = path.join(process.cwd(), 'views');

// Trang chủ sản phẩm
router.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'index.html'));
});

// Trang giỏ hàng
router.get(['/cart', '/cart.html'], (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'cart.html'));
});

// Trang thanh toán
router.get(['/checkout', '/checkout.html'], (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'checkout.html'));
});

// Trang đăng ký thành viên
router.get(['/register', '/register.html'], (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'register.html'));
});

// Trang liên hệ & chi nhánh
router.get(['/contact', '/contact.html'], (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'contact.html'));
});

// Trang trung tâm hội viên VIP
router.get(['/member', '/member.html'], (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'member.html'));
});

// Trang quản trị
router.get(['/admin', '/admin.html'], (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'admin.html'));
});

export default router;
