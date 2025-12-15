// ========== إعداد Firebase ==========
const firebaseConfig = {
    apiKey: "AIzaSyB4EXvWZUv7WvECvBC5vZP4gztXUkG9H_k",
    authDomain: "hotel-app-dce62.firebaseapp.com",
    databaseURL: "https://hotel-app-dce62-default-rtdb.firebaseio.com",
    projectId: "hotel-app-dce62",
    storageBucket: "hotel-app-dce62.firebasestorage.app",
    messagingSenderId: "645954463712",
    appId: "1:645954463712:web:acd0d977c7d85bbdd4ed85"
};

let database = null;
try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log('✅ Firebase متصل');
} catch (error) {
    console.warn('⚠️ Firebase غير متصل');
}

// ========== مولد البيانات الديناميكي - 50 فندق لكل مدينة (750 فندق) ==========
const CITIES = ['الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الطائف', 'تبوك', 'بريدة', 'خميس مشيط', 'أبها', 'نجران', 'جيزان', 'حائل', 'الخبر', 'الجبيل'];
const CITY_CODES = {'الرياض':'011','جدة':'012','مكة':'012','المدينة':'014','الدمام':'013','الطائف':'012','تبوك':'014','بريدة':'016','خميس مشيط':'017','أبها':'017','نجران':'017','جيزان':'017','حائل':'016','الخبر':'013','الجبيل':'013'};

const HOTEL_NAMES = [
    'فندق الريتز','فندق الهيلتون','فندق الماريوت','فندق الشيراتون','فندق راديسون بلو','فندق كراون بلازا','فندق نوفوتيل','فندق موفنبيك','فندق إنتركونتيننتال','فندق فور سيزونز',
    'فندق الفيصلية','فندق الذهبي','فندق الماسي','فندق السلطاني','فندق الملكي','فندق النخيل','فندق المرجان','فندق اللؤلؤ','فندق الياقوت','فندق الزمرد',
    'فندق العقيق','فندق المها','فندق الغزال','فندق الصقر','فندق النسر','فندق الأفق','فندق السماء','فندق النجوم','فندق القمر','فندق الشمس',
    'نزل السلام','نزل الأمان','نزل الراحة','نزل الهدوء','نزل السكينة','قصر الضيافة','قصر الأمراء','قصر الملوك','قصر السلاطين','قصر العظماء',
    'برج الأعمال','برج المدينة','برج التجارة','برج الإدارة','برج النجاح','فندق ستار','فندق بلازا','فندق سيتي','فندق غراند','فندق رويال'
];

const NEIGHBORHOODS = [
    'حي المروج','حي النخيل','حي الورود','حي الريحان','حي الياسمين','حي الربيع','حي الخريف','حي النسيم','حي السلام','حي الأمل',
    'حي النور','حي الهدى','حي الفيحاء','حي الزهراء','حي الرياض','حي العليا','حي الملز','حي السليمانية','حي المعذر','حي الروضة',
    'حي الشفا','حي الصفا','حي المروة','حي النسيم','حي الربوة','حي الخالدية','حي العزيزية','حي النزهة','حي الفيصلية','حي الملك فهد',
    'حي الملك عبدالله','حي الملك عبدالعزيز','حي الأمير سلطان','حي الأمير محمد','حي الأمير فيصل','حي الحمراء','حي الأندلس','حي قرطبة','حي غرناطة','حي إشبيلية',
    'حي المنار','حي الفجر','حي الشروق','حي الغروب','حي الأفق','حي البحيرة','حي الواحة','حي الروضة','حي البستان','حي الحديقة'
];

function generateHotelsData() {
    const data = [];
    let id = 1;
    CITIES.forEach(city => {
        const code = CITY_CODES[city];
        // أبها وخميس مشيط: 100 وحدة | باقي المدن: 50 وحدة (للأداء الأفضل)
        const count = (city === 'أبها' || city === 'خميس مشيط') ? 100 : 50;
        for (let i = 0; i < count; i++) {
            const status = 'غير متعاقد';
            data.push({
                id: id++,
                name: HOTEL_NAMES[i % HOTEL_NAMES.length],
                address: `${NEIGHBORHOODS[i % NEIGHBORHOODS.length]}، ${city}`,
                city: city,
                phone: `0${code}${2000000 + (i * 1000)}`,
                status: status
            });
        }
    });
    console.log('✅ تم توليد ' + data.length + ' فندق');
    return data;
}

