let cart = [];
let currentCategory = 'all'; // الفئة الحالية الافتراضية

// =================================================================
// 1. دالة ذكية لتحديد قسم كل صنف بناءً على الكلمات المفتاحية في اسمه
// =================================================================
function getProductCategory(name) {
    const n = name.toLowerCase();
    if (n.includes('لبن') || n.includes('زبادي') || n.includes('رايب')) return 'dairy';
    if (n.includes('جبن') || n.includes('شيدر') || n.includes('رومي') || n.includes('فيتا') || n.includes('إسطنبولي') || n.includes('دومتي') || n.includes('عبور لاند') || n.includes('قتيلو') || n.includes('قشطة') || n.includes('زبدة') || n.includes('موتزاريلا') || n.includes('كيري') || n.includes('سلامي') || n.includes('لانشون') || n.includes('بسطرمة') || n.includes('روستو')) return 'cheese';
    if (n.includes('عصير') || n.includes('بيور') || n.includes('كافيه') || n.includes('نسكافيه') || n.includes('كابوتشينو') || n.includes('صافي')) return 'drinks';
    if (n.includes('فينو') || n.includes('توست') || n.includes('كايزر') || n.includes('بقسماط') || n.includes('باتون') || n.includes('مخبوزات') || n.includes('خبز')) return 'bakery';
    if (n.includes('أرز بلبن') || n.includes('مهلبية') || n.includes('كاسترد') || n.includes('إكلير') || n.includes('قشطوطة') || n.includes('جيلي') || n.includes('بودينج') || n.includes('كراميل') || n.includes('مولتن') || n.includes('كيك') || n.includes('تري ليتشي') || n.includes('فادج') || n.includes('ويفر') || n.includes('بسكويت') || n.includes('طاجن نوتيلا')) return 'sweets';
    if (n.includes('عسل') || n.includes('طحينة') || n.includes('حلاوة')) return 'honey';
    if (n.includes('تمر') || n.includes('رطب') || n.includes('عجوة') || n.includes('معمول')) return 'dates';
    return 'grocery';
}

// =================================================================
// 2. دالة عرض المنتجات ديناميكياً حسب اختيار العميل
// =================================================================
function renderProducts(productsList = products, isSearchMode = false) {
    const grid = document.getElementById('products-grid');
    const sectionTitle = document.getElementById('main-section-title');
    const banners = document.getElementById('home-banners');
    if (!grid) return;

    // ضبط شكل الجريد لشبكة كروت متناسقة
    grid.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";

    // أ) في حالة البحث الصريح للزبون
    if (isSearchMode) {
        grid.innerHTML = productsList.map(prod => createProductCard(prod)).join('');
        return;
    }

    // ب) في حالة "الأكثر مبيعاً" (العرض الافتراضي للموقع) -> نظهر البانرات
    if (currentCategory === 'all') {
        if (sectionTitle) sectionTitle.innerText = '🔥 المنتجات الأكثر مبيعاً اليوم';
        if (banners) banners.classList.remove('hidden'); // إظهار البانرات في الأكثر مبيعاً
        
        // عرض أول 12 صنف كعينة للأكثر مبيعاً
        const topSellers = productsList.slice(0, 12);
        grid.innerHTML = topSellers.map(prod => createProductCard(prod)).join('');
        return;
    }

    // ج) في حالة الضغط على أي قسم آخر -> إخفاء كل البانرات فوراً لتصفية الشاشة للمنتجات وبس
    if (banners) banners.classList.add('hidden'); 
    
    const filtered = productsList.filter(prod => getProductCategory(prod.name) === currentCategory);
    grid.innerHTML = filtered.map(prod => createProductCard(prod)).join('');
}

// دالة تصفية المنتجات عند الضغط على أزرار الأقسام من فوق
function filterByCategory(categoryKey) {
    currentCategory = categoryKey;
    
    // إخفاء زرار العودة للمنيو القديم طالما بنتنقل بالأقسام المباشرة
    const backBtn = document.getElementById('back-to-home-btn');
    if (backBtn) backBtn.classList.add('hidden');

    // تحديث عناوين الأقسام ديناميكياً
    const sectionTitle = document.getElementById('main-section-title');
    const buttonText = document.getElementById(`cat-${categoryKey}`).innerText;
    if (sectionTitle) sectionTitle.innerText = `📌 قسم: ${buttonText}`;

    // تغيير ألوان الزراير لتوضيح القسم المفتوح حالياً
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-mousa-blue', 'text-white', 'shadow-sm');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    const activeBtn = document.getElementById(`cat-${categoryKey}`);
    activeBtn.classList.remove('bg-gray-100', 'text-gray-700');
    activeBtn.classList.add('bg-mousa-blue', 'text-white', 'shadow-sm');

    renderProducts(products, false);
}

