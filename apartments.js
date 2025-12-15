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

// ========== مولد البيانات الديناميكي - 50 شقة لكل مدينة (750 شقة) ==========
const CITIES = ['الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الطائف', 'تبوك', 'بريدة', 'خميس مشيط', 'أبها', 'نجران', 'جيزان', 'حائل', 'الخبر', 'الجبيل'];
const CITY_CODES = {'الرياض':'011','جدة':'012','مكة':'012','المدينة':'014','الدمام':'013','الطائف':'012','تبوك':'014','بريدة':'016','خميس مشيط':'017','أبها':'017','نجران':'017','جيزان':'017','حائل':'016','الخبر':'013','الجبيل':'013'};

const APARTMENT_NAMES = [
    'أجنحة النخيل','أجنحة الورود','أجنحة الياسمين','أجنحة الزهور','أجنحة الريحان','شقق البنفسج','شقق الفل','شقق النرجس','شقق الربيع','شقق الخريف',
    'فلل الصيف','فلل الشتاء','فلل النجوم','فلل القمر','فلل الشمس','شاليهات البحر','شاليهات الجبل','شاليهات الوادي','شاليهات السهل','شاليهات الهضبة',
    'أبراج المدينة','أبراج التطوير','أبراج الرفاهية','أبراج الفخامة','أبراج الأناقة','شقق السلام','شقق الأمان','شقق الراحة','شقق الهدوء','شقق السكينة',
    'أجنحة المها','أجنحة الغزال','أجنحة الصقر','أجنحة النسر','أجنحة الطير','فلل الحدائق','فلل البساتين','فلل الروضة','فلل الخضراء','فلل الزمرد',
    'شاليهات الشاطئ','شاليهات الكورنيش','شاليهات المرجان','شاليهات اللؤلؤ','شاليهات الفيروز','أبراج العز','أبراج المجد','أبراج الفخر','أبراج العلا','أبراج السمو'
];

const NEIGHBORHOODS = [
    'حي المروج','حي النخيل','حي الورود','حي الريحان','حي الياسمين','حي الربيع','حي الخريف','حي النسيم','حي السلام','حي الأمل',
    'حي النور','حي الهدى','حي الفيحاء','حي الزهراء','حي الرياض','حي العليا','حي الملز','حي السليمانية','حي المعذر','حي الروضة',
    'حي الشفا','حي الصفا','حي المروة','حي النسيم','حي الربوة','حي الخالدية','حي العزيزية','حي النزهة','حي الفيصلية','حي الملك فهد',
    'حي الملك عبدالله','حي الملك عبدالعزيز','حي الأمير سلطان','حي الأمير محمد','حي الأمير فيصل','حي الحمراء','حي الأندلس','حي قرطبة','حي غرناطة','حي إشبيلية',
    'حي المنار','حي الفجر','حي الشروق','حي الغروب','حي الأفق','حي البحيرة','حي الواحة','حي الروضة','حي البستان','حي الحديقة'
];

function generateApartmentsData() {
    const data = [];
    let id = 1;
    CITIES.forEach(city => {
        const code = CITY_CODES[city];
        for (let i = 0; i < 50; i++) {
            const status = i < 15 ? 'تم التعاقد' : (i < 30 ? 'جاري التعاقد' : (i < 45 ? 'غير متعاقد' : 'رفض التعاقد'));
            data.push({
                id: id++,
                name: APARTMENT_NAMES[i % APARTMENT_NAMES.length],
                address: `${NEIGHBORHOODS[i % NEIGHBORHOODS.length]}، ${city}`,
                city: city,
                phone: `0${code}${3000000 + (i * 1000)}`,
                status: status
            });
        }
    });
    return data;
}

const defaultApartments = generateApartmentsData();

