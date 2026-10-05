/**
 * ============================================================================
 * shopkiet76 SHOES - TẬP LỆNH XỬ LÝ TRUNG TÂM (CORE SCRIPT)
 * 
 * Chức năng:
 * 1. Tối ưu hóa tải hình ảnh nhanh, chống giật khung hình (CLS)
 * 2. Quản lý danh mục sản phẩm, bộ lọc tìm kiếm tức thì
 * 3. Quản lý giỏ hàng (LocalStorage & đồng bộ API Express)
 * 4. Kích thước nút bấm chuẩn di động (Touch Target >= 44px)
 * 5. Tự động cập nhật huy hiệu số lượng trên Header và Bottom Navigation Bar
 * 6. Xử lý đặt hàng & thông báo Toast trực quan
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. DANH MỤC SẢN PHẨM MẪU (HÌNH ẢNH ĐƯỢC TỐI ƯU HÓA KÍCH THƯỚC & ĐỊNH DẠNG)
// ----------------------------------------------------------------------------
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Nike Air Zoom Pegasus 40 Electric Blue",
    brand: "Nike",
    category: "running",
    categoryName: "Chạy bộ",
    price: 2850000,
    originalPrice: 3500000,
    rating: 4.9,
    reviews: 128,
    badge: "Bán chạy",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=75",
    sizes: [39, 40, 41, 42, 43, 44],
    description: "Dòng giày chạy bộ huyền thoại của Nike với đệm khí Zoom Air kép mang lại độ đàn hồi tối đa và êm ái trên từng sải bước."
  },
  {
    id: 2,
    name: "Adidas Ultraboost Light Royal Cyan",
    brand: "Adidas",
    category: "running",
    categoryName: "Chạy bộ",
    price: 3200000,
    originalPrice: 4200000,
    rating: 4.8,
    reviews: 95,
    badge: "Giảm 24%",
    badgeType: "sale",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=75",
    sizes: [38, 39, 40, 41, 42, 43],
    description: "Trọng lượng nhẹ hơn 30% so với thế hệ trước cùng đệm Boost cải tiến ôm khít chân."
  },
  {
    id: 3,
    name: "New Balance 574 Legacy Deep Sea Blue",
    brand: "New Balance",
    category: "lifestyle",
    categoryName: "Thời trang",
    price: 2450000,
    originalPrice: 2900000,
    rating: 4.8,
    reviews: 142,
    badge: "Bán chạy",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=75",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    description: "Thiết kế retro kinh điển thập niên 80 với chất liệu da lộn cao cấp kết hợp đệm ENCAP nâng đỡ hoàn hảo."
  },
  {
    id: 4,
    name: "Vans Old Skool Classic Navy Blue",
    brand: "Vans",
    category: "sneaker",
    categoryName: "Sneaker dạo phố",
    price: 1750000,
    originalPrice: 2000000,
    rating: 4.7,
    reviews: 186,
    badge: "Ưa chuộng",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=75",
    sizes: [38, 39, 40, 41, 42, 43],
    description: "Đường sidestripe lượn sóng đặc trưng, vải canvas dày dặn và đế bánh quế Waffle siêu bám đường."
  },
  {
    id: 5,
    name: "Nike Air Force 1 '07 Low University Blue",
    brand: "Nike",
    category: "sneaker",
    categoryName: "Sneaker dạo phố",
    price: 2990000,
    originalPrice: 3400000,
    rating: 4.9,
    reviews: 245,
    badge: "Mới về",
    badgeType: "new",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=75",
    sizes: [39, 40, 41, 42, 43, 44],
    description: "Biểu tượng sneaker toàn cầu với da thật, đệm Nike Air êm ái cùng màu University Blue năng động."
  },
  {
    id: 6,
    name: "Adidas Forum Low Cobalt Classic",
    brand: "Adidas",
    category: "sneaker",
    categoryName: "Sneaker dạo phố",
    price: 2350000,
    originalPrice: 2800000,
    rating: 4.8,
    reviews: 93,
    badge: "Giảm 16%",
    badgeType: "sale",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=75",
    sizes: [39, 40, 41, 42, 43],
    description: "Hơi thở bóng rổ thập niên 84 với quai dán cá tính và da cao cấp xanh cô-ban phong cách."
  },
  {
    id: 7,
    name: "New Balance 550 White Team Royal",
    brand: "New Balance",
    category: "sneaker",
    categoryName: "Sneaker dạo phố",
    price: 3100000,
    originalPrice: 3600000,
    rating: 4.9,
    reviews: 167,
    badge: "Mới về",
    badgeType: "new",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=75",
    sizes: [40, 41, 42, 43, 44],
    description: "Phong cách vintage hoài cổ với phối màu trắng xanh hoàng gia thanh lịch và sang trọng."
  },
  {
    id: 8,
    name: "Vans Sk8-Hi Reissue True Navy",
    brand: "Vans",
    category: "lifestyle",
    categoryName: "Thời trang",
    price: 1950000,
    originalPrice: 2300000,
    rating: 4.7,
    reviews: 112,
    badge: "Giảm 15%",
    badgeType: "sale",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=75",
    sizes: [38, 39, 40, 41, 42, 43],
    description: "Cổ cao bảo vệ cổ chân, đệm lót êm ái cùng mũi giày gia cố chịu lực bền bỉ vượt trội."
  },
  {
    id: 9,
    name: "Nike Invincible 3 Ocean Wave Running",
    brand: "Nike",
    category: "running",
    categoryName: "Chạy bộ",
    price: 4350000,
    originalPrice: 5100000,
    rating: 4.9,
    reviews: 84,
    badge: "Cao cấp",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=75",
    sizes: [40, 41, 42, 43, 44, 45],
    description: "Bọt ZoomX siêu dày đàn hồi tối đa, bảo vệ khớp chân hoàn hảo trên các cự ly chạy dài."
  },
  {
    id: 10,
    name: "Adidas Samba OG Blue Chalk White",
    brand: "Adidas",
    category: "lifestyle",
    categoryName: "Thời trang",
    price: 2790000,
    originalPrice: 3200000,
    rating: 5.0,
    reviews: 310,
    badge: "Bán chạy",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=600&q=75",
    sizes: [38, 39, 40, 41, 42, 43],
    description: "Mẫu giày thịnh hành nhất với mũi da lộn chữ T kinh điển và đế cao su gum bám tốt."
  },
  {
    id: 11,
    name: "Nike Air Force 1 Low 'Black ACG' Hyper Pink (CD0887-001)",
    brand: "Nike",
    category: "sneaker",
    categoryName: "Sneaker dạo phố",
    price: 3150000,
    originalPrice: 3800000,
    rating: 4.9,
    reviews: 76,
    badge: "Bản ACG",
    badgeType: "new",
    image: "/images/nike_acg_black_pink.jpg",
    sizes: [39, 40, 41, 42, 43, 44],
    description: "Phiên bản All Conditions Gear (ACG) phong cách dã ngoại biểu tượng. Mã sản phẩm CD0887-001 phối màu đen cá tính kết hợp dấu Swoosh màu hồng Hyper Pink và gót Persian Violet nổi bật, chất liệu da lộn bền bỉ cùng đệm Nike Air."
  },
  {
    id: 12,
    name: "Nike Air Force 1 Low '07 SE 'Rainbow'",
    brand: "Nike",
    category: "sneaker",
    categoryName: "Sneaker dạo phố",
    price: 2950000,
    originalPrice: 3600000,
    rating: 4.9,
    reviews: 118,
    badge: "Hot Rainbow",
    badgeType: "hot",
    image: "/images/af1_low_se_rainbow.jpg",
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Phiên bản Air Force 1 '07 SE đặc biệt với dấu Swoosh chuyển sắc cầu vồng óng ánh nổi bật trên nền da trắng cao cấp, mang đến phong cách trẻ trung và cá tính."
  },
  {
    id: 13,
    name: "Nike Air Force 1 Low 'Pride' BeTrue Rainbow (CV0258-100)",
    brand: "Nike",
    category: "sneaker",
    categoryName: "Sneaker dạo phố",
    price: 3350000,
    originalPrice: 4100000,
    rating: 5.0,
    reviews: 94,
    badge: "Bản BeTrue",
    badgeType: "new",
    image: "/images/af1_low_pride_rainbow.jpg",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    description: "Phiên bản kỷ niệm BeTrue / Pride tôn vinh sự đa dạng và bình đẳng với cờ cầu vồng 10 sắc ở gót, viền chỉ ngũ sắc quanh dấu Swoosh trong suốt óng ánh và đệm Air êm ái."
  },
  {
    id: 14,
    name: "Nike Air Force 1 Shadow 'Rainbow' Pastel Multicolor",
    brand: "Nike",
    category: "sneaker",
    categoryName: "Sneaker dạo phố",
    price: 3190000,
    originalPrice: 3850000,
    rating: 4.9,
    reviews: 152,
    badge: "Bán chạy",
    badgeType: "hot",
    image: "/images/af1_shadow_rainbow.jpg",
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Thiết kế Shadow 2 lớp nhân đôi Swoosh và viền mắt xỏ dây độc đáo, kết hợp dải màu cầu vồng pastel nhẹ nhàng ngọt ngào và đế độn tôn dáng."
  },
  {
    id: 15,
    name: "BotV1 - Sneaker Sport Pro Navy White",
    brand: "Bot Shoes",
    category: "running",
    categoryName: "Chạy bộ",
    price: 590000,
    originalPrice: 750000,
    rating: 5.0,
    reviews: 86,
    badge: "Chỉ từ 590k",
    badgeType: "sale",
    image: "/images/botv1_shoe.jpg",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    description: "Thiết kế độc quyền BotV1 siêu nhẹ, vải dệt Mesh thoáng khí kết hợp đệm khí êm ái, bám đường chống trượt. Ưu đãi độc quyền chỉ từ 590k + freeship toàn quốc."
  },
  {
    id: 16,
    name: "BotV2 - Street Runner Pro Royal Cyan",
    brand: "Bot Shoes",
    category: "sneaker",
    categoryName: "Sneaker dạo phố",
    price: 650000,
    originalPrice: 820000,
    rating: 4.9,
    reviews: 112,
    badge: "Giảm 20%",
    badgeType: "hot",
    image: "/images/botv2_shoe.jpg",
    sizes: [37, 38, 39, 40, 41, 42, 43],
    description: "Phiên bản BotV2 phong cách đường phố năng động, đệm giảm chấn êm ái bảo vệ khớp chân, phối màu xanh Royal Cyan thời thượng."
  },
  {
    id: 17,
    name: "BotV3 - Chunky Urban Edition Wave White",
    brand: "Bot Shoes",
    category: "lifestyle",
    categoryName: "Thời trang",
    price: 690000,
    originalPrice: 880000,
    rating: 5.0,
    reviews: 134,
    badge: "Hack Dáng 4.5cm",
    badgeType: "new",
    image: "/images/botv3_shoe.jpg",
    sizes: [36, 37, 38, 39, 40, 41, 42],
    description: "Siêu phẩm BotV3 thiết kế đế sóng Chunky thời trang tôn dáng tăng chiều cao 4.5cm tự nhiên, da PU chống bám bẩn cao cấp."
  },
  {
    id: 18,
    name: "Nike Air Jordan 1 High OG 'Travis Scott Reverse Mocha' 2026",
    brand: "Nike",
    category: "sneaker",
    categoryName: "Sneaker dạo phố",
    price: 4650000,
    originalPrice: 5500000,
    rating: 5.0,
    reviews: 168,
    badge: "🔥 Sắp Mở Bán",
    badgeType: "preorder",
    image: "/images/af1_low_se_rainbow.jpg",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    description: "Siêu phẩm giới hạn mong chờ nhất năm 2026 với dấu Swoosh ngược trứ danh, chất liệu da Nubuck thượng hạng kết hợp đệm khí Air-Sole êm ái.",
    isPreOrder: true,
    expectedDate: "20/10/2026",
    slotsLeft: 18,
    preOrderDeposit: 0
  },
  {
    id: 19,
    name: "Adidas Yeezy Boost 350 V2 'Carbon Beluga Ultra' 2026",
    brand: "Adidas",
    category: "lifestyle",
    categoryName: "Thời trang",
    price: 4990000,
    originalPrice: 5900000,
    rating: 5.0,
    reviews: 142,
    badge: "⏳ Đặt Trước Giảm 15%",
    badgeType: "preorder",
    image: "/images/botv2_shoe.jpg",
    sizes: [39, 40, 41, 42, 43],
    description: "Phiên bản Yeezy 350 V2 nâng cấp chất liệu dệt Primeknit đa sắc, vệt cam dạ quang nổi bật và đệm Boost toàn phần mang lại độ êm vô đối.",
    isPreOrder: true,
    expectedDate: "28/10/2026",
    slotsLeft: 12,
    preOrderDeposit: 0
  },
  {
    id: 20,
    name: "New Balance 9060 'Sea Salt Moonbeam Vintage'",
    brand: "New Balance",
    category: "running",
    categoryName: "Chạy bộ",
    price: 3550000,
    originalPrice: 4200000,
    rating: 4.9,
    reviews: 98,
    badge: "✨ Bản Giới Hạn",
    badgeType: "preorder",
    image: "/images/botv3_shoe.jpg",
    sizes: [37, 38, 39, 40, 41, 42],
    description: "Kiến trúc đế Chunky lượn sóng đột phá kết hợp đệm ABZORB và SBS, phối màu Sea Salt trang nhã mang lại diện mạo thời thượng đỉnh cao.",
    isPreOrder: true,
    expectedDate: "05/11/2026",
    slotsLeft: 25,
    preOrderDeposit: 0
  },
  {
    id: 21,
    name: "Nike ACG Mountain Fly Low Gore-Tex 'Black Pink'",
    brand: "Nike",
    category: "running",
    categoryName: "Chạy bộ",
    price: 3890000,
    originalPrice: 4500000,
    rating: 5.0,
    reviews: 85,
    badge: "🌧️ Chống Nước Gore-Tex",
    badgeType: "preorder",
    image: "/images/nike_acg_black_pink.jpg",
    sizes: [39, 40, 41, 42, 43, 44],
    description: "Vua giày địa hình và dạo phố với màng chống thấm nước Gore-Tex siêu cấp, đế gai bám dính đa hướng và đệm React nảy êm hoàn hảo.",
    isPreOrder: true,
    expectedDate: "15/11/2026",
    slotsLeft: 15,
    preOrderDeposit: 0
  },
  {
    id: 22,
    name: "Nike Kobe 8 Protro 'Halo Triple White' 2026",
    brand: "Nike",
    category: "sneaker",
    categoryName: "Bóng rổ & Sneaker",
    price: 4850000,
    originalPrice: 5600000,
    rating: 5.0,
    reviews: 112,
    badge: "🔥 Sắp Ra Mắt 2026",
    badgeType: "preorder",
    image: "/images/kobe8_protro_white.jpg",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    description: "Phiên bản tưởng niệm huyền thoại Kobe Bryant với chất liệu Engineered Mesh siêu nhẹ thoáng khí, đệm Lunarlon kết hợp Zoom Air đàn hồi bùng nổ.",
    isPreOrder: true,
    expectedDate: "20/11/2026",
    slotsLeft: 10,
    preOrderDeposit: 0
  },
  {
    id: 23,
    name: "Adidas Predator Elite FT 2026 'Solar Red Fold-over Tongue'",
    brand: "Adidas",
    category: "lifestyle",
    categoryName: "Thời trang & Thể thao",
    price: 5200000,
    originalPrice: 6100000,
    rating: 5.0,
    reviews: 94,
    badge: "⏳ Đặt Trước Giảm 15%",
    badgeType: "preorder",
    image: "/images/predator_elite_red.jpg",
    sizes: [39, 40, 41, 42, 43, 44],
    description: "Đôi giày kinh điển với lưỡi gà gập huyền thoại thập niên 90 tái sinh phiên bản 2026, đệm Strikeskin cao cấp tạo độ xoáy và upper HybridTouch êm ái.",
    isPreOrder: true,
    expectedDate: "25/11/2026",
    slotsLeft: 14,
    preOrderDeposit: 0
  },
  {
    id: 24,
    name: "Puma MB.04 LaMelo Ball 'Iridescent Cosmic Galaxy' 2026",
    brand: "Puma",
    category: "sneaker",
    categoryName: "Sneaker thời trang",
    price: 3450000,
    originalPrice: 4100000,
    rating: 4.9,
    reviews: 78,
    badge: "✨ Độc Quyền 2026",
    badgeType: "preorder",
    image: "/images/lamelo_mb04_galaxy.jpg",
    sizes: [38, 39, 40, 41, 42, 43],
    description: "Thiết kế tương lai với hoa văn thiên hà đa sắc chuyển màu theo góc nhìn, công nghệ đệm Nitro Foam nảy êm vượt trội cho mọi phong cách dạo phố.",
    isPreOrder: true,
    expectedDate: "02/12/2026",
    slotsLeft: 20,
    preOrderDeposit: 0
  },
  {
    id: 25,
    name: "Salomon XT-6 Gore-Tex 'Desert Safari Phantom' 2026",
    brand: "Salomon",
    category: "running",
    categoryName: "Chạy bộ & Dã ngoại",
    price: 4250000,
    originalPrice: 4950000,
    rating: 5.0,
    reviews: 105,
    badge: "🌧️ Chống Nước Gore-Tex",
    badgeType: "preorder",
    image: "/images/salomon_xt6_phantom.jpg",
    sizes: [39, 40, 41, 42, 43, 44],
    description: "Biểu tượng Gorpcore thời thượng toàn cầu với màng chống thấm nước Gore-Tex siêu bền, khung gầm Agile Chassis System vững chãi trên mọi địa hình.",
    isPreOrder: true,
    expectedDate: "10/12/2026",
    slotsLeft: 16,
    preOrderDeposit: 0
  }
];

// Khóa lưu trữ LocalStorage
const PRODUCTS_STORAGE_KEY = 'bluestep_products_catalog';
const CART_STORAGE_KEY = 'bluestep_cart_items';
const COUPON_STORAGE_KEY = 'bluestep_applied_coupon';

// Đọc danh mục sản phẩm từ cache LocalStorage và tự động đồng bộ sản phẩm mới
function getStoredProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    let updated = false;
    DEFAULT_PRODUCTS.forEach(dp => {
      if (!parsed.some(p => p.id === dp.id)) {
        parsed.push(dp);
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
}

let PRODUCTS = getStoredProducts();

// ----------------------------------------------------------------------------
// 2. HÀM TIỆN ÍCH ĐỊNH DẠNG TIỀN TỆ & THÔNG BÁO TOAST
// ----------------------------------------------------------------------------
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Hiển thị thông báo Toast góc dưới (tối ưu không che thanh điều hướng đáy)
function showToast(title, message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container-custom';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `custom-toast ${type === 'success' ? 'toast-success' : (type === 'error' ? 'toast-error' : '')}`;

  const iconClass = type === 'success' 
    ? 'fa-check-circle text-success' 
    : (type === 'error' ? 'fa-exclamation-circle text-danger' : 'fa-info-circle text-primary');

  toast.innerHTML = `
    <i class="fas ${iconClass} fs-4"></i>
    <div class="flex-grow-1">
      <div class="fw-bold" style="font-size: 0.92rem;">${title}</div>
      <div class="text-muted" style="font-size: 0.85rem;">${message}</div>
    </div>
    <button type="button" class="btn-close btn-sm" aria-label="Đóng"></button>
  `;

  const closeBtn = toast.querySelector('.btn-close');
  closeBtn.addEventListener('click', () => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 250);
  });

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ----------------------------------------------------------------------------
// 3. QUẢN LÝ GIỎ HÀNG (SHOPPING CART LOGIC)
// ----------------------------------------------------------------------------
function getCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
  } catch (e) {
    console.error("Lỗi khi lưu giỏ hàng:", e);
  }
}

function getAppliedCoupon() {
  try {
    const data = localStorage.getItem(COUPON_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function saveAppliedCoupon(coupon) {
  if (coupon) {
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
  } else {
    localStorage.removeItem(COUPON_STORAGE_KEY);
  }
}

// Cập nhật huy hiệu số lượng trên cả Header và Bottom Navigation Bar
function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-count-badge, .bottom-nav-badge');
  badges.forEach(badge => {
    badge.textContent = totalCount;
    if (totalCount > 0) {
      badge.style.display = 'flex';
    } else {
      badge.textContent = '0';
    }
  });
}

// Thêm giày vào giỏ hàng với size đã chọn
function addToCart(productId, size, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === Number(productId));
  if (!product) {
    showToast("Lỗi", "Không tìm thấy thông tin sản phẩm!", "error");
    return;
  }

  if (!size) {
    showToast("Chọn kích cỡ", "Vui lòng chọn size giày trước khi thêm vào giỏ!", "error");
    return;
  }

  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === product.id && item.size === Number(size));

  if (existingIndex > -1) {
    cart[existingIndex].quantity += Number(quantity);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size: Number(size),
      quantity: Number(quantity)
    });
  }

  saveCart(cart);
  showToast("Đã thêm vào giỏ!", `${product.name} (Size ${size}) x ${quantity}`, "success");
}

// Cập nhật số lượng sản phẩm trong giỏ
function updateCartItemQuantity(productId, size, newQty) {
  let cart = getCart();
  const index = cart.findIndex(item => item.id === Number(productId) && item.size === Number(size));

  if (index > -1) {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) {
      cart.splice(index, 1);
      showToast("Đã xóa", "Đã xóa sản phẩm khỏi giỏ hàng", "info");
    } else {
      cart[index].quantity = qty;
    }
    saveCart(cart);
    if (typeof renderCartPage === 'function') {
      renderCartPage();
    }
  }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId, size) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === Number(productId) && item.size === Number(size)));
  saveCart(cart);
  showToast("Đã xóa", "Đã xóa sản phẩm khỏi giỏ hàng", "info");
  if (typeof renderCartPage === 'function') {
    renderCartPage();
  }
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
  if (confirm("Bạn có chắc chắn muốn làm trống toàn bộ giỏ hàng?")) {
    saveCart([]);
    saveAppliedCoupon(null);
    showToast("Đã làm trống", "Giỏ hàng hiện không còn sản phẩm nào", "info");
    if (typeof renderCartPage === 'function') {
      renderCartPage();
    }
  }
}

// ----------------------------------------------------------------------------
// 4. HIỂN THỊ DANH SÁCH SẢN PHẨM & BỘ LỌC TÌM KIẾM
// Lưới 2 cột di động thông minh: col-6 col-md-4 col-lg-3
// ----------------------------------------------------------------------------
let currentCategory = 'all';
let currentBrand = 'all';
let currentPriceRange = 'all';
let currentSize = 'all';
let currentSort = 'default';
let currentSearch = '';

function renderProducts(productList) {
  const grid = document.getElementById('products-grid');
  const countBadge = document.getElementById('product-count-badge');
  if (countBadge) {
    countBadge.textContent = productList.length;
  }

  updateActiveFilterTags();

  if (!grid) return;

  if (productList.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-shoe-prints text-muted mb-3" style="font-size: 3rem;"></i>
        <h5 class="fw-bold text-slate-800">Không tìm thấy mẫu giày phù hợp</h5>
        <p class="text-muted">Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm nút bên dưới để đặt lại bộ lọc.</p>
        <button class="btn btn-primary btn-sm mt-2" onclick="resetFilters()">
          <i class="fas fa-rotate-left me-1"></i> Đặt Lại Tất Cả Bộ Lọc
        </button>
      </div>
    `;
    return;
  }

// ========================================================
// HÀM TÍNH TOÁN CHI TIẾT ĐÁNH GIÁ CHO MỖI SẢN PHẨM:
// - Giữ nguyên: số sao trung bình + tổng đánh giá & Đã bán
// - Dưới "Đã bán": hiển thị tổng số bình luận
// - Tiếp theo: thanh % cho từng cấp sao:
//   → 5 sao: X bình luận
//   → 4 sao: NHIỀU NHẤT (đặt cao nhất)
//   → 3 sao: ít
//   → 2 sao: vài bình luận
//   → 1 sao: có thể 0 hoặc rất ít
// - Thanh tiến độ màu vàng nhạt, độ dài theo tỷ lệ
// - Gọn gàng, không làm to thẻ, dễ đọc
// ========================================================
function getProductSoldCount(product) {
  if (product.sold) return product.sold;
  const base = (product.reviews || 80) * 3 + ((product.id * 31) % 65) + 120;
  return base >= 1000 ? (base / 1000).toFixed(1) + 'k' : base;
}

function getProductReviewBreakdown(reviewsCount) {
  const N = Math.max(reviewsCount || 40, 10);
  // 4 sao: NHIỀU NHẤT (đặt cao nhất) - chiếm ~52%
  let count4 = Math.round(N * 0.52);
  // 5 sao: X bình luận - chiếm ~33%
  let count5 = Math.round(N * 0.33);
  // 3 sao: ít - chiếm ~10%
  let count3 = Math.round(N * 0.10);
  // 2 sao: vài bình luận - chiếm ~4%
  let count2 = Math.max(1, Math.round(N * 0.04));
  // 1 sao: có thể 0 hoặc rất ít (0-1%)
  let count1 = N - (count4 + count5 + count3 + count2);
  if (count1 < 0) {
    count3 += count1;
    count1 = 0;
  }
  // Đảm bảo 4 sao luôn cao nhất tuyệt đối
  if (count4 <= count5) {
    const diff = (count5 - count4) + 3;
    count4 += diff;
    count5 -= diff;
  }

  const pct5 = Math.round((count5 / N) * 100);
  const pct4 = Math.round((count4 / N) * 100);
  const pct3 = Math.round((count3 / N) * 100);
  const pct2 = Math.round((count2 / N) * 100);
  const pct1 = Math.round((count1 / N) * 100);

  return [
    { stars: 5, label: '5 sao', count: count5, pct: pct5, isTop: false, desc: `${count5} bình luận` },
    { stars: 4, label: '4 sao', count: count4, pct: pct4, isTop: true, desc: `${count4} bình luận (Nhiều nhất)` },
    { stars: 3, label: '3 sao', count: count3, pct: pct3, isTop: false, desc: `${count3} bình luận` },
    { stars: 2, label: '2 sao', count: count2, pct: pct2, isTop: false, desc: `${count2} bình luận` },
    { stars: 1, label: '1 sao', count: count1, pct: pct1, isTop: false, desc: `${count1} bình luận` }
  ];
}

  // Khung fallback ảnh dự phòng khi mất kết nối mạng
  const fallbackImg = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=75';

  grid.innerHTML = productList.map(product => {
    // Mặc định chọn size đang lọc hoặc size phổ biến của giày
    // Khi chưa chọn size: 2 nút đều khóa biểu tượng 🔒. Nếu người dùng đang lọc size cụ thể thì tự chọn size đó.
    const defaultSize = (currentSize !== 'all' && product.sizes.includes(Number(currentSize)))
      ? Number(currentSize)
      : null;
    const isLocked = !defaultSize;

    // Tạo các nút chọn size to rõ (Touch Target >= 44px)
    const sizeButtons = product.sizes.map(s => `
      <div class="size-chip ${s === defaultSize ? 'active' : ''}" data-product-id="${product.id}" data-size="${s}">
        ${s}
      </div>
    `).join('');

    let badgeHtml = '';
    if (product.badge) {
      const bClass = product.badgeType === 'sale' 
        ? 'badge-sale' 
        : (product.badgeType === 'new' 
            ? 'badge-new' 
            : (product.badgeType === 'preorder' ? 'badge-preorder' : 'badge-hot'));
      badgeHtml = `<span class="${bClass}">${product.badge}</span>`;
    }

    const sizeStatusHtml = isLocked 
      ? `<span class="size-status-text text-danger small"><i class="fas fa-lock me-1"></i>Chưa chọn</span>`
      : `<span class="size-status-text text-primary fw-bold">Size ${defaultSize} ✓</span>`;

    // Tính chi tiết đánh giá & số lượng bán
    const soldCount = getProductSoldCount(product);
    const reviewBreakdown = getProductReviewBreakdown(product.reviews);

    const breakdownHtml = reviewBreakdown.map(item => `
      <div class="star-bar-row ${item.isTop ? 'star-bar-top' : ''}" title="${item.label}: ${item.desc} (${item.pct}%)">
        <span class="star-bar-label">${item.stars}★</span>
        <div class="star-bar-track">
          <div class="star-bar-fill ${item.isTop ? 'fill-top' : ''}" style="width: ${item.pct}%;"></div>
        </div>
        <span class="star-bar-val">${item.count} ${item.isTop ? '<b class="top-badge">Top</b>' : 'bl'}</span>
      </div>
    `).join('');

    const preOrderBadgeBox = product.isPreOrder ? `
      <div class="alert alert-danger py-1 px-2 mb-2 rounded-2 border-0 bg-danger-subtle text-danger small d-flex justify-content-between align-items-center" style="font-size: 0.75rem;">
        <span><i class="fas fa-calendar-alt me-1"></i>Ra mắt: <strong>${product.expectedDate || '2026'}</strong></span>
        <span class="badge bg-danger text-white rounded-pill"><i class="fas fa-fire me-1"></i>Còn ${product.slotsLeft || 15} suất</span>
      </div>
    ` : '';

    const actionButtonsHtml = product.isPreOrder ? `
      <div class="product-actions-group">
        <button type="button" class="btn btn-card-action btn-card-preorder ${isLocked ? 'btn-action-locked' : ''}" 
          id="btn-preorder-${product.id}" 
          ${isLocked ? 'disabled' : ''} 
          onclick="openPreOrderModal(${product.id})" 
          title="${isLocked ? 'Vui lòng chọn size trước' : 'Đặt trước giữ suất ưu tiên'}">
          <i class="fas ${isLocked ? 'fa-lock' : 'fa-calendar-check'}"></i>
          <span class="btn-text">Đặt Trước</span>
        </button>

        <button type="button" class="btn btn-card-action btn-card-add ${isLocked ? 'btn-action-locked' : ''}" 
          id="btn-add-${product.id}" 
          ${isLocked ? 'disabled' : ''} 
          onclick="handleAddFromCard(${product.id})" 
          title="${isLocked ? 'Vui lòng chọn size trước' : 'Thêm vào giỏ hàng (Đặt trước)'}">
          <i class="fas ${isLocked ? 'fa-lock' : 'fa-cart-plus'}"></i>
          <span class="btn-text">+ Giỏ Hàng</span>
        </button>
      </div>
    ` : `
      <div class="product-actions-group">
        <button type="button" class="btn btn-card-action btn-card-add ${isLocked ? 'btn-action-locked' : ''}" 
          id="btn-add-${product.id}" 
          ${isLocked ? 'disabled' : ''} 
          onclick="handleAddFromCard(${product.id})" 
          title="${isLocked ? 'Vui lòng chọn size trước' : 'Thêm vào giỏ hàng'}">
          <i class="fas ${isLocked ? 'fa-lock' : 'fa-shopping-bag'}"></i>
          <span class="btn-text">Thêm Giỏ</span>
        </button>

        <button type="button" class="btn btn-card-action btn-card-buynow ${isLocked ? 'btn-action-locked' : ''}" 
          id="btn-buy-${product.id}" 
          ${isLocked ? 'disabled' : ''} 
          onclick="handleBuyNowFromCard(${product.id})" 
          title="${isLocked ? 'Vui lòng chọn size trước' : 'Mua ngay - chuyển thẳng tới thanh toán'}">
          <i class="fas ${isLocked ? 'fa-lock' : 'fa-bolt'}"></i>
          <span class="btn-text">Mua Ngay</span>
        </button>
      </div>
    `;

    return `
      <div class="col-6 col-md-4 col-lg-3 px-2 mb-3">
        <div class="product-card" id="product-card-${product.id}" data-selected-size="${defaultSize || ''}">
          <div class="product-thumb-container">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              class="product-thumb-img" 
              loading="lazy" 
              decoding="async"
              width="600"
              height="450"
              onerror="this.onerror=null; this.src='${fallbackImg}';"
            />
            <div class="product-badges">
              ${badgeHtml}
            </div>
            <button class="product-quick-view-btn" onclick="openQuickView(${product.id})" title="Xem chi tiết nhanh" aria-label="Xem chi tiết">
              <i class="fas fa-eye"></i>
            </button>
          </div>
          <div class="product-body">
            <div class="product-brand">${product.brand}</div>
            <h3 class="product-title" title="${product.name}">${product.name}</h3>

            <!-- Giữ nguyên: Số sao trung bình + tổng đánh giá & Đã bán -->
            <div class="product-rating-row">
              <div class="product-rating">
                <i class="fas fa-star text-warning"></i>
                <span class="fw-bold">${product.rating}</span>
                <span class="rating-count">(${product.reviews})</span>
              </div>
              <span class="product-sold-label"><i class="fas fa-check-circle text-success me-1"></i>${product.isPreOrder ? 'Sắp mở bán' : 'Đã bán ' + soldCount}</span>
            </div>

            <!-- Chi tiết đánh giá: Dưới Đã bán hiển thị tổng số bình luận + thanh % cho từng cấp sao -->
            <div class="product-review-details-box">
              <div class="review-comments-total">
                <span><i class="far fa-comments text-primary me-1"></i>Tổng số bình luận:</span>
                <strong>${product.reviews}</strong>
              </div>
              <div class="review-star-bars">
                ${breakdownHtml}
              </div>
            </div>

            <div class="product-price-row">
              <span class="price-current">${formatVND(product.price)}</span>
              ${product.originalPrice ? `<span class="price-old">${formatVND(product.originalPrice)}</span>` : ''}
            </div>

            ${preOrderBadgeBox}

            <div class="size-selector-label">
              <span>Size:</span>
              <span class="current-size-label">${sizeStatusHtml}</span>
            </div>
            <div class="size-selector-chips">
              ${sizeButtons}
            </div>

            <!-- Nút thao tác thẻ sản phẩm -->
            ${actionButtonsHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Lắng nghe sự kiện bấm chọn size trên thẻ sản phẩm -> Mở khóa cả 2 nút
  document.querySelectorAll('.size-chip').forEach(chip => {
    chip.addEventListener('click', function(e) {
      e.stopPropagation();
      const pId = this.getAttribute('data-product-id');
      const size = this.getAttribute('data-size');
      const card = document.getElementById(`product-card-${pId}`);
      if (!card) return;

      // Đánh dấu size active
      card.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      card.setAttribute('data-selected-size', size);
      
      const label = card.querySelector('.current-size-label');
      if (label) {
        label.innerHTML = `<span class="size-status-text text-primary fw-bold">Size ${size} <i class="fas fa-check text-success ms-1"></i></span>`;
      }

      // MỞ KHÓA CÁC NÚT KHI ĐÃ CHỌN SIZE
      const btnAdd = card.querySelector('.btn-card-add');
      const btnBuy = card.querySelector('.btn-card-buynow');
      const btnPreorder = card.querySelector('.btn-card-preorder');

      if (btnAdd) {
        btnAdd.removeAttribute('disabled');
        btnAdd.classList.remove('btn-action-locked');
        btnAdd.innerHTML = '<i class="fas fa-shopping-bag"></i> <span class="btn-text">Thêm Giỏ</span>';
        btnAdd.title = `Thêm sản phẩm size ${size} vào giỏ hàng`;
      }

      if (btnBuy) {
        btnBuy.removeAttribute('disabled');
        btnBuy.classList.remove('btn-action-locked');
        btnBuy.innerHTML = '<i class="fas fa-bolt"></i> <span class="btn-text">Mua Ngay</span>';
        btnBuy.title = `Mua ngay size ${size} - Nhảy thẳng đến thanh toán`;
      }

      if (btnPreorder) {
        btnPreorder.removeAttribute('disabled');
        btnPreorder.classList.remove('btn-action-locked');
        btnPreorder.innerHTML = '<i class="fas fa-calendar-check"></i> <span class="btn-text">Đặt Trước</span>';
        btnPreorder.title = `Đặt trước size ${size} - Giữ suất ưu tiên`;
      }
    });
  });
}

// Bấm thêm vào giỏ hàng trực tiếp từ thẻ sản phẩm
function handleAddFromCard(productId) {
  const card = document.getElementById(`product-card-${productId}`);
  if (!card) return;
  const size = card.getAttribute('data-selected-size');
  if (!size) {
    showToast("Vui lòng chọn size", "Hãy bấm chọn kích thước giày trước khi thêm vào giỏ!", "warning");
    return;
  }
  addToCart(productId, size, 1);
}

// Bấm "Mua Ngay" từ thẻ sản phẩm -> nhảy thẳng đến trang thanh toán, bỏ qua giỏ hàng
function handleBuyNowFromCard(productId) {
  const card = document.getElementById(`product-card-${productId}`);
  if (!card) return;
  const size = card.getAttribute('data-selected-size');
  if (!size) {
    showToast("Vui lòng chọn size", "Hãy bấm chọn kích thước giày trước khi nhấn Mua Ngay!", "warning");
    return;
  }
  addToCart(productId, size, 1);
  showToast("Chuyển tới thanh toán", "Đang đưa bạn đến trang thanh toán đơn hàng...", "info");
  setTimeout(() => {
    window.location.href = '/checkout';
  }, 220);
}

// Cập nhật các thẻ tag bộ lọc đang kích hoạt
function updateActiveFilterTags() {
  const container = document.getElementById('active-filter-tags');
  if (!container) return;

  const tags = [];

  if (currentSearch.trim() !== '') {
    tags.push(`<span class="badge bg-primary-subtle text-primary border border-primary-subtle py-1 px-2">Tìm: "${currentSearch}" <i class="fas fa-times ms-1 cursor-pointer" onclick="clearSearchFilter()"></i></span>`);
  }
  if (currentCategory !== 'all') {
    const catLabel = currentCategory === 'preorder' ? 'Sắp Bán (Đặt Trước)' : currentCategory;
    tags.push(`<span class="badge bg-primary-subtle text-primary border border-primary-subtle py-1 px-2">Danh mục: ${catLabel} <i class="fas fa-times ms-1 cursor-pointer" onclick="setCategoryFilter('all')"></i></span>`);
  }
  if (currentBrand !== 'all') {
    tags.push(`<span class="badge bg-primary-subtle text-primary border border-primary-subtle py-1 px-2">Hãng: ${currentBrand} <i class="fas fa-times ms-1 cursor-pointer" onclick="resetBrandFilter()"></i></span>`);
  }
  if (currentPriceRange !== 'all') {
    const pLabel = currentPriceRange === 'under-2m' ? '< 2 triệu' : (currentPriceRange === '2m-3m' ? '2 - 3 triệu' : '> 3 triệu');
    tags.push(`<span class="badge bg-primary-subtle text-primary border border-primary-subtle py-1 px-2">Giá: ${pLabel} <i class="fas fa-times ms-1 cursor-pointer" onclick="resetPriceFilter()"></i></span>`);
  }
  if (currentSize !== 'all') {
    tags.push(`<span class="badge bg-primary-subtle text-primary border border-primary-subtle py-1 px-2">Size: ${currentSize} <i class="fas fa-times ms-1 cursor-pointer" onclick="setSizeFilter('all')"></i></span>`);
  }

  container.innerHTML = tags.join('');
}

function clearSearchFilter() {
  currentSearch = '';
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  const productSearch = document.getElementById('product-search-input');
  if (productSearch) productSearch.value = '';
  filterProducts();
}

function resetBrandFilter() {
  currentBrand = 'all';
  const brandFilter = document.getElementById('brand-filter');
  if (brandFilter) brandFilter.value = 'all';
  filterProducts();
}

function resetPriceFilter() {
  currentPriceRange = 'all';
  const priceFilter = document.getElementById('price-filter');
  if (priceFilter) priceFilter.value = 'all';
  filterProducts();
}

function setSizeFilter(size) {
  currentSize = size;
  document.querySelectorAll('.size-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-size') === size);
  });
  filterProducts();
}

// Lọc sản phẩm theo nhiều tiêu chí kết hợp
function filterProducts() {
  let filtered = [...PRODUCTS];

  // 1. Theo danh mục
  if (currentCategory === 'preorder') {
    filtered = filtered.filter(p => p.isPreOrder);
  } else if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  // 2. Theo thương hiệu
  if (currentBrand !== 'all') {
    filtered = filtered.filter(p => p.brand.toLowerCase() === currentBrand.toLowerCase());
  }

  // 3. Theo khoảng giá
  if (currentPriceRange === 'under-2m') {
    filtered = filtered.filter(p => p.price < 2000000);
  } else if (currentPriceRange === '2m-3m') {
    filtered = filtered.filter(p => p.price >= 2000000 && p.price <= 3000000);
  } else if (currentPriceRange === 'above-3m') {
    filtered = filtered.filter(p => p.price > 3000000);
  }

  // 4. Theo kích cỡ size
  if (currentSize !== 'all') {
    filtered = filtered.filter(p => p.sizes.includes(Number(currentSize)));
  }

  // 5. Theo từ khóa tìm kiếm
  if (currentSearch.trim() !== '') {
    const q = currentSearch.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q)
    );
  }

  // 6. Sắp xếp theo giá / đánh giá
  if (currentSort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (currentSort === 'newest') {
    filtered.sort((a, b) => b.id - a.id);
  }

  renderProducts(filtered);
}

function resetFilters() {
  currentCategory = 'all';
  currentBrand = 'all';
  currentPriceRange = 'all';
  currentSize = 'all';
  currentSort = 'default';
  currentSearch = '';

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  const productSearch = document.getElementById('product-search-input');
  if (productSearch) productSearch.value = '';

  const clearBtn = document.getElementById('clear-search-btn');
  if (clearBtn) clearBtn.classList.add('d-none');

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'default';

  const brandSelect = document.getElementById('brand-filter');
  if (brandSelect) brandSelect.value = 'all';

  const priceSelect = document.getElementById('price-filter');
  if (priceSelect) priceSelect.value = 'all';

  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.classList.toggle('active', pill.getAttribute('data-category') === 'all');
  });

  document.querySelectorAll('.size-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-size') === 'all');
  });

  filterProducts();
}

// ----------------------------------------------------------------------------
// 5. CỬA SỔ XEM NHANH SẢN PHẨM (QUICK VIEW MODAL)
// ----------------------------------------------------------------------------
let quickViewActiveSize = null;

function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === Number(productId));
  if (!product) return;

  const modalEl = document.getElementById('quickViewModal');
  if (!modalEl) return;

  quickViewActiveSize = product.sizes[0];

  const imgEl = document.getElementById('qv-product-img');
  if (imgEl) {
    imgEl.src = product.image;
    imgEl.onerror = () => { imgEl.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=75'; };
  }

  document.getElementById('qv-product-brand').textContent = product.brand;
  document.getElementById('qv-product-title').textContent = product.name;
  document.getElementById('qv-product-rating').textContent = `${product.rating} (${product.reviews} đánh giá)`;
  
  const soldCount = getProductSoldCount(product);
  const qvSoldEl = document.getElementById('qv-product-sold');
  if (qvSoldEl) qvSoldEl.textContent = `Đã bán ${soldCount}`;

  const qvBreakdownEl = document.getElementById('qv-rating-breakdown');
  if (qvBreakdownEl) {
    const breakdown = getProductReviewBreakdown(product.reviews);
    const barsHtml = breakdown.map(item => `
      <div class="star-bar-row ${item.isTop ? 'star-bar-top' : ''}" title="${item.label}: ${item.desc} (${item.pct}%)">
        <span class="star-bar-label">${item.stars}★</span>
        <div class="star-bar-track">
          <div class="star-bar-fill ${item.isTop ? 'fill-top' : ''}" style="width: ${item.pct}%;"></div>
        </div>
        <span class="star-bar-val">${item.count} ${item.isTop ? '<b class="top-badge">Top</b>' : 'bl'}</span>
      </div>
    `).join('');

    qvBreakdownEl.innerHTML = `
      <div class="product-review-details-box">
        <div class="review-comments-total">
          <span><i class="far fa-comments text-primary me-1"></i>Tổng số bình luận:</span>
          <strong>${product.reviews}</strong>
        </div>
        <div class="review-star-bars">
          ${barsHtml}
        </div>
      </div>
    `;
  }

  document.getElementById('qv-product-price').textContent = formatVND(product.price);
  
  const oldPriceEl = document.getElementById('qv-product-old-price');
  if (product.originalPrice) {
    oldPriceEl.textContent = formatVND(product.originalPrice);
    oldPriceEl.style.display = 'inline';
  } else {
    oldPriceEl.style.display = 'none';
  }

  document.getElementById('qv-product-desc').textContent = product.description;

  const sizeChipsContainer = document.getElementById('qv-size-chips');
  sizeChipsContainer.innerHTML = product.sizes.map((s, idx) => `
    <div class="size-chip ${idx === 0 ? 'active' : ''}" onclick="selectQuickViewSize(${s}, this)">${s}</div>
  `).join('');

  document.getElementById('qv-quantity-input').value = 1;

  const addBtn = document.getElementById('qv-btn-add');
  addBtn.onclick = function() {
    const qty = parseInt(document.getElementById('qv-quantity-input').value, 10) || 1;
    addToCart(product.id, quickViewActiveSize, qty);
    const bsModal = bootstrap.Modal.getInstance(modalEl);
    if (bsModal) bsModal.hide();
  };

  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

function selectQuickViewSize(size, el) {
  quickViewActiveSize = size;
  const container = document.getElementById('qv-size-chips');
  container.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ----------------------------------------------------------------------------
// 6. HIỂN THỊ TRANG GIỎ HÀNG (CART PAGE - cart.html)
// Tối ưu nút bấm tăng giảm số lượng (+ / -) to rõ 44px
// ----------------------------------------------------------------------------
function renderCartPage() {
  const cartTableBody = document.getElementById('cart-table-body');
  const emptyCartState = document.getElementById('empty-cart-state');
  const cartContentWrapper = document.getElementById('cart-content-wrapper');

  if (!cartTableBody || !emptyCartState || !cartContentWrapper) return;

  const cart = getCart();

  if (cart.length === 0) {
    emptyCartState.classList.remove('d-none');
    cartContentWrapper.classList.add('d-none');
    return;
  }

  emptyCartState.classList.add('d-none');
  cartContentWrapper.classList.remove('d-none');

  let subtotal = 0;

  cartTableBody.innerHTML = cart.map(item => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img 
              src="${item.image}" 
              alt="${item.name}" 
              class="cart-item-img" 
              loading="lazy"
              decoding="async"
              width="72"
              height="72"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=75';"
            />
            <div>
              <div class="cart-item-title">${item.name}</div>
              <div class="text-muted small">${item.brand}</div>
              <span class="cart-item-size-badge mt-1">Size: ${item.size}</span>
            </div>
          </div>
        </td>
        <td class="text-nowrap fw-semibold">${formatVND(item.price)}</td>
        <td>
          <div class="quantity-stepper">
            <button class="qty-btn" type="button" aria-label="Giảm" onclick="updateCartItemQuantity(${item.id}, ${item.size}, ${item.quantity - 1})">
              <i class="fas fa-minus"></i>
            </button>
            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="99" 
              onchange="updateCartItemQuantity(${item.id}, ${item.size}, this.value)" aria-label="Số lượng" />
            <button class="qty-btn" type="button" aria-label="Tăng" onclick="updateCartItemQuantity(${item.id}, ${item.size}, ${item.quantity + 1})">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </td>
        <td class="text-nowrap fw-bold text-primary">${formatVND(lineTotal)}</td>
        <td class="text-center">
          <button class="btn-remove-item" onclick="removeFromCart(${item.id}, ${item.size})" title="Xóa sản phẩm" aria-label="Xóa">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Miễn phí vận chuyển cho đơn từ 1.000.000₫
  const shippingFee = subtotal >= 1000000 ? 0 : 35000;
  
  // Áp dụng mã giảm giá nếu có
  const coupon = getAppliedCoupon();
  let discountAmount = 0;
  if (coupon) {
    if (coupon.type === 'percent') {
      discountAmount = Math.round(subtotal * (coupon.value / 100));
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.value;
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Cập nhật DOM thanh toán
  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = formatVND(subtotal);
  if (shippingEl) shippingEl.textContent = shippingFee === 0 ? "Miễn phí (Toàn quốc)" : formatVND(shippingFee);
  
  const discountRow = document.getElementById('summary-discount-row');
  const discountAmountEl = document.getElementById('summary-discount-amount');
  if (discountRow && discountAmountEl) {
    if (discountAmount > 0) {
      discountRow.classList.remove('d-none');
      discountAmountEl.textContent = `-${formatVND(discountAmount)}`;
    } else {
      discountRow.classList.add('d-none');
    }
  }

  if (totalEl) totalEl.textContent = formatVND(grandTotal);
}

// Áp dụng mã giảm giá voucher
function applyCouponCode() {
  const input = document.getElementById('coupon-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (!code) {
    showToast("Nhập mã", "Vui lòng nhập mã giảm giá", "error");
    return;
  }

  const VALID_COUPONS = {
    'GIAY76VIPP': { code: 'GIAY76VIPP', type: 'fixed', value: 1000000, minOrder: 5000000, label: 'Giảm 1.000.000đ (Đơn từ 5tr)' },
    'SHOPKIET76': { code: 'SHOPKIET76', type: 'percent', value: 5, minOrder: 0, label: 'Giảm 5% tổng hóa đơn' },
    'CHAOBAN': { code: 'CHAOBAN', type: 'percent', value: 3, minOrder: 0, label: 'Giảm 3% tổng hóa đơn' },
    'SHOPKIET10': { code: 'SHOPKIET10', type: 'percent', value: 10, label: 'Giảm 10%' },
    '3ANHTUAT10': { code: '3ANHTUAT10', type: 'percent', value: 10, label: 'Giảm 10%' },
    'BLUESTEP10': { code: 'BLUESTEP10', type: 'percent', value: 10, label: 'Giảm 10%' },
    'VIP20': { code: 'VIP20', type: 'percent', value: 20, label: 'Giảm 20% khách VIP' }
  };

  if (VALID_COUPONS[code]) {
    const coupon = VALID_COUPONS[code];
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      const msg = coupon.code === 'GIAY76VIPP' 
        ? 'Chưa đủ 5.000.000đ để áp dụng mã này' 
        : `Chưa đủ ${formatVND(coupon.minOrder)} để áp dụng mã này`;
      showToast("Chưa đủ điều kiện ⚠️", msg, "warning");
      return;
    }

    saveAppliedCoupon(coupon);
    showToast("Thành công!", `Đã áp dụng mã ${code}: ${coupon.label}`, "success");
    renderCartPage();
  } else {
    showToast("Không hợp lệ", "Mã giảm giá không tồn tại hoặc đã hết hạn", "error");
  }
}

// ----------------------------------------------------------------------------
// 7. ĐỒNG BỘ VỚI MÁY CHỦ EXPRESS (API FETCH PRODUCTS TỰ ĐỘNG)
// ----------------------------------------------------------------------------
async function fetchServerProducts() {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        PRODUCTS = result.data;
        if (document.getElementById('products-grid')) {
          filterProducts();
        }
      }
    }
  } catch (err) {
    // Chế độ tĩnh hoặc GitHub Pages: tiếp tục hoạt động mượt mà với DEFAULT_PRODUCTS
  }
}

// ----------------------------------------------------------------------------
// 8. KHỞI CHẠY VÀ GẮN SỰ KIỆN KHI TẢI TRANG
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Cập nhật huy hiệu số lượng giỏ hàng
  updateCartBadge();

  // Tải danh sách sản phẩm từ server nếu có
  fetchServerProducts();

  // Khởi tạo trang chủ (index.html)
  if (document.getElementById('products-grid')) {
    renderProducts(PRODUCTS);

    // Bấm chọn danh mục dạng viên nang (Category Pills)
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', function() {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.getAttribute('data-category');
        filterProducts();
      });
    });

    // Dropdown chọn thương hiệu
    const brandFilter = document.getElementById('brand-filter');
    if (brandFilter) {
      brandFilter.addEventListener('change', (e) => {
        currentBrand = e.target.value;
        filterProducts();
      });
    }

    // Dropdown chọn khoảng giá
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
      priceFilter.addEventListener('change', (e) => {
        currentPriceRange = e.target.value;
        filterProducts();
      });
    }

    // Nút lọc kích cỡ
    document.querySelectorAll('.size-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const size = e.currentTarget.getAttribute('data-size');
        setSizeFilter(size);
      });
    });

    // Dropdown sắp xếp
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterProducts();
      });
    }

    // Tìm kiếm trực tiếp trên Header
    const searchInput = document.getElementById('search-input');
    const productSearchInput = document.getElementById('product-search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        if (productSearchInput) productSearchInput.value = currentSearch;
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle('d-none', currentSearch.trim() === '');
        }
        filterProducts();
      });
    }

    if (productSearchInput) {
      productSearchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        if (searchInput) searchInput.value = currentSearch;
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle('d-none', currentSearch.trim() === '');
        }
        filterProducts();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', clearSearchFilter);
    }
  }

  // Khởi tạo trang giỏ hàng (cart.html)
  if (document.getElementById('cart-table-body')) {
    renderCartPage();
  }

  // Nút tăng giảm số lượng trong Modal xem nhanh
  const qvMinus = document.getElementById('qv-qty-minus');
  const qvPlus = document.getElementById('qv-qty-plus');
  const qvInput = document.getElementById('qv-quantity-input');
  if (qvMinus && qvPlus && qvInput) {
    qvMinus.addEventListener('click', () => {
      let val = parseInt(qvInput.value, 10) || 1;
      if (val > 1) qvInput.value = val - 1;
    });
    qvPlus.addEventListener('click', () => {
      let val = parseInt(qvInput.value, 10) || 1;
      if (val < 99) qvInput.value = val + 1;
    });
  }

  // Khởi tạo Trợ lý ảo Gemini
  initGeminiWidget();

  // Khởi tạo Thông báo mua hàng tự nhiên thời gian thực
  initLivePurchaseNotifications();

  // Khởi tạo Bộ đếm ngược thời gian ưu đãi tự động
  initPromoCountdown();
});

// ----------------------------------------------------------------------------
// 15. TRỢ LÝ CHĂM SÓC KHÁCH HÀNG SHOPKIET76
// ----------------------------------------------------------------------------
let geminiChatHistory = [];
let isGeminiLoading = false;

function initGeminiWidget() {
  if (document.getElementById('gemini-chat-widget-root')) return;

  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'gemini-chat-widget-root';
  widgetContainer.innerHTML = `
    <!-- Nút Trigger nổi -->
    <button class="gemini-chat-trigger" id="gemini-trigger-btn" onclick="toggleGeminiChat()" title="Trò chuyện với Trợ lý Shopkiet76">
      <div class="gemini-trigger-icon" style="overflow: hidden; padding: 0; background: #fff; border: 2px solid #2563eb;">
        <img src="/images/shopkiet76_avatar.jpg" alt="Shopkiet76" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" />
        <span class="gemini-trigger-badge"></span>
      </div>
      <div class="gemini-trigger-text">
        <span class="gemini-trigger-title">Trợ lý Shopkiet76</span>
        <span class="gemini-trigger-sub">Hỗ trợ chọn giày 24/7</span>
      </div>
    </button>

    <!-- Khung Chatbox -->
    <div class="gemini-chat-box d-none" id="gemini-chat-container">
      <!-- Header -->
      <div class="gemini-chat-header">
        <div class="d-flex align-items-center gap-2">
          <div class="gemini-msg-avatar bot" style="width: 38px; height: 38px; padding: 0; overflow: hidden; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.2); border: 2px solid rgba(255,255,255,0.85);">
            <img src="/images/shopkiet76_avatar.jpg" alt="Shopkiet76" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
          </div>
          <div>
            <div class="fw-bold text-white small leading-tight d-flex align-items-center gap-1">
              <span>Trợ lý Shopkiet76</span>
              <span class="badge bg-success" style="font-size: 0.65rem; padding: 2px 6px;">Gemini AI</span>
            </div>
            <div class="text-info" style="font-size: 0.72rem;">Hỏi đáp mọi chủ đề 24/7</div>
          </div>
        </div>
        <div class="d-flex align-items-center gap-1">
          <button class="btn btn-sm text-white-50 p-1" title="Làm mới cuộc trò chuyện" onclick="resetGeminiChat()" style="background: transparent; border: none;">
            <i class="fas fa-redo-alt" style="font-size: 0.85rem; color: #cbd5e1;"></i>
          </button>
          <button class="btn btn-sm text-white-50 p-1" title="Đóng cửa sổ" onclick="toggleGeminiChat(false)" style="background: transparent; border: none;">
            <i class="fas fa-times" style="font-size: 1.1rem; color: #cbd5e1;"></i>
          </button>
        </div>
      </div>

      <!-- Chat Body -->
      <div class="gemini-chat-body" id="gemini-chat-messages">
        <div class="gemini-msg bot">
          <div class="gemini-msg-avatar bot"><img src="/images/shopkiet76_avatar.jpg" alt="Shopkiet76" /></div>
          <div class="gemini-msg-bubble">
            Dạ chào bạn! 👋 Em là <strong>Trợ lý Shopkiet76</strong> (được trang bị trí tuệ nhân tạo Gemini AI).<br><br>
            Em có thể trả lời và giải đáp <strong>mọi câu hỏi</strong> của bạn: từ kiến thức tổng quát, khoa học, học tập, mẹo phối đồ thời trang cho đến tư vấn chọn size giày chuẩn, gợi ý sneaker hot (như <strong>Vans Old Skool Navy</strong>) hay tra cứu ưu đãi. Bạn muốn hỏi điều gì ạ? ✨
          </div>
        </div>
      </div>

      <!-- Quick Prompts Gợi ý nhanh -->
      <div class="gemini-quick-prompts">
        <button type="button" class="gemini-prompt-btn" onclick="sendGeminiQuickMessage('Tư vấn cách chọn size giày chuẩn theo cm')">
          👟 Bảng size giày
        </button>
        <button type="button" class="gemini-prompt-btn" onclick="sendGeminiQuickMessage('Gợi ý cho tôi các cách phối đồ cực đẹp với giày sneaker Vans Old Skool Navy')">
          👕 Mẹo phối đồ thời trang
        </button>
        <button type="button" class="gemini-prompt-btn" onclick="sendGeminiQuickMessage('Giày Vans Old Skool Classic Navy Blue giá bao nhiêu và có gì đặc biệt?')">
          🔥 Vans Old Skool Navy
        </button>
        <button type="button" class="gemini-prompt-btn" onclick="sendGeminiQuickMessage('Hôm nay shopkiet76 có mã giảm giá nào không?')">
          🎁 Mã giảm giá
        </button>
        <button type="button" class="gemini-prompt-btn" onclick="sendGeminiQuickMessage('Chính sách giao hàng và đổi size 30 ngày thế nào?')">
          🚚 Đổi trả & Vận chuyển
        </button>
      </div>

      <!-- Footer Input -->
      <div class="gemini-chat-footer">
        <form onsubmit="handleGeminiSubmit(event)" class="m-0">
          <div class="gemini-chat-input-wrapper">
            <input 
              type="text" 
              id="gemini-chat-input" 
              class="gemini-chat-input" 
              placeholder="Hỏi bất kỳ điều gì... (VD: Phối đồ với Vans, 1+1=?, size giày...)" 
              autocomplete="off"
            />
            <button type="submit" class="gemini-chat-send-btn" id="gemini-send-btn" title="Gửi tin nhắn">
              <i class="fas fa-paper-plane" style="font-size: 0.85rem;"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(widgetContainer);
}

function toggleGeminiChat(forceState) {
  initGeminiWidget();
  const container = document.getElementById('gemini-chat-container');
  if (!container) return;

  const isCurrentlyHidden = container.classList.contains('d-none');
  const shouldOpen = typeof forceState === 'boolean' ? forceState : isCurrentlyHidden;

  if (shouldOpen) {
    container.classList.remove('d-none');
    const input = document.getElementById('gemini-chat-input');
    if (input) setTimeout(() => input.focus(), 150);
    scrollGeminiToBottom();
  } else {
    container.classList.add('d-none');
  }
}

function scrollGeminiToBottom() {
  const body = document.getElementById('gemini-chat-messages');
  if (body) {
    body.scrollTop = body.scrollHeight;
  }
}

function formatGeminiText(text) {
  if (!text) return '';
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/^- (.*$)/gim, '<div class="ps-2 mb-1">&bull; $1</div>');
  formatted = formatted.replace(/\n\n/g, '<div class="my-2"></div>').replace(/\n/g, '<br>');

  return formatted;
}

async function sendGeminiMessage(messageText) {
  if (!messageText || isGeminiLoading) return;

  initGeminiWidget();
  const messagesContainer = document.getElementById('gemini-chat-messages');
  const input = document.getElementById('gemini-chat-input');

  const userMsgEl = document.createElement('div');
  userMsgEl.className = 'gemini-msg user';
  userMsgEl.innerHTML = `
    <div class="gemini-msg-avatar user"><i class="fas fa-user"></i></div>
    <div class="gemini-msg-bubble">${formatGeminiText(messageText)}</div>
  `;
  messagesContainer.appendChild(userMsgEl);

  if (input) input.value = '';
  scrollGeminiToBottom();

  isGeminiLoading = true;
  const typingEl = document.createElement('div');
  typingEl.className = 'gemini-msg bot';
  typingEl.id = 'gemini-typing-box';
  typingEl.innerHTML = `
    <div class="gemini-msg-avatar bot"><img src="/images/shopkiet76_avatar.jpg" alt="Shopkiet76" /></div>
    <div class="gemini-msg-bubble bg-light text-muted">
      <div class="gemini-typing-indicator">
        <span class="small me-1">Trợ lý Shopkiet76 đang suy nghĩ</span>
        <span class="gemini-typing-dot"></span>
        <span class="gemini-typing-dot"></span>
        <span class="gemini-typing-dot"></span>
      </div>
    </div>
  `;
  messagesContainer.appendChild(typingEl);
  scrollGeminiToBottom();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: messageText,
        history: geminiChatHistory
      })
    });

    const data = await res.json();
    const reply = data.reply || 'Dạ shopkiet76 luôn sẵn sàng phục vụ bạn!';

    geminiChatHistory.push({ role: 'user', text: messageText });
    geminiChatHistory.push({ role: 'model', text: reply });

    const typingElem = document.getElementById('gemini-typing-box');
    if (typingElem) typingElem.remove();

    const botMsgEl = document.createElement('div');
    botMsgEl.className = 'gemini-msg bot';
    botMsgEl.innerHTML = `
      <div class="gemini-msg-avatar bot"><img src="/images/shopkiet76_avatar.jpg" alt="Shopkiet76" /></div>
      <div class="gemini-msg-bubble">${formatGeminiText(reply)}</div>
    `;
    messagesContainer.appendChild(botMsgEl);
  } catch (err) {
    console.error('Lỗi gọi trợ lý Shopkiet76:', err);
    const typingElem = document.getElementById('gemini-typing-box');
    if (typingElem) typingElem.remove();

    const errorMsgEl = document.createElement('div');
    errorMsgEl.className = 'gemini-msg bot';
    errorMsgEl.innerHTML = `
      <div class="gemini-msg-avatar bot"><img src="/images/shopkiet76_avatar.jpg" alt="Shopkiet76" /></div>
      <div class="gemini-msg-bubble text-danger">
        Dạ kết nối tạm thời bị gián đoạn. Bạn vui lòng thử lại hoặc gọi hotline <strong>1900 8888</strong> để shopkiet76 hỗ trợ ngay nhé!
      </div>
    `;
    messagesContainer.appendChild(errorMsgEl);
  } finally {
    isGeminiLoading = false;
    scrollGeminiToBottom();
  }
}

function handleGeminiSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('gemini-chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (text) {
    sendGeminiMessage(text);
  }
}

function sendGeminiQuickMessage(text) {
  toggleGeminiChat(true);
  sendGeminiMessage(text);
}

function resetGeminiChat() {
  geminiChatHistory = [];
  const messagesContainer = document.getElementById('gemini-chat-messages');
  if (messagesContainer) {
    messagesContainer.innerHTML = `
      <div class="gemini-msg bot">
        <div class="gemini-msg-avatar bot"><img src="/images/shopkiet76_avatar.jpg" alt="Shopkiet76" /></div>
        <div class="gemini-msg-bubble">
          Cuộc trò chuyện đã được làm mới! Em là <strong>Trợ lý Shopkiet76</strong>. Em có thể tư vấn chọn giày, hướng dẫn chọn size hoặc tra cứu đơn hàng giúp bạn ngay lúc này ạ! ✨
        </div>
      </div>
    `;
  }
}

// Gán hàm vào window để gọi từ bất kỳ đâu
window.toggleGeminiChat = toggleGeminiChat;
window.sendGeminiQuickMessage = sendGeminiQuickMessage;
window.resetGeminiChat = resetGeminiChat;
window.handleGeminiSubmit = handleGeminiSubmit;

// ----------------------------------------------------------------------------
// 16. DANH SÁCH 15 THÔNG BÁO MUA HÀNG TỰ NHIÊN (LIVE PURCHASE NOTIFICATIONS)
// Định dạng: Tên · Thành phố · Sản phẩm · Thời gian
// ----------------------------------------------------------------------------
const LIVE_PURCHASE_NOTIFICATIONS = [
  {
    name: "Nguyễn Văn Hưng",
    city: "Hà Nội",
    product: "Vans Old Skool Classic Navy Blue (Size 41)",
    time: "2 phút trước",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=120&q=75"
  },
  {
    name: "Lê Minh Trí",
    city: "Đà Nẵng",
    product: "Nike Air Zoom Pegasus 40 Electric Blue (Size 42)",
    time: "1 phút trước",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=75"
  },
  {
    name: "Đặng Quỳnh Anh",
    city: "Cần Thơ",
    product: "Nike Air Force 1 Low SE Rainbow Swoosh (Size 38)",
    time: "3 phút trước",
    image: "/images/af1_low_se_rainbow.jpg"
  },
  {
    name: "Trần Thu Hà",
    city: "TP. Hồ Chí Minh",
    product: "Nike Air Force 1 Shadow Pastel Multicolor (Size 37)",
    time: "4 phút trước",
    image: "/images/af1_shadow_rainbow.jpg"
  },
  {
    name: "Bùi Mai Linh",
    city: "Nha Trang",
    product: "Converse Chuck Taylor All Star 1970s Hi (Size 38)",
    time: "5 phút trước",
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=120&q=75"
  },
  {
    name: "Đỗ Hải Yến",
    city: "Huế",
    product: "Adidas Samba OG Cloud White / Core Black (Size 38.5)",
    time: "6 phút trước",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=120&q=75"
  },
  {
    name: "Phạm Hoàng Nam",
    city: "Hải Phòng",
    product: "Adidas Ultraboost Light Royal Cyan (Size 40)",
    time: "7 phút trước",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=120&q=75"
  },
  {
    name: "Ngô Thanh Tùng",
    city: "Buôn Ma Thuột",
    product: "Nike Air Force 1 Low 'Pride' BeTrue Rainbow (Size 42)",
    time: "8 phút trước",
    image: "/images/af1_low_pride_rainbow.jpg"
  },
  {
    name: "Vũ Đức Thắng",
    city: "Biên Hòa",
    product: "New Balance 574 Legacy Deep Sea Blue (Size 41)",
    time: "9 phút trước",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=120&q=75"
  },
  {
    name: "Trịnh Ngọc Ánh",
    city: "Bắc Ninh",
    product: "Nike Air Force 1 '07 All White (Size 36.5)",
    time: "10 phút trước",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=120&q=75"
  },
  {
    name: "Hoàng Quốc Bảo",
    city: "Vũng Tàu",
    product: "Nike Air Jordan 1 Low Royal Blue (Size 42.5)",
    time: "11 phút trước",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=120&q=75"
  },
  {
    name: "Lương Tuấn Kiệt",
    city: "Đà Lạt",
    product: "Asics Gel-Kayano 14 Metallic Blue (Size 43)",
    time: "12 phút trước",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=75"
  },
  {
    name: "Phan Gia Huy",
    city: "Quy Nhơn",
    product: "Vans Sk8-Hi Reissue Canvas Navy (Size 40)",
    time: "13 phút trước",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=120&q=75"
  },
  {
    name: "Võ Thùy Trang",
    city: "Hạ Long",
    product: "New Balance 550 White Grey Vintage (Size 39)",
    time: "14 phút trước",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=120&q=75"
  },
  {
    name: "Đinh Văn Quân",
    city: "Vinh",
    product: "Nike Air Zoom Vomero 5 Photon Dust (Size 41)",
    time: "15 phút trước",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=120&q=75"
  }
];

let livePurchaseIndex = 0;
let livePurchaseTimeout = null;

function initLivePurchaseNotifications() {
  if (window.livePurchaseInitialized) return;
  window.livePurchaseInitialized = true;

  let popup = document.getElementById('live-purchase-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'live-purchase-popup';
    popup.className = 'live-purchase-popup';
    document.body.appendChild(popup);
  }

  function showNextNotification() {
    if (!LIVE_PURCHASE_NOTIFICATIONS || LIVE_PURCHASE_NOTIFICATIONS.length === 0) return;
    const item = LIVE_PURCHASE_NOTIFICATIONS[livePurchaseIndex];
    livePurchaseIndex = (livePurchaseIndex + 1) % LIVE_PURCHASE_NOTIFICATIONS.length;

    popup.innerHTML = `
      <img src="${item.image}" alt="${item.product}" class="live-purchase-thumb" onerror="this.onerror=null; this.src='/images/shopkiet76_avatar.jpg';" />
      <div class="live-purchase-info">
        <div class="live-purchase-buyer">
          <span>${item.name}</span>
          <span class="text-muted fw-normal" style="font-size: 0.8rem;">(${item.city})</span>
          <i class="fas fa-check-circle live-purchase-verified" title="Khách hàng đã xác thực mua"></i>
        </div>
        <div class="live-purchase-product" title="${item.product}">
          ${item.product}
        </div>
        <div class="live-purchase-time">
          <i class="fas fa-clock text-muted"></i>
          <span>${item.time}</span>
          <span>&bull;</span>
          <span class="text-success fw-semibold"><i class="fas fa-check me-1"></i>Đã đặt hàng</span>
        </div>
      </div>
      <button type="button" class="live-purchase-close" aria-label="Đóng" onclick="closeLivePurchasePopup()">
        <i class="fas fa-times"></i>
      </button>
    `;

    popup.classList.add('show');

    // Tự động ẩn sau 5.5 giây
    livePurchaseTimeout = setTimeout(() => {
      popup.classList.remove('show');
      // Lên lịch hiển thị thông báo tiếp theo ngẫu nhiên từ 8 đến 15 giây
      const nextDelay = 8000 + Math.floor(Math.random() * 7000);
      livePurchaseTimeout = setTimeout(showNextNotification, nextDelay);
    }, 5500);
  }

  // Khởi động thông báo đầu tiên sau 3.5 giây khi vào trang
  livePurchaseTimeout = setTimeout(showNextNotification, 3500);
}

function closeLivePurchasePopup() {
  const popup = document.getElementById('live-purchase-popup');
  if (popup) {
    popup.classList.remove('show');
  }
}

window.closeLivePurchasePopup = closeLivePurchasePopup;
window.LIVE_PURCHASE_NOTIFICATIONS = LIVE_PURCHASE_NOTIFICATIONS;

// ----------------------------------------------------------------------------
// 17. BỘ ĐẾM NGƯỢC THỜI GIAN ƯU ĐÃI (AUTOMATIC COUNTDOWN TIMER)
// Tiêu đề: THỜI GIAN ƯU ĐÃI CÒN LẠI (Xanh dương nhạt, chữ in hoa)
// 4 ô đen bo góc: Ngày | Giờ | Phút | Giây (Số to màu trắng, chữ đơn vị xám nhạt)
// Đếm ngược mỗi giây, không đứng im
// Ngày kết thúc: 5 tháng 10 năm 2026, 23:59:59
// Khi hết thời gian hiển thị toàn số 00
// ----------------------------------------------------------------------------
function initPromoCountdown() {
  // =========================================================================
  // 👉 CHỖ ĐỔI NGÀY KẾT THÚC ƯU ĐÃI TẠI ĐÂY:
  // Định dạng chuẩn ISO: 'YYYY-MM-DDTHH:mm:ss'
  // Ngày 5 tháng 10 năm 2026, 23:59:59
  // =========================================================================
  const END_DATE_STRING = '2026-10-05T23:59:59';
  const targetDate = new Date(END_DATE_STRING).getTime();

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  // Nếu không có phần tử hiển thị trên trang thì bỏ qua
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Khi hết thời gian hiển thị toàn số 00
    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    // Tính toán ngày, giờ, phút, giây
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Hiển thị 2 chữ số (pad zero)
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  // Chạy ngay lập tức khi khởi tạo để hiển thị số chuẩn xác không giật
  updateTimer();

  // Đếm ngược đều đặn mỗi giây (1000ms), không đứng im
  setInterval(updateTimer, 1000);
}

window.initPromoCountdown = initPromoCountdown;

// ----------------------------------------------------------------------------
// 18. CẶP NÚT ĐIỀU HƯỚNG: ĐĂNG KÝ HỘI VIÊN & ĐĂNG NHẬP QUẢN TRỊ + DROPDOWN MENU
// - Nhấn nút nào -> hiện menu tương ứng ngay bên dưới
// - Nhấn nút khác -> menu cũ đóng, menu mới mở
// - Nhấn ra ngoài -> đóng tất cả menu
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// 12. CẶP 2 NÚT KỀ NHAU: ĐĂNG KÝ HỘI VIÊN & ĐĂNG NHẬP QUẢN TRỊ
// - Nhấn nút nào -> hiện menu tương ứng ngay bên dưới
// - Nhấn nút khác -> menu cũ đóng, menu mới mở
// - Nhấn ra ngoài -> đóng tất cả menu
// - 2 nút cùng màu xanh dương, cùng kích thước, bo góc giống hệt
// - Menu thả xuống: nền trắng, viền xanh, bóng nhẹ, dễ đọc
// ----------------------------------------------------------------------------
function toggleShopkietAuthMenu(type, btnEl, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const group = (btnEl && typeof btnEl.closest === 'function')
    ? btnEl.closest('.shopkiet-auth-btn-group')
    : document.querySelector('.shopkiet-auth-btn-group');

  if (!group) return;

  const memberMenu = group.querySelector('.shopkiet-auth-dropdown.dropdown-member');
  const adminMenu = group.querySelector('.shopkiet-auth-dropdown.dropdown-admin');
  const memberBtn = group.querySelector('.btn-auth-member');
  const adminBtn = group.querySelector('.btn-auth-admin');

  // Đóng các nhóm dropdown khác
  document.querySelectorAll('.shopkiet-auth-btn-group').forEach(otherGroup => {
    if (otherGroup !== group) {
      otherGroup.querySelectorAll('.shopkiet-auth-dropdown').forEach(d => d.classList.remove('show'));
      otherGroup.querySelectorAll('.btn-shopkiet-auth').forEach(b => b.classList.remove('active'));
    }
  });

  if (type === 'member') {
    const isMemberOpen = memberMenu && memberMenu.classList.contains('show');
    if (adminMenu) adminMenu.classList.remove('show');
    if (adminBtn) adminBtn.classList.remove('active');

    if (isMemberOpen) {
      memberMenu.classList.remove('show');
      if (memberBtn) memberBtn.classList.remove('active');
    } else if (memberMenu) {
      memberMenu.classList.add('show');
      if (memberBtn) memberBtn.classList.add('active');
    }
  } else if (type === 'admin') {
    const isAdminOpen = adminMenu && adminMenu.classList.contains('show');
    if (memberMenu) memberMenu.classList.remove('show');
    if (memberBtn) memberBtn.classList.remove('active');

    if (isAdminOpen) {
      adminMenu.classList.remove('show');
      if (adminBtn) adminBtn.classList.remove('active');
    } else if (adminMenu) {
      adminMenu.classList.add('show');
      if (adminBtn) adminBtn.classList.add('active');
      const userInp = adminMenu.querySelector('.quick-admin-user');
      if (userInp) setTimeout(() => userInp.focus(), 120);
    }
  }
}

function closeAllShopkietAuthMenus() {
  document.querySelectorAll('.shopkiet-auth-dropdown').forEach(d => d.classList.remove('show'));
  document.querySelectorAll('.btn-shopkiet-auth').forEach(b => b.classList.remove('active'));
}

// Nhấn ra ngoài -> đóng tất cả menu
document.addEventListener('click', (e) => {
  if (!e.target.closest('.shopkiet-auth-btn-group') && !e.target.closest('.shopkiet-auth-dropdown')) {
    closeAllShopkietAuthMenus();
  }
});

// Nhấn Escape -> đóng tất cả menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllShopkietAuthMenus();
  }
});

function togglePassView(el) {
  const form = el.closest('form');
  if (!form) return;
  const passInput = form.querySelector('.quick-admin-pass');
  if (passInput) {
    if (passInput.type === 'password') {
      passInput.type = 'text';
      el.innerHTML = '<i class="fas fa-eye-slash"></i> Ẩn';
    } else {
      passInput.type = 'password';
      el.innerHTML = '<i class="fas fa-eye"></i> Hiện';
    }
  }
}

// Xử lý đăng nhập quản trị nhanh
function handleQuickAdminLogin(event, form) {
  event.preventDefault();
  const f = form || event.target;
  const user = f.querySelector('.quick-admin-user')?.value.trim() || document.getElementById('admin-quick-user')?.value.trim();
  const pass = f.querySelector('.quick-admin-pass')?.value.trim() || document.getElementById('admin-quick-pass')?.value.trim();

  if (!user || !pass) {
    showToast("Vui lòng điền", "Nhập tài khoản và mật khẩu!", "error");
    return;
  }

  showToast("Đăng nhập thành công!", "Đang chuyển hướng tới trang Quản Trị...", "success");
  sessionStorage.setItem('bluestep_admin_auth', 'true');
  sessionStorage.setItem('shopkiet76_admin_auth', 'true');
  sessionStorage.setItem('shopkiet_admin_logged', 'true');
  setTimeout(() => {
    window.location.href = '/admin';
  }, 450);
}

// Gán hàm vào window để gọi từ onclick HTML
window.toggleShopkietAuthMenu = toggleShopkietAuthMenu;
window.closeAllShopkietAuthMenus = closeAllShopkietAuthMenus;
window.toggleAuthDropdown = toggleShopkietAuthMenu;
window.closeAllAuthDropdowns = closeAllShopkietAuthMenus;
window.handleQuickAdminLogin = handleQuickAdminLogin;
window.togglePassView = togglePassView;
window.handleBuyNowFromCard = handleBuyNowFromCard;
window.handleAddFromCard = handleAddFromCard;

// ----------------------------------------------------------------------------
// 19. NÚT "🎁 ƯU ĐÃI" & MODAL QUẢNG CÁO MÃ GIẢM GIÁ GIAY76VIPP
// ----------------------------------------------------------------------------
function openPromoModal(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const modal = document.getElementById('shopkietPromoModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closePromoModal(event) {
  if (event) event.stopPropagation();
  const modal = document.getElementById('shopkietPromoModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

function handlePromoModalBackdropClick(event) {
  if (event && event.target === document.getElementById('shopkietPromoModal')) {
    closePromoModal(event);
  }
}

// Bấm Escape để đóng modal quảng cáo
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePromoModal(e);
  }
});

function copyVoucherCode(event) {
  if (event) event.stopPropagation();
  const code = "GIAY76VIPP";
  const btn = document.getElementById("copyVoucherBtn");

  function onSuccess() {
    if (btn) {
      btn.innerHTML = '<i class="fas fa-check"></i> <span>Đã sao chép ✅</span>';
      btn.classList.add("copied");
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-copy"></i> <span id="copyBtnLabel">Sao chép mã</span>';
        btn.classList.remove("copied");
      }, 2000);
    }
    if (typeof showToast === 'function') {
      showToast("Đã sao chép mã GIAY76VIPP!", "Mã giảm 1.000.000đ cho đơn từ 5.000.000đ đã lưu vào bộ nhớ tạm.", "success");
    }
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(onSuccess).catch(() => {
      fallbackCopyText(code, onSuccess);
    });
  } else {
    fallbackCopyText(code, onSuccess);
  }
}

function fallbackCopyText(text, cb) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    if (cb) cb();
  } catch (err) {
    console.error('Không thể sao chép mã', err);
  }
  document.body.removeChild(textArea);
}

window.openPromoModal = openPromoModal;
window.closePromoModal = closePromoModal;
window.handlePromoModalBackdropClick = handlePromoModalBackdropClick;
window.copyVoucherCode = copyVoucherCode;

// ========================================================
// LOGIC ĐẶT TRƯỚC SIÊU PHẨM GIÀY SẮP MỞ BÁN (PRE-ORDER)
// ========================================================
let preOrderCountdownInterval = null;

function openPreOrderModal(productId) {
  const product = PRODUCTS.find(p => p.id === Number(productId));
  if (!product) return;

  const card = document.getElementById(`product-card-${productId}`);
  let selectedSize = card ? card.getAttribute('data-selected-size') : null;
  if (!selectedSize && product.sizes && product.sizes.length > 0) {
    selectedSize = product.sizes[0];
  }

  // Set modal elements
  const imgEl = document.getElementById('preorder-modal-img');
  const nameEl = document.getElementById('preorder-modal-name');
  const brandEl = document.getElementById('preorder-modal-brand');
  const slotsEl = document.getElementById('preorder-modal-slots');
  const priceEl = document.getElementById('preorder-modal-price');
  const origPriceEl = document.getElementById('preorder-modal-orig-price');
  const dateEl = document.getElementById('preorder-modal-date');
  const idInput = document.getElementById('preorder-product-id');
  const sizeInput = document.getElementById('preorder-selected-size');
  const sizeContainer = document.getElementById('preorder-size-selector');

  if (imgEl) imgEl.src = product.image;
  if (nameEl) nameEl.textContent = product.name;
  if (brandEl) brandEl.textContent = product.brand;
  if (slotsEl) slotsEl.innerHTML = `<i class="fas fa-fire me-1"></i>Chỉ còn ${product.slotsLeft || 12} suất`;
  if (priceEl) priceEl.textContent = formatVND(product.price);
  if (origPriceEl) {
    origPriceEl.textContent = product.originalPrice ? formatVND(product.originalPrice) : '';
  }
  if (dateEl) dateEl.textContent = product.expectedDate || '20/10/2026';
  if (idInput) idInput.value = product.id;
  if (sizeInput) sizeInput.value = selectedSize || '';

  // Render sizes
  if (sizeContainer) {
    sizeContainer.innerHTML = product.sizes.map(s => `
      <button type="button" class="btn btn-sm ${s == selectedSize ? 'btn-danger' : 'btn-outline-secondary'} fw-bold px-3 py-1 preorder-size-btn" onclick="selectPreOrderSize(${s})">
        ${s}
      </button>
    `).join('');
  }

  // Prefill user data if logged in
  try {
    const member = JSON.parse(localStorage.getItem('shopkiet76_current_member') || 'null');
    if (member) {
      if (document.getElementById('preorder-name')) document.getElementById('preorder-name').value = member.fullName || '';
      if (document.getElementById('preorder-phone')) document.getElementById('preorder-phone').value = member.phone || '';
      if (document.getElementById('preorder-email')) document.getElementById('preorder-email').value = member.email || '';
      if (document.getElementById('preorder-address')) document.getElementById('preorder-address').value = member.address || '';
    }
  } catch(e) {}

  // Start live countdown
  startPreOrderCountdown(product.expectedDate);

  // Show modal
  const modalEl = document.getElementById('preOrderModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
}

function selectPreOrderSize(size) {
  const sizeInput = document.getElementById('preorder-selected-size');
  if (sizeInput) sizeInput.value = size;
  document.querySelectorAll('.preorder-size-btn').forEach(btn => {
    if (btn.textContent.trim() == size) {
      btn.className = 'btn btn-sm btn-danger fw-bold px-3 py-1 preorder-size-btn';
    } else {
      btn.className = 'btn btn-sm btn-outline-secondary fw-bold px-3 py-1 preorder-size-btn';
    }
  });
}

function startPreOrderCountdown(dateStr) {
  if (preOrderCountdownInterval) clearInterval(preOrderCountdownInterval);

  let targetDate = new Date('2026-10-25T00:00:00');
  if (dateStr) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      targetDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
    }
  }

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;
    if (diff <= 0) {
      const cdEl = document.getElementById('preorder-countdown-timer');
      if (cdEl) cdEl.innerHTML = '<span class="text-success fw-bold fs-5">SẮP ĐẾN NGÀY GIAO HÀNG!</span>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const sEl = document.getElementById('cd-secs');

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(mins).padStart(2, '0');
    if (sEl) sEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  preOrderCountdownInterval = setInterval(update, 1000);
}

async function handlePreOrderSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('btn-submit-preorder');
  const productId = document.getElementById('preorder-product-id').value;
  const size = document.getElementById('preorder-selected-size').value;
  const fullName = document.getElementById('preorder-name').value.trim();
  const phone = document.getElementById('preorder-phone').value.trim();
  const email = document.getElementById('preorder-email').value.trim();
  const address = document.getElementById('preorder-address').value.trim();
  const depositOption = document.querySelector('input[name="preorder-deposit"]:checked')?.value || 'zero_deposit';
  const note = document.getElementById('preorder-note').value.trim();

  if (!size) {
    showToast('Chưa chọn size', 'Vui lòng chọn kích thước giày trước khi đặt trước!', 'warning');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Đang xử lý đăng ký đặt trước...';
  }

  try {
    const res = await fetch('/api/preorders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        size,
        fullName,
        phone,
        email,
        address,
        depositOption,
        note
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      // Ẩn modal đặt trước
      const modalEl = document.getElementById('preOrderModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }

      // Giảm slots trên card
      const product = PRODUCTS.find(p => p.id === Number(productId));
      if (product && product.slotsLeft > 0) {
        product.slotsLeft -= 1;
        renderProducts(PRODUCTS);
      }

      showToast(
        'Đặt trước thành công! 🎉',
        `Mã giữ suất #${data.data.id} cho giày size ${size}. Shopkiet76 sẽ liên hệ trước ngày ra mắt!`,
        'success'
      );
    } else {
      showToast('Thông báo', data.message || 'Có lỗi xảy ra, vui lòng thử lại sau!', 'error');
    }
  } catch (err) {
    console.error('Lỗi đặt trước:', err);
    showToast('Lỗi kết nối', 'Không thể kết nối máy chủ đặt trước, vui lòng thử lại!', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-check-circle fs-5 me-2"></i><span>XÁC NHẬN ĐẶT TRƯỚC (GIỮ SUẤT ƯU TIÊN)</span>';
    }
  }
}

window.openPreOrderModal = openPreOrderModal;
window.selectPreOrderSize = selectPreOrderSize;
window.handlePreOrderSubmit = handlePreOrderSubmit;




