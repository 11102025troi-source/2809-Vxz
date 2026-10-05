import express from 'express';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();
const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');
const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');
const MEMBERS_FILE = path.join(process.cwd(), 'data', 'members.json');
const PREORDERS_FILE = path.join(process.cwd(), 'data', 'preorders.json');

// Khởi tạo Gemini AI Client phía server
let aiClient = null;
function getGeminiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper đọc file JSON
function readJSON(filePath, defaultVal = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), 'utf-8');
      return defaultVal;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Lỗi đọc file ${filePath}:`, error);
    return defaultVal;
  }
}

// Helper ghi file JSON
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Lỗi ghi file ${filePath}:`, error);
    return false;
  }
}

// 1. GET /api/products - Lấy danh sách sản phẩm
router.get('/products', (req, res) => {
  const products = readJSON(PRODUCTS_FILE, []);
  res.json({ success: true, data: products });
});

// 2. GET /api/orders - Lấy danh sách tất cả đơn hàng (cho Admin)
router.get('/orders', (req, res) => {
  const orders = readJSON(ORDERS_FILE, []);
  res.json({ success: true, data: orders });
});

// 3. POST /api/orders - Đặt hàng mới (Lưu trực tiếp vào data/orders.json)
router.post('/orders', (req, res) => {
  const { customerName, phone, address, notes, paymentMethod, items, total } = req.body;

  if (!customerName || !phone || !address || !items || items.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Vui lòng cung cấp đầy đủ thông tin nhận hàng và sản phẩm!' 
    });
  }

  const orders = readJSON(ORDERS_FILE, []);

  // Sinh mã đơn hàng ngẫu nhiên #BS-XXXXXX
  const randomOrderId = 'BS-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const formattedTime = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  const newOrder = {
    id: randomOrderId,
    customerName,
    phone,
    address: address + (notes ? ` (${notes})` : ''),
    paymentMethod: paymentMethod || 'Tiền mặt khi nhận hàng (COD)',
    items,
    total: Number(total) || 0,
    status: 'Chờ xác nhận',
    createdAt: formattedTime
  };

  // Thêm vào đầu danh sách đơn hàng
  orders.unshift(newOrder);
  writeJSON(ORDERS_FILE, orders);

  console.log(`[Order Created] Đã lưu đơn hàng #${randomOrderId} vào file data/orders.json`);

  res.status(201).json({
    success: true,
    message: 'Đặt hàng thành công!',
    orderId: randomOrderId,
    order: newOrder
  });
});

// 4. PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng (Chờ xác nhận -> Đang giao -> Đã giao)
router.put('/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Thiếu trạng thái mới!' });
  }

  const orders = readJSON(ORDERS_FILE, []);
  const orderIndex = orders.findIndex(o => o.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });
  }

  orders[orderIndex].status = status;
  writeJSON(ORDERS_FILE, orders);

  res.json({
    success: true,
    message: `Đơn hàng #${id} đã chuyển sang trạng thái: ${status}`,
    order: orders[orderIndex]
  });
});

// 5. DELETE /api/orders/:id - Xóa đơn hàng
router.delete('/orders/:id', (req, res) => {
  const { id } = req.params;
  let orders = readJSON(ORDERS_FILE, []);
  const initialLength = orders.length;
  orders = orders.filter(o => o.id !== id);

  if (orders.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng để xóa!' });
  }

  writeJSON(ORDERS_FILE, orders);
  res.json({ success: true, message: `Đã xóa đơn hàng #${id}` });
});