// بيانات قديمة محفوظة للمرجع
const oldSampleApartments = [
    // الرياض (10 شقق)
    { id: 1, name: 'أجنحة النخيل الذهبية', address: 'العليا، الرياض', phone: '+966 11 282 8888', status: 'تم التعاقد', city: 'الرياض' },
    { id: 2, name: 'شقق الفيصلية المفروشة', address: 'الملك فهد، الرياض', phone: '+966 11 273 9999', status: 'تم التعاقد', city: 'الرياض' },
    { id: 3, name: 'أجنحة الريان الفندقية', address: 'الملقا، الرياض', phone: '+966 11 828 7777', status: 'جاري التعاقد', city: 'الرياض' },
    { id: 4, name: 'شقق دار المملكة', address: 'السليمانية، الرياض', phone: '+966 11 455 8888', status: 'تم التعاقد', city: 'الرياض' },
    { id: 5, name: 'أجنحة الموسى', address: 'النخيل، الرياض', phone: '+966 11 419 8888', status: 'غير متعاقد', city: 'الرياض' },
    { id: 6, name: 'شقق الورود الفندقية', address: 'قرطبة، الرياض', phone: '+966 11 477 7777', status: 'غير متعاقد', city: 'الرياض' },
    { id: 7, name: 'أجنحة المروج', address: 'المروج، الرياض', phone: '+966 11 234 5678', status: 'غير متعاقد', city: 'الرياض' },
    { id: 8, name: 'شقق النسيم المفروشة', address: 'النسيم، الرياض', phone: '+966 11 235 6789', status: 'غير متعاقد', city: 'الرياض' },
    { id: 9, name: 'أجنحة الياسمين', address: 'الياسمين، الرياض', phone: '+966 11 236 7890', status: 'غير متعاقد', city: 'الرياض' },
    { id: 10, name: 'شقق الرحاب الذهبية', address: 'الرحاب، الرياض', phone: '+966 11 237 8901', status: 'غير متعاقد', city: 'الرياض' },
    
    // جدة (10 شقق)
    { id: 11, name: 'أجنحة الشاطئ', address: 'الكورنيش، جدة', phone: '+966 12 661 2222', status: 'تم التعاقد', city: 'جدة' },
    { id: 12, name: 'شقق المرجان الفندقية', address: 'الصفا، جدة', phone: '+966 12 606 8888', status: 'تم التعاقد', city: 'جدة' },
    { id: 13, name: 'أجنحة اللؤلؤة', address: 'الفيحاء، جدة', phone: '+966 12 661 9999', status: 'جاري التعاقد', city: 'جدة' },
    { id: 14, name: 'شقق الياقوت المفروشة', address: 'الرحاب، جدة', phone: '+966 12 606 7777', status: 'تم التعاقد', city: 'جدة' },
    { id: 15, name: 'أجنحة النور', address: 'النزهة، جدة', phone: '+966 12 661 6666', status: 'غير متعاقد', city: 'جدة' },
    { id: 16, name: 'شقق الفردوس الفندقية', address: 'الشرفية، جدة', phone: '+966 12 606 5555', status: 'غير متعاقد', city: 'جدة' },
    { id: 17, name: 'أجنحة الزهراء', address: 'الزهراء، جدة', phone: '+966 12 661 4444', status: 'غير متعاقد', city: 'جدة' },
    { id: 18, name: 'شقق الواحة المفروشة', address: 'الواحة، جدة', phone: '+966 12 606 3333', status: 'غير متعاقد', city: 'جدة' },
    { id: 19, name: 'أجنحة البحر الأحمر', address: 'الحمراء، جدة', phone: '+966 12 699 8888', status: 'غير متعاقد', city: 'جدة' },
    { id: 20, name: 'شقق البلد الفندقية', address: 'البلد، جدة', phone: '+966 12 647 8888', status: 'غير متعاقد', city: 'جدة' },
    
    // مكة (5 شقق)
    { id: 21, name: 'أجنحة الصفا والمروة', address: 'أجياد، مكة', phone: '+966 12 577 8888', status: 'تم التعاقد', city: 'مكة' },
    { id: 22, name: 'شقق جبل عمر المفروشة', address: 'جبل عمر، مكة', phone: '+966 12 556 9999', status: 'تم التعاقد', city: 'مكة' },
    { id: 23, name: 'أجنحة الحجون', address: 'الحجون، مكة', phone: '+966 12 556 7777', status: 'جاري التعاقد', city: 'مكة' },
    { id: 24, name: 'شقق العزيزية الفندقية', address: 'العزيزية، مكة', phone: '+966 12 556 6666', status: 'تم التعاقد', city: 'مكة' },
    { id: 25, name: 'أجنحة الهدى', address: 'الهجرة، مكة', phone: '+966 12 556 5555', status: 'غير متعاقد', city: 'مكة' },
    
    // المدينة (5 شقق)
    { id: 26, name: 'أجنحة المنارة', address: 'قرب الحرم، المدينة', phone: '+966 14 826 8888', status: 'تم التعاقد', city: 'المدينة' },
    { id: 27, name: 'شقق الروضة المفروشة', address: 'الروضة، المدينة', phone: '+966 14 822 9999', status: 'تم التعاقد', city: 'المدينة' },
    { id: 28, name: 'أجنحة الإيمان', address: 'العيون، المدينة', phone: '+966 14 823 7777', status: 'جاري التعاقد', city: 'المدينة' },
    { id: 29, name: 'شقق المبعوث الفندقية', address: 'قباء، المدينة', phone: '+966 14 826 6666', status: 'تم التعاقد', city: 'المدينة' },
    { id: 30, name: 'أجنحة النخيل', address: 'العوالي، المدينة', phone: '+966 14 822 5555', status: 'غير متعاقد', city: 'المدينة' },
    
    // أبها (3 شقق)
    { id: 31, name: 'درة أبها للأجنحة', address: 'حي القابل، أبها', phone: '+966 17 229 8888', status: 'تم التعاقد', city: 'أبها' },
    { id: 32, name: 'أجنحة السودة', address: 'طريق السودة، أبها', phone: '+966 17 227 9999', status: 'تم التعاقد', city: 'أبها' },
    { id: 33, name: 'شقق الحبلة المفروشة', address: 'حي الحبلة، أبها', phone: '+966 17 228 7777', status: 'جاري التعاقد', city: 'أبها' },
    
    // الدمام (3 شقق)
    { id: 34, name: 'أجنحة الشاطئ الذهبي', address: 'الكورنيش، الدمام', phone: '+966 13 832 8888', status: 'تم التعاقد', city: 'الدمام' },
    { id: 35, name: 'شقق الخليج المفروشة', address: 'الفيصلية، الدمام', phone: '+966 13 842 9999', status: 'جاري التعاقد', city: 'الدمام' },
    { id: 36, name: 'أجنحة الواحة', address: 'الشاطئ، الدمام', phone: '+966 13 848 7777', status: 'غير متعاقد', city: 'الدمام' },
    
    // الطائف (2 شقة)
    { id: 37, name: 'أجنحة الورد', address: 'العقيق، الطائف', phone: '+966 12 733 8888', status: 'تم التعاقد', city: 'الطائف' },
    { id: 38, name: 'شقق الشفا المفروشة', address: 'شهار، الطائف', phone: '+966 12 750 9999', status: 'غير متعاقد', city: 'الطائف' },
    
    // تبوك (2 شقة)
    { id: 39, name: 'أجنحة الأمير فهد', address: 'شارع الملك فيصل، تبوك', phone: '+966 14 422 8888', status: 'تم التعاقد', city: 'تبوك' },
    { id: 40, name: 'شقق الفيحاء المفروشة', address: 'الفيصلية، تبوك', phone: '+966 14 421 9999', status: 'غير متعاقد', city: 'تبوك' },
    
    // بريدة (2 شقة)
    { id: 41, name: 'أجنحة القصيم', address: 'شارع الملك فهد، بريدة', phone: '+966 16 380 8888', status: 'تم التعاقد', city: 'بريدة' },
    { id: 42, name: 'شقق الربيع المفروشة', address: 'الروضة، بريدة', phone: '+966 16 383 9999', status: 'غير متعاقد', city: 'بريدة' },
    
    // خميس مشيط (2 شقة)
    { id: 43, name: 'أجنحة عسير', address: 'شارع الملك عبدالله، خميس مشيط', phone: '+966 17 225 8888', status: 'غير متعاقد', city: 'خميس مشيط' },
    { id: 44, name: 'شقق الجنوب المفروشة', address: 'حي السليمانية، خميس مشيط', phone: '+966 17 223 9999', status: 'غير متعاقد', city: 'خميس مشيط' },
    
    // الخبر (2 شقة)
    { id: 45, name: 'أجنحة الخليج', address: 'الكورنيش، الخبر', phone: '+966 13 898 8888', status: 'تم التعاقد', city: 'الخبر' },
    { id: 46, name: 'شقق العقيق المفروشة', address: 'العقيق، الخبر', phone: '+966 13 894 9999', status: 'غير متعاقد', city: 'الخبر' },
    
    // نجران (1 شقة)
    { id: 47, name: 'أجنحة نجران الفندقية', address: 'شارع الملك عبدالعزيز، نجران', phone: '+966 17 544 8888', status: 'غير متعاقد', city: 'نجران' },
    
    // جيزان (1 شقة)
    { id: 48, name: 'شقق الكورنيش المفروشة', address: 'الكورنيش، جيزان', phone: '+966 17 321 8888', status: 'غير متعاقد', city: 'جيزان' },
    
    // حائل (1 شقة)
    // ... وهكذا (تم توليد 750 شقة تلقائياً - 50 لكل مدينة)
];