// =================================================================
// 🌟 الدالة السحرية المعدّلة مؤقتاً بالـ ID ومقاس الصورة الكاملة
// =================================================================
function createProductCard(prod) {
    return `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition">
            <!-- تم التعديل إلى object-contain مع إضافة خلفية بيضاء وبادينج لمنع قص العلب والمنتجات الطولية -->
            <div class="h-48 w-full bg-white rounded-xl mb-4 p-2 flex items-center justify-center overflow-hidden">
                <img src="${prod.image}" onerror="this.onerror=null; this.src='logo.png';" alt="${prod.name}" class="h-full w-full object-contain">
            </div>
            
            <!-- إظهار الـ ID باللون الأحمر مؤقتاً لسهولة المتابعة أثناء رفع الصور -->
            <h3 class="font-bold text-sm text-gray-800 mb-2 h-10 overflow-hidden line-clamp-2 product-title-rtl">
                <span class="text-red-500 font-extrabold dir-ltr">[ID: ${prod.id}]</span> ${prod.name}
            </h3>
            
            <span class="text-mousa-blue font-extrabold text-lg mb-4 block price-rtl">${prod.price} ج.م</span>
            <button onclick="addToCart(${prod.id})" class="w-full bg-mousa-blue text-white py-2 rounded-xl font-medium hover:opacity-90 transition cursor-pointer text-sm">
                أضف إلى السلة
            </button>
        </div>
    `;
}

// =================================================================
// 3. إدارة عمليات السلة والعدادات
// =================================================================
function addToCart(id) {
    const prod = products.find(p => p.id === id);
    const itemInCart = cart.find(item => item.id === id);
    if (itemInCart) { itemInCart.quantity++; } else { cart.push({ ...prod, quantity: 1 }); }
    updateCartCount();
    renderCartItems();
}

// تحديث عداد السلة العلوي
function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    const countMobileEl = document.getElementById('cart-count-mobile');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    [countEl, countMobileEl].forEach(el => {
        if (el) {
            if (totalItems > 0) {
                el.innerText = totalItems;
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) { renderCartItems(); }
}

function renderCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="text-gray-400 text-center py-8">السلة فارغة تماماً، املأ تلاجتك! 🧀</p>`;
        totalContainer.innerText = `0 ج.م`;
        return;
    }
    let total = 0;
    cartContainer.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="flex justify-between items-center border-b pb-2">
                <div class="text-right">
                    <h4 class="font-bold text-gray-800 text-sm product-title-rtl">${item.name}</h4>
                    <span class="text-xs text-gray-500 price-rtl">${item.price} ج.م × ${item.quantity}</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="changeQuantity(${item.id}, -1)" class="bg-gray-100 px-2 py-1 rounded text-xs font-bold cursor-pointer">-</button>
                    <span class="font-medium text-sm">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" class="bg-gray-100 px-2 py-1 rounded text-xs font-bold cursor-pointer">+</button>
                </div>
            </div>
        `;
    }).join('');
    totalContainer.innerText = `${total} ج.م`;
}

function changeQuantity(id, change) {
    const item = cart.find(p => p.id === id);
    if (item) { item.quantity += change; if (item.quantity <= 0) { cart = cart.filter(p => p.id !== id); } }
    updateCartCount();
    renderCartItems();
}