// 6. POST /api/products - Thêm sản phẩm mới
router.post('/products', (req, res) => {
  const { name, brand, category, categoryName, price, originalPrice, image, sizes, description } = req.body;
  if (!name || !price) {
    return res.status(400).json({ success: false, message: 'Tên và giá sản phẩm là bắt buộc!' });
  }

  const products = readJSON(PRODUCTS_FILE, []);
  const newProduct = {
    id: Date.now(),
    name,
    brand: brand || 'Khác',
    category: category || 'sneaker',
    categoryName: categoryName || 'Sneaker dạo phố',
    price: Number(price),
    originalPrice: Number(originalPrice) || Number(price),
    rating: 5.0,
    reviews: 0,
    badge: 'Mới',
    badgeType: 'new',
    image: image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    sizes: Array.isArray(sizes) ? sizes.map(Number) : [39, 40, 41, 42],
    description: description || ''
  };

  products.push(newProduct);
  writeJSON(PRODUCTS_FILE, products);
  res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công!', product: newProduct });
});

// 7. PUT /api/products/:id - Cập nhật sản phẩm
router.put('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const products = readJSON(PRODUCTS_FILE, []);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm!' });
  }

  products[index] = { ...products[index], ...req.body, id };
  writeJSON(PRODUCTS_FILE, products);
  res.json({ success: true, message: 'Cập nhật sản phẩm thành công!', product: products[index] });
});

// 8. DELETE /api/products/:id - Xóa sản phẩm
router.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  let products = readJSON(PRODUCTS_FILE, []);
  const initialLen = products.length;
  products = products.filter(p => p.id !== id);

  if (products.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để xóa!' });
  }

  writeJSON(PRODUCTS_FILE, products);
  res.json({ success: true, message: `Đã xóa sản phẩm #${id}` });
});