let apartments = [];
let editingId = null;

// ========== تحميل البيانات ==========
function loadApartments() {
    // استخدم البيانات المولّدة دائماً (750 شقة)
    apartments = [...defaultApartments];
    localStorage.setItem('apartments', JSON.stringify(apartments));
    displayApartments();
}

// ========== حفظ البيانات ==========
function saveApartments() {
    localStorage.setItem('apartments', JSON.stringify(apartments));
    saveToFirebase();
}

function saveToFirebase() {
    if (database) {
        const obj = {};
        apartments.forEach(a => obj[a.id] = a);
        database.ref('apartments').set(obj).catch(err => console.warn('Firebase error:', err));
    }
}

// ========== عرض البيانات ==========
function displayApartments(filtered = null) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    const list = filtered || apartments;
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">لا توجد شقق فندقية</td></tr>';
        return;
    }
    
    list.forEach((apartment, index) => {
        let statusClass = '';
        if (apartment.status === 'تم التعاقد') statusClass = 'status-completed';
        else if (apartment.status === 'جاري التعاقد') statusClass = 'status-inprogress';
        else if (apartment.status === 'غير متعاقد') statusClass = 'status-notstarted';
        else if (apartment.status === 'رفض التعاقد') statusClass = 'status-rejected';
        
        const searchName = encodeURIComponent(apartment.name + ' ' + apartment.city);
        const displayPhone = apartment.phone.replace('+966', '0').replace(/\s/g, '');
        
        let whatsappNumber = apartment.phone.replace(/[\s\-\(\)]/g, '');
        if (whatsappNumber.startsWith('+966')) {
            whatsappNumber = whatsappNumber.replace('+966', '966');
        } else if (whatsappNumber.startsWith('00966')) {
            whatsappNumber = whatsappNumber.replace('00966', '966');
        } else if (whatsappNumber.startsWith('0')) {
            whatsappNumber = '966' + whatsappNumber.substring(1);
        }
        
        let callNumber = apartment.phone.replace(/[\s\-\(\)]/g, '');
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
                        <span>${apartment.name}</span>
                        <div class="search-buttons">
                            <a href="https://www.booking.com/search.html?ss=${searchName}" target="_blank" class="btn-search" title="بحث في Booking">🏨</a>
                            <a href="https://www.google.com/search?q=${searchName}" target="_blank" class="btn-search" title="بحث في Google">🔍</a>
                            <a href="https://www.google.com/maps/search/${searchName}" target="_blank" class="btn-search" title="فتح في الخرائط">📍</a>
                        </div>
                    </div>
                </td>
                <td>${apartment.address}</td>
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
                    <select class="status-select ${statusClass}" onchange="changeStatus(${apartment.id}, this.value)">
                        <option value="تم التعاقد" ${apartment.status === 'تم التعاقد' ? 'selected' : ''}>تم التعاقد</option>
                        <option value="جاري التعاقد" ${apartment.status === 'جاري التعاقد' ? 'selected' : ''}>جاري التعاقد</option>
                        <option value="غير متعاقد" ${apartment.status === 'غير متعاقد' ? 'selected' : ''}>غير متعاقد</option>
                        <option value="رفض التعاقد" ${apartment.status === 'رفض التعاقد' ? 'selected' : ''}>رفض التعاقد</option>
                    </select>
                </td>
                <td>
                    <button class="btn-edit" onclick="editApartment(${apartment.id})">تعديل</button>
                    <button class="btn-delete" onclick="deleteApartment(${apartment.id})">حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// ========== تغيير الحالة ==========
function changeStatus(id, newStatus) {
    const apartment = apartments.find(a => a.id === id);
    if (apartment) {
        apartment.status = newStatus;
        saveApartments();
        displayApartments();
    }
}

// ========== نماذج الإضافة والتعديل ==========
function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
    document.getElementById('apartmentForm').reset();
    editingId = null;
}

function hideAddForm() {
    document.getElementById('addForm').style.display = 'none';
    editingId = null;
}

function showUploadForm() {
    document.getElementById('uploadForm').style.display = 'block';
}

function hideUploadForm() {
    document.getElementById('uploadForm').style.display = 'none';
}

document.getElementById('apartmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('apartmentName').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const phone = document.getElementById('phone').value;
    const status = document.getElementById('status').value;
    
    if (editingId) {
        const apartment = apartments.find(a => a.id === editingId);
        if (apartment) {
            apartment.name = name;
            apartment.address = address;
            apartment.city = city;
            apartment.phone = phone;
            apartment.status = status;
        }
    } else {
        const newId = apartments.length > 0 ? Math.max(...apartments.map(a => a.id)) + 1 : 1;
        apartments.push({ id: newId, name, address, city, phone, status });
    }
    
    saveApartments();
    displayApartments();
    hideAddForm();
});