const defaultHotels = generateHotelsData();

// بيانات قديمة محفوظة للمرجع
const oldSampleHotels = [
    { id: 1, name: 'قصر أبها', address: 'أبها الجديدة', phone: '0172294444', status: 'تم التعاقد', city: 'أبها' },
    { id: 2, name: 'بلو إن Blue Inn', address: 'شارع الملك سعود، أبها', phone: '0172267777', status: 'تم التعاقد', city: 'أبها' },
    { id: 3, name: 'سروات بارك', address: 'طريق الملك عبدالعزيز، أبها', phone: '0172277777', status: 'جاري التعاقد', city: 'أبها' },
    { id: 4, name: 'بريرا أبها', address: 'حي الخالدية، أبها', phone: '920000002', status: 'تم التعاقد', city: 'أبها' },
    { id: 5, name: 'سينادو أبها', address: 'طريق الملك فهد، أبها', phone: '920001555', status: 'جاري التعاقد', city: 'أبها' },
    
    // الرياض (10 فنادق) - أرقام فنادق معروفة
    { id: 6, name: 'فندق الفيصلية', address: 'برج الفيصلية، الرياض', phone: '0112732000', status: 'تم التعاقد', city: 'الرياض' },
    { id: 7, name: 'فور سيزونز الرياض', address: 'مركز المملكة، الرياض', phone: '0112115000', status: 'تم التعاقد', city: 'الرياض' },
    { id: 8, name: 'ريتز كارلتون الرياض', address: 'المربع، الرياض', phone: '0118028000', status: 'تم التعاقد', city: 'الرياض' },
    { id: 9, name: 'هيلتون الرياض', address: 'الملك عبدالله، الرياض', phone: '0114800000', status: 'جاري التعاقد', city: 'الرياض' },
    { id: 10, name: 'ماريوت الرياض', address: 'الملك سعود، الرياض', phone: '0114779300', status: 'تم التعاقد', city: 'الرياض' },
    { id: 11, name: 'نارسيس الرياض', address: 'العليا، الرياض', phone: '0118280000', status: 'غير متعاقد', city: 'الرياض' },
    { id: 12, name: 'إنتركونتيننتال الرياض', address: 'الملز، الرياض', phone: '0114655000', status: 'غير متعاقد', city: 'الرياض' },
    { id: 13, name: 'موفنبيك الرياض', address: 'السليمانية، الرياض', phone: '0114555000', status: 'غير متعاقد', city: 'الرياض' },
    { id: 14, name: 'كراون بلازا الرياض', address: 'الدائري الشرقي، الرياض', phone: '0114654650', status: 'غير متعاقد', city: 'الرياض' },
    { id: 15, name: 'راديسون بلو الرياض', address: 'قرطبة، الرياض', phone: '0114771222', status: 'غير متعاقد', city: 'الرياض' },
    
    // جدة (10 فنادق)
    { id: 16, name: 'فندق جدة هيلتون', address: 'الكورنيش، جدة', phone: '0126594000', status: 'تم التعاقد', city: 'جدة' },
    { id: 17, name: 'بارك حياة جدة', address: 'الكورنيش الشمالي، جدة', phone: '0122631234', status: 'تم التعاقد', city: 'جدة' },
    { id: 18, name: 'روزوود جدة', address: 'الكورنيش، جدة', phone: '0126061000', status: 'تم التعاقد', city: 'جدة' },
    { id: 19, name: 'شيراتون جدة', address: 'الحمراء، جدة', phone: '0126992222', status: 'جاري التعاقد', city: 'جدة' },
    { id: 20, name: 'كراون بلازا جدة', address: 'فلسطين، جدة', phone: '0126615555', status: 'تم التعاقد', city: 'جدة' },
    { id: 21, name: 'راديسون بلو جدة', address: 'الأندلس، جدة', phone: '0126065555', status: 'غير متعاقد', city: 'جدة' },
    { id: 22, name: 'موفنبيك جدة', address: 'الروضة، جدة', phone: '0126064444', status: 'غير متعاقد', city: 'جدة' },
    { id: 23, name: 'إنتركونتيننتال جدة', address: 'الكورنيش، جدة', phone: '0126611800', status: 'غير متعاقد', city: 'جدة' },
    { id: 24, name: 'ماريوت جدة', address: 'المدينة الرياضية، جدة', phone: '0126066666', status: 'غير متعاقد', city: 'جدة' },
    { id: 25, name: 'كونراد جدة', address: 'الشاطئ، جدة', phone: '0126660000', status: 'غير متعاقد', city: 'جدة' },
    
    // مكة المكرمة (5 فنادق)
    { id: 26, name: 'فندق ساعة مكة', address: 'أبراج البيت، مكة', phone: '0125718888', status: 'تم التعاقد', city: 'مكة' },
    { id: 27, name: 'دار التوحيد إنتركونتيننتال', address: 'قرب الحرم، مكة', phone: '0125518888', status: 'تم التعاقد', city: 'مكة' },
    { id: 28, name: 'هيلتون مكة', address: 'العزيزية، مكة', phone: '0125568000', status: 'تم التعاقد', city: 'مكة' },
    { id: 29, name: 'شيراتون مكة', address: 'الشامية، مكة', phone: '0125565000', status: 'جاري التعاقد', city: 'مكة' },
    { id: 30, name: 'سويس اوتيل مكة', address: 'قرب الحرم، مكة', phone: '0125779777', status: 'تم التعاقد', city: 'مكة' },
    
    // المدينة المنورة (5 فنادق)
    { id: 31, name: 'فندق دار الإيمان', address: 'قرب الحرم، المدينة', phone: '0148233333', status: 'تم التعاقد', city: 'المدينة' },
    { id: 32, name: 'أنوار المدينة موفنبيك', address: 'قرب الحرم، المدينة', phone: '0148219999', status: 'تم التعاقد', city: 'المدينة' },
    { id: 33, name: 'شذا المدينة', address: 'الحرم المدني، المدينة', phone: '0148267777', status: 'جاري التعاقد', city: 'المدينة' },
    { id: 34, name: 'هيلتون المدينة', address: 'المطار، المدينة', phone: '0148389999', status: 'تم التعاقد', city: 'المدينة' },
    { id: 35, name: 'مداريم كراون', address: 'المركز، المدينة', phone: '0148222222', status: 'غير متعاقد', city: 'المدينة' },
    
    // الدمام (3 فنادق)
    { id: 36, name: 'راديسون بلو الدمام', address: 'الكورنيش، الدمام', phone: '0138598000', status: 'تم التعاقد', city: 'الدمام' },
    { id: 37, name: 'هوليداي إن الدمام', address: 'الشاطئ، الدمام', phone: '0138429999', status: 'جاري التعاقد', city: 'الدمام' },
    { id: 38, name: 'كراون بلازا الدمام', address: 'الكورنيش، الدمام', phone: '0138488888', status: 'غير متعاقد', city: 'الدمام' },
    
    // الطائف (2 فنادق)
    { id: 39, name: 'إنتركونتيننتال الطائف', address: 'الطريق الدائري، الطائف', phone: '0127500000', status: 'تم التعاقد', city: 'الطائف' },
    { id: 40, name: 'هيلتون الطائف', address: 'شهار، الطائف', phone: '0127505000', status: 'غير متعاقد', city: 'الطائف' },
    
    // تبوك (2 فنادق)
    { id: 41, name: 'موفنبيك تبوك', address: 'المطار، تبوك', phone: '0144228888', status: 'تم التعاقد', city: 'تبوك' },
    { id: 42, name: 'جولدن توليب تبوك', address: 'شارع الملك فيصل، تبوك', phone: '0144218888', status: 'غير متعاقد', city: 'تبوك' },
    
    // بريدة (2 فنادق)
    { id: 43, name: 'نوفوتيل بريدة', address: 'شارع الملك فهد، بريدة', phone: '0163800000', status: 'تم التعاقد', city: 'بريدة' },
    { id: 44, name: 'هيلتون جاردن إن بريدة', address: 'طريق المطار، بريدة', phone: '0163838888', status: 'غير متعاقد', city: 'بريدة' },
    
    // خميس مشيط (2 فنادق)
    { id: 45, name: 'عابر خميس مشيط', address: 'طريق الملك فهد، خميس مشيط', phone: '920000555', status: 'غير متعاقد', city: 'خميس مشيط' },
    { id: 46, name: 'فندق أبها بالاس', address: 'شارع الملك عبدالله، خميس مشيط', phone: '0172288888', status: 'غير متعاقد', city: 'خميس مشيط' },
    
    // نجران (1 فندق)
    { id: 47, name: 'هيلتون نجران', address: 'طريق الملك عبدالعزيز، نجران', phone: '0175448888', status: 'غير متعاقد', city: 'نجران' },
    
    // جيزان (1 فندق)
    { id: 48, name: 'راديسون بلو جيزان', address: 'الكورنيش، جيزان', phone: '0173218888', status: 'غير متعاقد', city: 'جيزان' },
    
    // ... وهكذا (تم توليد 750 فندق تلقائياً - 50 لكل مدينة)
];