// 9. POST /api/chat - Trợ lý chăm sóc khách hàng Shopkiet76
router.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'Nội dung tin nhắn không hợp lệ' });
  }

  const userQuery = message.trim();
  const products = readJSON(PRODUCTS_FILE, []);
  const orders = readJSON(ORDERS_FILE, []);

  // Tổng hợp dữ liệu sản phẩm của shopkiet76
  const productCatalogSummary = products.map(p => 
    `- ${p.name} (Hãng: ${p.brand}, Giá: ${p.price.toLocaleString('vi-VN')}₫, Danh mục: ${p.categoryName}, Size: ${p.sizes ? p.sizes.join(', ') : '39-44'})`
  ).join('\n');

  const systemInstruction = `Bạn là Trợ lý Shopkiet76 - trợ lý thông minh đa năng được trang bị trí tuệ nhân tạo Gemini AI của shopkiet76 (shopkiet76 Sneaker Store).

NĂNG LỰC CỦA BẠN:
1. KHẢ NĂNG TRẢ LỜI CÂU HỎI NHƯ GEMINI (Toàn diện, thông minh, sâu rộng):
   - Bạn có thể trò chuyện, phân tích và giải đáp mọi câu hỏi của người dùng như một trợ lý AI Gemini thực thụ: từ kiến thức tổng quát, khoa học, lịch sử, văn hóa, công nghệ, giải toán, dịch thuật, viết lách, mẹo vặt đời sống đến tư vấn phong cách thời trang, cách bảo quản và phối đồ với giày thể thao.
   - Luôn trả lời bằng tiếng Việt tự nhiên, súc tích, văn phong lịch sự, thông minh, hữu ích, sử dụng định dạng Markdown rõ ràng (gạch đầu dòng, in đậm điểm quan trọng) và chèn emoji sinh động (✨, 💡, 👟, 🚀, 😊).

2. CHUYÊN GIA SẢN PHẨM & DỊCH VỤ CỦA SHOPKIET76:
   - Khi người dùng hỏi về giày dép, thời trang, mua sắm hoặc chính sách của shopkiet76, bạn cung cấp thông tin chuẩn xác và chu đáo:
     + 100% Giày chính hãng (Nike, Adidas, Vans, New Balance, Puma, Jordan...). Bảo hành keo chỉ 12 tháng.
     + Miễn phí vận chuyển cho đơn hàng từ 1.000.000₫ (dưới 1 triệu phí ship đồng giá 35.000₫ toàn quốc).
     + Được mở hộp kiểm tra và thử giày trước khi thanh toán tiền.
     + Đổi size miễn phí trong 30 ngày tận nơi nếu mang không vừa vặn.
     + Mã giảm giá hiện có: SHOPKIET76 (giảm 10%), CHAOBAN (giảm 100k cho khách mới), VIP20 (giảm 20% cho khách VIP).
     + Hotline: 1900 8888 | Email: support@shopkiet76.vn.
     + HỆ THỐNG 2 CHI NHÁNH CỦA SHOPKIET76:
       * Chi Nhánh 1 (Chi Nhánh Chính): 172 Quang Trung Phường Trương Quang Trọng Tỉnh Quảng Ngãi (SĐT: 1900 8888 - 0912 345 678, Mở cửa: 8:00 - 22:00 T2-CN).
       * Chi Nhánh 2 (Chi Nhánh TP.HCM): 456 Đường Số 7, Quận 12, TP.HCM (SĐT: 1900 8888 - 0988 777 999, Mở cửa: 8:00 - 21:00 T2-CN).
     + Bảng size giày chuẩn xác theo cm:
       * 24.0 - 24.5cm -> Size 39
       * 25.0 - 25.5cm -> Size 40
       * 26.0cm -> Size 41
       * 26.5cm -> Size 42
       * 27.0cm -> Size 43
       * 27.5 - 28.0cm -> Size 44
     + Danh mục giày tại shopkiet76:
${productCatalogSummary}
     + Sản phẩm Flagship nổi bật: "Vans Old Skool Classic Navy Blue" (1.750.000₫, mã VN0A4BV8V3X, Canvas + Da lộn cao cấp, đế bánh quế Waffle siêu bám đường).`;

  // Kiểm tra nếu có mã đơn hàng trong câu hỏi
  const orderIdMatch = userQuery.match(/#?BS-\d{5,7}/i);
  let orderInfoContext = '';
  if (orderIdMatch) {
    const rawId = orderIdMatch[0].replace('#', '').toUpperCase();
    const foundOrder = orders.find(o => o.orderId && o.orderId.toUpperCase() === rawId);
    if (foundOrder) {
      orderInfoContext = `\n[Thông tin đơn hàng khách đang hỏi: Mã #${foundOrder.orderId}, Khách hàng: ${foundOrder.customerName}, Tổng tiền: ${foundOrder.total.toLocaleString('vi-VN')}₫, Trạng thái: ${foundOrder.status === 'shipping' ? 'Đang giao hàng' : foundOrder.status === 'delivered' ? 'Đã giao thành công' : 'Đang xử lý / Chờ xác nhận'}]`;
    }
  }

  const ai = getGeminiClient();

  if (ai) {
    const contents = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item && item.text) {
          contents.push({
            role: item.role === 'model' ? 'model' : 'user',
            parts: [{ text: item.text }]
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: userQuery + orderInfoContext }]
    });

    // Thử lần lượt các mô hình Gemini tốc độ cao, ổn định và dồi dào quota nhất
    const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.5-flash'];

    for (const modelName of candidateModels) {
      try {
        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Gemini timeout on ${modelName}`)), 15000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);
        const replyText = response?.text;

        if (replyText && replyText.trim().length > 0) {
          return res.json({ success: true, reply: replyText, source: 'gemini', model: modelName });
        }
      } catch (error) {
        console.warn(`Gemini model [${modelName}] không khả dụng, thử mô hình tiếp theo:`, error?.message);
      }
    }
  }

  // Fallback thông minh nếu không có API key hoặc lỗi kết nối
  let fallbackReply = '';
  const lowerQuery = userQuery.toLowerCase();

  if (lowerQuery.includes('size') || lowerQuery.includes('cỡ') || lowerQuery.includes('đo chân')) {
    fallbackReply = `👟 **Bảng Hướng Dẫn Chọn Size Giày Chuẩn Tại shopkiet76:**\n\n- Chiều dài chân 24.0 - 24.5cm ➔ **Size 39**\n- Chiều dài chân 25.0 - 25.5cm ➔ **Size 40**\n- Chiều dài chân 26.0cm ➔ **Size 41**\n- Chiều dài chân 26.5cm ➔ **Size 42**\n- Chiều dài chân 27.0cm ➔ **Size 43**\n- Chiều dài chân 27.5 - 28.0cm ➔ **Size 44**\n\n💡 *Mẹo:* Nếu mu bàn chân dày hoặc đi kèm tất thể thao dày, bạn nên tăng thêm 0.5 - 1 size để thoải mái nhất nhé!`;
  } else if (lowerQuery.includes('vans') || lowerQuery.includes('old skool') || lowerQuery.includes('navy')) {
    fallbackReply = `🔥 **Vans Old Skool Classic Navy Blue (Mã: VN0A4BV8V3X)** đang là sản phẩm Flagship nổi bật tại shopkiet76!\n\n- **Giá ưu đãi:** 1.750.000₫ (Giá gốc 2.000.000₫)\n- **Chất liệu:** Vải Canvas dày dặn kết hợp da lộn cao cấp\n- **Đặc trưng:** Dải lượn sóng Sidestripe kinh điển từ 1977, đế cao su bánh quế Waffle siêu bám đường\n- **Size sẵn có:** 38, 39, 40, 41, 42, 43\n\nBạn có thể bấm ngay nút "Mua Ngay" trên Banner để đặt hàng nhé!`;
  } else if (lowerQuery.includes('mã') || lowerQuery.includes('voucher') || lowerQuery.includes('khuyến mãi') || lowerQuery.includes('giảm giá')) {
    fallbackReply = `🎁 **Mã Giảm Giá Đang Áp Dụng Tại shopkiet76:**\n\n1. **SHOPKIET76**: Giảm ngay **10%** cho toàn bộ sản phẩm\n2. **CHAOBAN**: Giảm ngay **100.000₫** cho đơn hàng đầu tiên\n3. **VIP20**: Giảm **20%** dành riêng cho khách hàng thân thiết\n\n👉 Bạn chỉ cần nhập mã tại trang Giỏ hàng để nhận ưu đãi ngay lập tức!`;
  } else if (lowerQuery.includes('địa chỉ') || lowerQuery.includes('cửa hàng') || lowerQuery.includes('ở đâu') || lowerQuery.includes('chi nhánh') || lowerQuery.includes('store') || lowerQuery.includes('hồ chí minh') || lowerQuery.includes('tphcm') || lowerQuery.includes('sài gòn') || lowerQuery.includes('quảng ngãi')) {
    fallbackReply = `📍 **Hệ Thống 2 Chi Nhánh Chính Hãng shopkiet76:**\n\n🏢 **1. Chi Nhánh Chính (Quảng Ngãi):**\n- Địa chỉ: 172 Quang Trung Phường Trương Quang Trọng Tỉnh Quảng Ngãi\n- Điện thoại: 1900 8888 - 0912 345 678\n- Giờ mở cửa: Thứ 2 – Chủ Nhật, 8:00 – 22:00\n\n🏢 **2. Chi Nhánh TP.HCM (Mới):**\n- Địa chỉ: 456 Đường Số 7, Quận 12, TP.HCM\n- Điện thoại: 1900 8888 - 0988 777 999\n- Giờ mở cửa: Thứ 2 – Chủ Nhật, 8:00 – 21:00\n\n✨ Bạn có thể ghé trực tiếp bất kỳ chi nhánh nào để được đo chân, thử giày và nhận quà ưu đãi nhé!`;
  } else if (lowerQuery.includes('ship') || lowerQuery.includes('giao hàng') || lowerQuery.includes('vận chuyển') || lowerQuery.includes('phí')) {
    fallbackReply = `🚚 **Chính Sách Vận Chuyển Của shopkiet76:**\n\n- **Miễn phí 100% phí giao hàng** cho đơn từ 1.000.000₫ trở lên.\n- Đơn dưới 1 triệu: Phí vận chuyển đồng giá 35.000₫ toàn quốc.\n- **Thời gian giao:**\n  + Khu vực Quảng Ngãi & lân cận: 24h\n  + Các tỉnh thành khác trên toàn quốc: 2 - 3 ngày làm việc.\n- Đặc biệt: Bạn được quyền **mở hộp kiểm tra giày và đi thử** trước khi trả tiền!`;
  } else if (lowerQuery.includes('đổi') || lowerQuery.includes('trả') || lowerQuery.includes('bảo hành')) {
    fallbackReply = `🛡️ **Chính Sách Đổi Size & Bảo Hành:**\n\n- **Đổi size miễn phí trong 30 ngày:** Nhân viên shop mang size mới tận nhà đổi cho bạn nếu không vừa vặn.\n- **Bảo hành 12 tháng:** Bảo hành keo dán, đường may, đế giày chính hãng.\n- Cam kết 100% hàng chuẩn Authentic, bồi hoàn nếu phát hiện hàng giả.`;
  } else if (lowerQuery.includes('thành viên') || lowerQuery.includes('hội viên') || lowerQuery.includes('đăng ký') || lowerQuery.includes('member')) {
    fallbackReply = `👑 **Chương Trình Đăng Ký Hội Viên shopkiet76:**\n\n- **Đặc quyền thành viên:**\n  🎁 Nhận ngay **50 Điểm Thưởng Chào Mừng** (tương đương 50.000₫).\n  🎂 Tặng voucher giảm **15%** trong tháng sinh nhật.\n  🚚 **Miễn phí giao hàng** toàn quốc cho đơn từ 1 triệu.\n  👟 Đổi size tận nhà miễn phí trong **30 ngày**.\n\n👉 Bạn hãy bấm vào mục **"Đăng Ký Thành Viên"** trên thanh Menu hoặc truy cập ngay đường dẫn: [/register](/register) để tạo tài khoản chỉ trong 1 phút nhé!`;
  } else if (orderIdMatch) {
    const rawId = orderIdMatch[0].replace('#', '').toUpperCase();
    const foundOrder = orders.find(o => o.orderId && o.orderId.toUpperCase() === rawId);
    if (foundOrder) {
      fallbackReply = `📦 **Thông Tin Đơn Hàng #${foundOrder.orderId}:**\n\n- Khách hàng: **${foundOrder.customerName}**\n- Số điện thoại: ${foundOrder.phone}\n- Tổng tiền: **${foundOrder.total.toLocaleString('vi-VN')}₫**\n- Trạng thái: **${foundOrder.status === 'shipping' ? 'Đang giao hàng' : foundOrder.status === 'delivered' ? 'Đã giao thành công' : 'Chờ xác nhận & đóng gói'}**\n\nĐơn hàng sẽ được giao đến bạn theo đúng lịch trình!`;
    } else {
      fallbackReply = `🔍 Rất tiếc, shopkiet76 không tìm thấy đơn hàng mã **${orderIdMatch[0]}** trong hệ thống. Vui lòng kiểm tra lại mã đơn hoặc gọi hotline 1900 8888 để được hỗ trợ nhé!`;
    }
  } else {
    fallbackReply = `Dạ chào bạn! Em là **Trợ lý Shopkiet76**. ✨\n\nEm có thể hỗ trợ bạn:\n- 👟 Tư vấn chọn size giày chuẩn xác theo cm\n- 👟 Gợi ý các mẫu giày hot (Nike, Adidas, Vans Old Skool Navy, New Balance...)\n- 🎁 Cung cấp mã giảm giá (**SHOPKIET76** giảm 10%)\n- 🚚 Giải đáp chính sách miễn phí vận chuyển & đổi size 30 ngày\n- 📦 Tra cứu tình trạng đơn hàng theo mã #BS-...\n\nBạn đang quan tâm đến dòng giày hay cần em hỗ trợ điều gì ạ?`;
  }

  res.json({ success: true, reply: fallbackReply, source: 'smart_fallback' });
});