// ========== التعديل والحذف ==========
function editApartment(id) {
    const apartment = apartments.find(a => a.id === id);
    if (apartment) {
        document.getElementById('apartmentName').value = apartment.name;
        document.getElementById('address').value = apartment.address;
        document.getElementById('city').value = apartment.city || 'أبها';
        document.getElementById('phone').value = apartment.phone;
        document.getElementById('status').value = apartment.status;
        editingId = id;
        showAddForm();
    }
}

function deleteApartment(id) {
    if (confirm('هل أنت متأكد من حذف هذه الشقة الفندقية؟')) {
        apartments = apartments.filter(a => a.id !== id);
        saveApartments();
        displayApartments();
    }
}

// ========== البحث والفلتر ==========
function filterApartments() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const cityValue = document.getElementById('cityFilter').value;
    const statusValue = document.getElementById('statusFilter').value;
    
    let filtered = apartments;
    
    if (searchValue) {
        filtered = filtered.filter(a => 
            a.name.toLowerCase().includes(searchValue) ||
            a.address.toLowerCase().includes(searchValue) ||
            a.phone.includes(searchValue)
        );
    }
    
    if (cityValue !== 'الكل') {
        filtered = filtered.filter(a => a.city === cityValue);
    }
    
    if (statusValue !== 'الكل') {
        filtered = filtered.filter(a => a.status === statusValue);
    }
    
    displayApartments(filtered);
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('cityFilter').value = 'الكل';
    document.getElementById('statusFilter').value = 'الكل';
    displayApartments();
}