let hotels = [];
let editingId = null;

// ========== تحميل البيانات ==========
function loadHotels() {
    console.log('⚙️ جاري تحميل الفنادق...');
    // استخدام البيانات المولدة مباشرة (750 فندق)
    hotels = [...defaultHotels];
    console.log('✅ تم تحميل ' + hotels.length + ' فندق');
    console.log('✅ مثال: ' + hotels[0].name + ' - ' + hotels[0].phone);
    displayHotels();
    
    // حفظ في localStorage للاستخدام المستقبلي
    localStorage.setItem('hotels', JSON.stringify(hotels));
    
    // حفظ في Firebase
    if (database) {
        saveToFirebase();
    }
}

// ========== حفظ البيانات ==========
function saveHotels() {
    localStorage.setItem('hotels', JSON.stringify(hotels));
    saveToFirebase();
}

function saveToFirebase() {
    if (database) {
        const obj = {};
        hotels.forEach(h => obj[h.id] = h);
        database.ref('hotels').set(obj).catch(err => console.warn('Firebase error:', err));
    }
}

// ========== عرض البيانات ==========
function displayHotels(filtered = null) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    const list = filtered || hotels;
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">لا توجد فنادق</td></tr>';
        return;
    }
    
    list.forEach((hotel, index) => {
        let statusClass = '';
        if (hotel.status === 'تم التعاقد') statusClass = 'status-completed';
        else if (hotel.status === 'جاري التعاقد') statusClass = 'status-inprogress';
        else if (hotel.status === 'غير متعاقد') statusClass = 'status-notstarted';
        else if (hotel.status === 'رفض التعاقد') statusClass = 'status-rejected';
        
        const searchName = encodeURIComponent(hotel.name + ' أبها');
        const displayPhone = hotel.phone.replace('+966', '0').replace(/\s/g, '');
        
        // تحويل الرقم للصيغة الصحيحة للواتساب
        let whatsappNumber = hotel.phone.replace(/[\s\-\(\)]/g, '');
        if (whatsappNumber.startsWith('+966')) {
            whatsappNumber = whatsappNumber.replace('+966', '966');
        } else if (whatsappNumber.startsWith('00966')) {
            whatsappNumber = whatsappNumber.replace('00966', '966');
        } else if (whatsappNumber.startsWith('0')) {
            whatsappNumber = '966' + whatsappNumber.substring(1);
        }
        
        // رقم الاتصال المحلي (يبدأ بـ 0)
        let callNumber = hotel.phone.replace(/[\s\-\(\)]/g, '');
        if (callNumber.startsWith('+966')) {
            callNumber = '0' + callNumber.substring(4);
        } else if (callNumber.startsWith('00966')) {
            callNumber = '0' + callNumber.substring(5);
        }
        
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span>${hotel.name}</span>
                        <div class="search-buttons">
                            <a href="https://www.booking.com/search.html?ss=${searchName}" target="_blank" class="btn-search" title="بحث في Booking">🏨</a>
                            <a href="https://www.google.com/search?q=${searchName}+hotel+phone" target="_blank" class="btn-search" title="بحث في Google">🔍</a>
                            <a href="https://www.google.com/maps/search/${searchName}" target="_blank" class="btn-search" title="فتح في الخرائط">📍</a>
                        </div>
                    </div>
                </td>
                <td>${hotel.address}</td>
                <td dir="ltr" style="text-align: center;">
                    <div class="phone-actions">
                        <span class="phone-number">${displayPhone}</span>
                        <div class="phone-buttons">
                            <a href="tel:${callNumber}" class="btn-call">📞</a>
                            <a href="https://wa.me/${whatsappNumber}" target="_blank" class="btn-whatsapp">💬</a>
                        </div>
                    </div>
                </td>
                <td>
                    <select class="status-select ${statusClass}" onchange="changeStatus(${hotel.id}, this.value)">
                        <option value="تم التعاقد" ${hotel.status === 'تم التعاقد' ? 'selected' : ''}>تم التعاقد</option>
                        <option value="جاري التعاقد" ${hotel.status === 'جاري التعاقد' ? 'selected' : ''}>جاري التعاقد</option>
                        <option value="غير متعاقد" ${hotel.status === 'غير متعاقد' ? 'selected' : ''}>غير متعاقد</option>
                        <option value="رفض التعاقد" ${hotel.status === 'رفض التعاقد' ? 'selected' : ''}>رفض التعاقد</option>
                    </select>
                </td>
                <td>
                    <button class="btn-edit" onclick="editHotel(${hotel.id})">تعديل</button>
                    <button class="btn-delete" onclick="deleteHotel(${hotel.id})">حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// ========== إضافة/تعديل ==========
document.getElementById('hotelForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('hotelName').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value;
    const phone = document.getElementById('phone').value.trim();
    const status = document.getElementById('status').value;
    
    const duplicate = hotels.some(h => {
        if (editingId && h.id === editingId) return false;
        return h.name === name || h.phone === phone;
    });
    
    if (duplicate) {
        alert('⚠️ اسم الفندق أو رقم الهاتف موجود بالفعل!');
        return;
    }
    
    if (editingId) {
        const index = hotels.findIndex(h => h.id === editingId);
        hotels[index] = { id: editingId, name, address, city, phone, status };
        alert('✅ تم التحديث بنجاح!');
        editingId = null;
    } else {
        hotels.push({ id: Date.now(), name, address, city, phone, status });
        alert('✅ تم الإضافة بنجاح!');
    }
    
    saveHotels();
    displayHotels();
    hideAddForm();
    // تم إزالة this.reset() للحفاظ على البيانات المدخلة
});

function editHotel(id) {
    const hotel = hotels.find(h => h.id === id);
    if (hotel) {
        document.getElementById('hotelName').value = hotel.name;
        document.getElementById('address').value = hotel.address;
        document.getElementById('city').value = hotel.city || 'أبها';
        document.getElementById('phone').value = hotel.phone;
        document.getElementById('status').value = hotel.status;
        editingId = id;
        showAddForm();
    }
}

function deleteHotel(id) {
    if (confirm('هل أنت متأكد من الحذف؟')) {
        hotels = hotels.filter(h => h.id !== id);
        saveHotels();
        displayHotels();
        alert('✅ تم الحذف بنجاح!');
    }
}

function changeStatus(id, newStatus) {
    const hotel = hotels.find(h => h.id === id);
    if (hotel) {
        hotel.status = newStatus;
        saveHotels();
        filterHotels();
    }
}

// ========== عرض/إخفاء النماذج ==========
function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
    document.getElementById('uploadForm').style.display = 'none';
    document.getElementById('addForm').scrollIntoView({ behavior: 'smooth' });
}