// ==========================================
// 8. API QUẢN LÝ THÀNH VIÊN (MEMBERSHIP API)
// ==========================================

// GET /api/members - Lấy danh sách thành viên (Dành cho Quản trị viên)
router.get('/members', (req, res) => {
  const members = readJSON(MEMBERS_FILE, []);
  // Ẩn mật khẩu khi trả về danh sách
  const safeMembers = members.map(m => {
    const { password, passwordHash, ...rest } = m;
    return rest;
  });
  res.json({ success: true, total: safeMembers.length, data: safeMembers });
});

// POST /api/members/register - Đăng ký tài khoản thành viên mới
router.post('/members/register', (req, res) => {
  const {
    fullName,
    dob,
    gender,
    phone,
    email,
    address,
    username,
    password,
    confirmPassword,
    termsAccepted
  } = req.body;

  // 1. Kiểm tra các trường bắt buộc
  if (!fullName || !dob || !gender || !phone || !email || !address || !username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ tất cả các trường thông tin bắt buộc!'
    });
  }

  // 2. Kiểm tra điều khoản sử dụng
  if (!termsAccepted) {
    return res.status(400).json({
      success: false,
      message: 'Bạn cần đồng ý với Điều khoản sử dụng & Quy chế hội viên để tiếp tục!'
    });
  }

  // 3. Kiểm tra mật khẩu khớp nhau
  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Mật khẩu xác nhận không trùng khớp! Vui lòng nhập lại.'
    });
  }

  // 4. Kiểm tra độ dài mật khẩu
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự!'
    });
  }

  // 5. Kiểm tra định dạng số điện thoại Việt Nam
  const phoneClean = phone.replace(/[\s.-]/g, '');
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!phoneRegex.test(phoneClean)) {
    return res.status(400).json({
      success: false,
      message: 'Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại 10 chữ số đúng định dạng.'
    });
  }

  // 6. Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Địa chỉ email không hợp lệ!'
    });
  }

  const members = readJSON(MEMBERS_FILE, []);

  // 7. Kiểm tra trùng tên đăng nhập (Username)
  const isUsernameTaken = members.some(m => m.username && m.username.toLowerCase() === username.trim().toLowerCase());
  if (isUsernameTaken) {
    return res.status(409).json({
      success: false,
      message: `Tên đăng nhập "${username}" đã được sử dụng. Vui lòng chọn tên đăng nhập khác!`
    });
  }

  // 8. Kiểm tra trùng Email
  const isEmailTaken = members.some(m => m.email && m.email.toLowerCase() === email.trim().toLowerCase());
  if (isEmailTaken) {
    return res.status(409).json({
      success: false,
      message: `Địa chỉ email "${email}" đã được đăng ký tài khoản trước đó!`
    });
  }

  // 9. Kiểm tra trùng Số điện thoại
  const isPhoneTaken = members.some(m => m.phone && m.phone.replace(/[\s.-]/g, '') === phoneClean);
  if (isPhoneTaken) {
    return res.status(409).json({
      success: false,
      message: `Số điện thoại "${phone}" đã được liên kết với một tài khoản thành viên khác!`
    });
  }

  // 10. Tạo mã thành viên mới
  const memberCode = 'SK76-M-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const formattedTime = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  const newMember = {
    id: memberCode,
    fullName: fullName.trim(),
    dob: dob.trim(),
    gender: gender.trim(),
    phone: phoneClean,
    email: email.trim().toLowerCase(),
    address: address.trim(),
    username: username.trim(),
    passwordHash: '••••••••',
    membershipLevel: 'Thành viên Bạc (Mới)',
    rewardPoints: 50, // Tặng 50 điểm chào mừng
    status: 'Hoạt động',
    createdAt: formattedTime
  };

  members.unshift(newMember);
  writeJSON(MEMBERS_FILE, members);

  console.log(`[Member Registered] Đã lưu thành viên mới: ${newMember.fullName} (${newMember.id}) vào data/members.json`);

  res.status(201).json({
    success: true,
    message: 'Chúc mừng bạn đã đăng ký tài khoản thành viên shopkiet76 thành công!',
    member: {
      id: newMember.id,
      fullName: newMember.fullName,
      dob: newMember.dob,
      gender: newMember.gender,
      phone: newMember.phone,
      email: newMember.email,
      address: newMember.address,
      username: newMember.username,
      membershipLevel: newMember.membershipLevel,
      rewardPoints: newMember.rewardPoints,
      status: newMember.status,
      createdAt: newMember.createdAt
    }
  });
});