// ========== التصدير إلى Excel ==========
function exportToExcel() {
    const data = apartments.map((a, i) => ({
        '#': i + 1,
        'اسم الشقة الفندقية': a.name,
        'العنوان': a.address,
        'المدينة': a.city,
        'الهاتف': a.phone,
        'حالة التعاقد': a.status
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الشقق الفندقية');
    XLSX.writeFile(wb, 'الشقق_الفندقية.xlsx');
}

// ========== رفع وتحليل الصور ==========
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', handleFile);

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#4CAF50';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#666';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#666';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        displayImage(file);
    }
});

document.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
        if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            displayImage(file);
            showUploadForm();
        }
    }
});

function handleFile(e) {
    const file = e.target.files[0];
    if (file) displayImage(file);
}

function displayImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function processImage() {
    Tesseract.recognize(previewImg.src, 'ara+eng', {
        logger: m => console.log(m)
    }).then(({ data: { text } }) => {
        console.log('النص المستخرج:', text);
        
        const nameMatch = text.match(/([^\n]+(?:أجنحة|شقق|فندقية|مفروشة)[^\n]+)/i);
        const phoneMatch = text.match(/(\+?966|05)\s*\d{1,2}\s*\d{3}\s*\d{4}/);
        
        if (nameMatch) document.getElementById('apartmentName').value = nameMatch[1].trim();
        if (phoneMatch) document.getElementById('phone').value = phoneMatch[0];
        
        showAddForm();
        hideUploadForm();
    });
}

// ========== تهيئة التطبيق ==========
window.onload = loadApartments;