function hideAddForm() {
    document.getElementById('addForm').style.display = 'none';
    editingId = null;
    // لا نقوم بمسح البيانات عند الإلغاء للحفاظ على رقم الجوال
}

function showUploadForm() {
    document.getElementById('uploadForm').style.display = 'block';
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('uploadForm').scrollIntoView({ behavior: 'smooth' });
}

function hideUploadForm() {
    document.getElementById('uploadForm').style.display = 'none';
}

// ========== البحث والفلترة ==========
function filterHotels() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const cityFilter = document.getElementById('cityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filtered = hotels;
    
    if (search) {
        filtered = filtered.filter(h =>
            h.name.toLowerCase().includes(search) ||
            h.address.toLowerCase().includes(search) ||
            h.phone.toLowerCase().includes(search)
        );
    }
    
    if (cityFilter !== 'الكل') {
        filtered = filtered.filter(h => h.city === cityFilter);
    }
    
    if (statusFilter !== 'الكل') {
        filtered = filtered.filter(h => h.status === statusFilter);
    }
    
    displayHotels(filtered);
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('cityFilter').value = 'الكل';
    document.getElementById('statusFilter').value = 'الكل';
    displayHotels();
}

// ========== استيراد الصور ==========
let currentImageData = null;

document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) previewImage(file);
});

const dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('active');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));
dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('active');
    if (e.dataTransfer.files.length > 0) previewImage(e.dataTransfer.files[0]);
});

// لصق الصورة من الحافظة (في أي مكان بالصفحة)
document.addEventListener('paste', function(e) {
    const items = e.clipboardData?.items;
    if (items) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const blob = items[i].getAsFile();
                showUploadForm(); // فتح النموذج تلقائياً
                previewImage(blob);
                alert('✅ تم لصق الصورة! اضغط "استخراج البيانات"');
                break;
            }
        }
    }
});

function previewImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        currentImageData = e.target.result;
        document.getElementById('previewImg').src = e.target.result;
        document.getElementById('imagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function processImage() {
    if (!currentImageData) return;
    
    alert('⏳ جاري استخراج البيانات من الصورة...');
    
    Tesseract.recognize(currentImageData, 'ara+eng', {
        logger: m => console.log(m)
    }).then(({ data: { text } }) => {
        console.log('النص المستخرج:', text);
        
        // استخراج البيانات
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        
        let hotelName = '';
        let phoneNumber = '';
        let address = '';
        
        // البحث عن رقم الهاتف
        for (let line of lines) {
            // أرقام سعودية
            const phoneMatch = line.match(/0\s*\d{1,2}\s*\d{3}\s*\d{4}/g) || 
                             line.match(/\+?\s*966\s*\d{1,2}\s*\d{3}\s*\d{4}/g);
            if (phoneMatch) {
                phoneNumber = phoneMatch[0].replace(/\s+/g, '');
                break;
            }
        }
        
        // اسم الفندق (عادة أول سطر أو يحتوي على كلمات معينة)
        for (let line of lines) {
            if (line.length > 5 && line.length < 100 && 
                (line.includes('فندق') || line.includes('أجنحة') || line.includes('منتجع') || 
                 line.includes('hotel') || line.includes('inn') || line.includes('suites') ||
                 /[a-zA-Zأ-ي]/.test(line))) {
                hotelName = line.replace(/فندق/g, '').replace(/hotel/gi, '').trim();
                if (hotelName.length > 3) break;
            }
        }
        
        // العنوان (عادة يحتوي على كلمات مثل شارع، حي، طريق)
        for (let line of lines) {
            if (line.includes('شارع') || line.includes('طريق') || line.includes('حي') ||
                line.includes('الأمير') || line.includes('الملك')) {
                address = line.substring(0, 50); // اختصار العنوان
                break;
            }
        }
        
        // إذا لم نجد عنوان، نستخدم "أبها" كعنوان افتراضي
        if (!address) address = 'أبها';
        
        // إذا لم نجد اسم، نستخدم أول سطر
        if (!hotelName && lines.length > 0) hotelName = lines[0];
        
        // إذا لم نجد رقم، نضع رقم افتراضي
        if (!phoneNumber) phoneNumber = '0000000000';
        
        // عرض البيانات في النموذج
        if (hotelName) {
            document.getElementById('hotelName').value = hotelName;
            document.getElementById('address').value = address;
            document.getElementById('phone').value = phoneNumber;
            document.getElementById('status').value = 'غير متعاقد';
            
            hideUploadForm();
            showAddForm();
            alert('✅ تم استخراج البيانات! راجع البيانات واحفظ');
        } else {
            alert('❌ لم يتم العثور على بيانات واضحة في الصورة');
        }
    }).catch(err => {
        console.error(err);
        alert('❌ خطأ في معالجة الصورة');
    });
}

function handleFile(file) {
    previewImage(file);
}

// ========== تصدير Excel ==========
function exportToExcel() {
    const data = [['اسم الفندق', 'العنوان', 'الهاتف', 'حالة التعاقد']];
    hotels.forEach(h => data.push([h.name, h.address, h.phone, h.status]));
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الفنادق');
    XLSX.writeFile(wb, `hotels_${Date.now()}.xlsx`);
}

// ========== التشغيل ==========
window.addEventListener('DOMContentLoaded', loadHotels);