// POST /api/members/login - Đăng nhập hội viên
router.post('/members/login', (req, res) => {
  const { account, password } = req.body;
  if (!account || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập/email và mật khẩu!' });
  }

  const members = readJSON(MEMBERS_FILE, []);
  const cleanAcc = account.trim().toLowerCase();
  const member = members.find(m => 
    (m.username && m.username.toLowerCase() === cleanAcc) ||
    (m.email && m.email.toLowerCase() === cleanAcc) ||
    (m.phone && m.phone === cleanAcc)
  );

  if (!member) {
    return res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác!' });
  }

  const { password: pw, passwordHash, ...safeMember } = member;
  res.json({
    success: true,
    message: `Chào mừng ${safeMember.fullName} quay trở lại!`,
    member: safeMember
  });
});

// DELETE /api/members/:id - Xóa thành viên (Admin)
router.delete('/members/:id', (req, res) => {
  const { id } = req.params;
  const members = readJSON(MEMBERS_FILE, []);
  const initialLen = members.length;
  const filtered = members.filter(m => m.id !== id);

  if (filtered.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy thành viên có mã ' + id });
  }

  writeJSON(MEMBERS_FILE, filtered);
  res.json({ success: true, message: `Đã xóa thành viên mã #${id} thành công!` });
});