// =================================================================
// 4. فحص البيانات الذكي والإرسال المباشر لبوت التليجرام
// =================================================================
function sendToWhatsApp() {
    if (cart.length === 0) return alert('السلة فارغة، يرجى إضافة منتجات أولاً!');
    
    const nameInput = document.getElementById('client-name');
    const phoneInput = document.getElementById('client-phone');
    const addressInput = document.getElementById('client-address');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    
    const phoneRegex = /^[0-9]{11}$/;
    let hasError = false;

    if (!phoneRegex.test(phone)) {
        phoneInput.classList.add('border-red-500', 'focus:border-red-500', 'bg-red-50'); 
        phoneInput.classList.remove('border-gray-200', 'focus:border-mousa-blue');
        hasError = true;
    } else {
        phoneInput.classList.remove('border-red-500', 'focus:border-red-500', 'bg-red-50');
        phoneInput.classList.add('border-gray-200', 'focus:border-mousa-blue');
    }

    if (!name) { nameInput.classList.add('border-red-500'); hasError = true; } else { nameInput.classList.remove('border-red-500'); }
    if (!address) { addressInput.classList.add('border-red-500'); hasError = true; } else { addressInput.classList.remove('border-red-500'); }

    if (hasError) return; 
    
    let text = `🚨 *طلب دليفري جديد - ألبان موسى* 🚨\n\n`;
    text += `👤 *بيانات العميل:*\n`;
    text += `• *الاسم:* ${name}\n`;
    text += `• *الموبايل:* ${phone}\n`;
    text += `• *العنوان:* ${address}\n\n`;
    
    text += `🛒 *المنتجات المطلوبة:*\n`;
    let total = 0;
    cart.forEach(item => {
        text += `• ${item.name} [العدد: ${item.quantity}] -> ${item.price * item.quantity} ج.م\n`;
        total += item.price * item.quantity;
    });
    text += `\n💰 *الحساب الإجمالي:* ${total} ج.م`;

    const telegramToken = "8838199901:AAG7-ZnfgbDPOWPUgqULmyulqTokic2UqQc";
    const chatId = "6324811496";
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('main-content').classList.add('hidden');
            document.getElementById('cart-modal').classList.add('hidden');
            document.getElementById('success-page').classList.remove('hidden');
            cart = [];
            updateCartCount();
        } else {
            alert('عذراً، حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء الاتصال بالسيستم، يرجى التأكد من الإنترنت.');
    });
}

// =================================================================
// 5. محرك البحث الذكي (يخفي البانرات أيضاً)
// =================================================================
function triggerSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const searchTerm = searchInput.value.trim().toLowerCase();
    if (!searchTerm) return resetToHome();

    const grid = document.getElementById('products-grid');
    const banners = document.getElementById('home-banners');
    const sectionTitle = document.getElementById('main-section-title');
    const backBtn = document.getElementById('back-to-home-btn');

    const filteredProducts = products.filter(prod => 
        prod.name.toLowerCase().includes(searchTerm)
    );

    if (banners) banners.classList.add('hidden');
    if (backBtn) backBtn.classList.remove('hidden');
    if (sectionTitle) sectionTitle.innerHTML = `🔍 نتائج البحث عن: <span class="text-mousa-blue">"${searchInput.value}"</span> (${filteredProducts.length} منتج)`;

    if (filteredProducts.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-gray-400 py-16 text-lg">للأسف مفيش أي منتج بالاسم ده حالياً.. جرب تبحث عن حاجة تانية يا فنان! 🧀</p>`;
        return;
    }

    renderProducts(filteredProducts, true);
}

function resetToHome() {
    currentCategory = 'all';
    const searchInput = document.getElementById('search-input');
    const banners = document.getElementById('home-banners');
    const backBtn = document.getElementById('back-to-home-btn');

    if (searchInput) searchInput.value = '';
    if (banners) banners.classList.remove('hidden');
    if (backBtn) backBtn.classList.add('hidden');

    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-mousa-blue', 'text-white', 'shadow-sm');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    document.getElementById('cat-all').classList.add('bg-mousa-blue', 'text-white', 'shadow-sm');

    renderProducts(products, false);
}

// =================================================================
// 6. حاقن الـ CSS البرميجي لإصلاح التنسيقات واتجاه الـ ID تلقائياً
// =================================================================
const style = document.createElement('style');
style.innerHTML = `
    .product-title-rtl {
        direction: rtl !important;
        unicode-bidi: bidi-override !important;
        text-align: right !important;
    }
    .price-rtl {
        direction: rtl !important;
        unicode-bidi: normal !important;
        display: inline-block !important;
    }
    .dir-ltr {
        direction: ltr !important;
        display: inline-block !important;
        margin-left: 6px;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products, false);

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                triggerSearch();
            }
        });
    }
});