// GET /api/preorders - Danh sách các đơn đặt trước
router.get('/preorders', (req, res) => {
  const preorders = readJSON(PREORDERS_FILE, []);
  res.json({ success: true, data: preorders, total: preorders.length });
});

// POST /api/preorders - Tạo phiếu đặt trước giày sắp ra mắt
router.post('/preorders', (req, res) => {
  try {
    const { fullName, phone, email, address, productId, productName, size, depositOption, note } = req.body;

    if (!fullName || !phone || !size) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Kích cỡ giày muốn đặt trước!'
      });
    }

    const preorders = readJSON(PREORDERS_FILE, []);
    const products = readJSON(PRODUCTS_FILE, []);
    const product = products.find(p => p.id === Number(productId));

    const preOrderTicket = {
      id: 'PRE-' + Date.now().toString().slice(-6),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: (email || '').trim(),
      address: (address || '').trim(),
      productId: Number(productId),
      productName: productName || product?.name || 'Giày Sneaker Pre-order',
      image: product?.image || '/images/af1_low_se_rainbow.jpg',
      size: Number(size),
      price: product?.price || 0,
      expectedDate: product?.expectedDate || 'Tháng 10 - 11/2026',
      depositOption: depositOption || 'zero_deposit',
      depositAmount: depositOption === 'deposit_200k' ? 200000 : 0,
      note: (note || '').trim(),
      status: 'Đã Giữ Suất (Chờ Hàng Về)',
      createdAt: new Date().toISOString()
    };

    preorders.unshift(preOrderTicket);
    writeJSON(PREORDERS_FILE, preorders);

    // Cập nhật giảm slot đặt trước còn lại của sản phẩm
    if (product && product.slotsLeft > 0) {
      product.slotsLeft -= 1;
      writeJSON(PRODUCTS_FILE, products);
    }

    res.status(201).json({
      success: true,
      message: 'Đặt trước siêu phẩm giày thành công!',
      data: preOrderTicket
    });
  } catch (error) {
    console.error('Lỗi tạo đơn đặt trước:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xử lý đặt trước!' });
  }
});

export default router;
