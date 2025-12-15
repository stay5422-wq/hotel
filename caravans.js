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

// ========== مولد البيانات الديناميكي - 50 كرفان لكل مدينة (750 كرفان) ==========
const CITIES = ['الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الطائف', 'تبوك', 'بريدة', 'خميس مشيط', 'أبها', 'نجران', 'جيزان', 'حائل', 'الخبر', 'الجبيل'];
const CITY_CODES = {'الرياض':'011','جدة':'012','مكة':'012','المدينة':'014','الدمام':'013','الطائف':'012','تبوك':'014','بريدة':'016','خميس مشيط':'017','أبها':'017','نجران':'017','جيزان':'017','حائل':'016','الخبر':'013','الجبيل':'013'};

const CARAVAN_NAMES = [
    'كرفانات الصحراء','كرفانات الكثبان','كرفانات البرية','كرفانات الواحة','كرفانات النجوم','مخيم الليل','مخيم القمر','مخيم الرمال','مخيم الهدوء','مخيم السكينة',
    'محطة الطبيعة','محطة الجبال','محطة الوديان','محطة السهول','محطة الهضاب','كرفانات الشعاب','كرفانات الغيوم','كرفانات الأفق','كرفانات البعيد','كرفانات القريب',
    'مخيم المغامرة','مخيم الإثارة','مخيم التشويق','مخيم الاستكشاف','مخيم الاكتشاف','كرفانات الراحة','كرفانات الاسترخاء','كرفانات الهدوء','كرفانات السلام','كرفانات الأمان',
    'مخيم الشروق','مخيم الغروب','مخيم الفجر','مخيم الأصيل','مخيم الزوال','محطة الربيع','محطة الخريف','محطة الصيف','محطة الشتاء','محطة الفصول',
    'كرفانات العائلات','كرفانات الأصدقاء','كرفانات الرحلات','كرفانات السفر','كرفانات التنزه','مخيم البدو','مخيم الأجداد','مخيم التراث','مخيم الأصالة','مخيم العراقة'
];

const NEIGHBORHOODS = [
    'حي المروج','حي النخيل','حي الورود','حي الريحان','حي الياسمين','حي الربيع','حي الخريف','حي النسيم','حي السلام','حي الأمل',
    'حي النور','حي الهدى','حي الفيحاء','حي الزهراء','حي الرياض','حي العليا','حي الملز','حي السليمانية','حي المعذر','حي الروضة',
    'حي الشفا','حي الصفا','حي المروة','حي النسيم','حي الربوة','حي الخالدية','حي العزيزية','حي النزهة','حي الفيصلية','حي الملك فهد',
    'حي الملك عبدالله','حي الملك عبدالعزيز','حي الأمير سلطان','حي الأمير محمد','حي الأمير فيصل','حي الحمراء','حي الأندلس','حي قرطبة','حي غرناطة','حي إشبيلية',
    'حي المنار','حي الفجر','حي الشروق','حي الغروب','حي الأفق','حي البحيرة','حي الواحة','حي الروضة','حي البستان','حي الحديقة'
];

function generateCaravansData() {
    const data = [];
    let id = 1;
    CITIES.forEach(city => {
        const code = CITY_CODES[city];
        for (let i = 0; i < 50; i++) {
            const status = i < 15 ? 'تم التعاقد' : (i < 30 ? 'جاري التعاقد' : (i < 45 ? 'غير متعاقد' : 'رفض التعاقد'));
            data.push({
                id: id++,
                name: CARAVAN_NAMES[i % CARAVAN_NAMES.length],
                address: `${NEIGHBORHOODS[i % NEIGHBORHOODS.length]}، ${city}`,
                city: city,
                phone: `0${code}${5000000 + (i * 1000)}`,
                status: status
            });
        }
    });
    return data;
}

const defaultCaravans = generateCaravansData();

// بيانات قديمة محفوظة للمرجع
const oldSampleCaravans = [
    // أبها (10 كرفانات)
    { id: 1, name: 'كرفانات الجبل الأخضر', address: 'الجبل الأخضر، أبها', phone: '0554447001', status: 'تم التعاقد', city: 'أبها' },
    { id: 2, name: 'مخيم السودة', address: 'السودة، أبها', phone: '0554447002', status: 'تم التعاقد', city: 'أبها' },
    { id: 3, name: 'كرفانات الهدا أبها', address: 'الهدا، أبها', phone: '0554447003', status: 'جاري التعاقد', city: 'أبها' },
    { id: 4, name: 'مخيم الضباب', address: 'الضباب، أبها', phone: '0554447004', status: 'تم التعاقد', city: 'أبها' },
    { id: 5, name: 'كرفانات الروشن', address: 'الروشن، أبها', phone: '0554447005', status: 'جاري التعاقد', city: 'أبها' },
    { id: 6, name: 'مخيم الحبلة', address: 'الحبلة، أبها', phone: '0554447006', status: 'تم التعاقد', city: 'أبها' },
    { id: 7, name: 'كرفانات الجرة', address: 'الجرة، أبها', phone: '0554447007', status: 'غير متعاقد', city: 'أبها' },
    { id: 8, name: 'مخيم أبها الجديدة', address: 'أبها الجديدة، أبها', phone: '0554447008', status: 'غير متعاقد', city: 'أبها' },
    { id: 9, name: 'كرفانات الشلال', address: 'الشلال، أبها', phone: '0554447009', status: 'غير متعاقد', city: 'أبها' },
    { id: 10, name: 'مخيم السحاب', address: 'السحاب، أبها', phone: '0554447010', status: 'غير متعاقد', city: 'أبها' },
    
    // الطائف (8 كرفانات)
    { id: 11, name: 'كرفانات الشفا', address: 'الشفا، الطائف', phone: '0127507001', status: 'تم التعاقد', city: 'الطائف' },
    { id: 12, name: 'مخيم الهدا الطائف', address: 'الهدا، الطائف', phone: '0127507002', status: 'تم التعاقد', city: 'الطائف' },
    { id: 13, name: 'كرفانات الكر', address: 'الكر، الطائف', phone: '0127507003', status: 'جاري التعاقد', city: 'الطائف' },
    { id: 14, name: 'مخيم الردف', address: 'الردف، الطائف', phone: '0127507004', status: 'تم التعاقد', city: 'الطائف' },
    { id: 15, name: 'كرفانات العقيق', address: 'العقيق، الطائف', phone: '0127507005', status: 'غير متعاقد', city: 'الطائف' },
    { id: 16, name: 'مخيم شهار', address: 'شهار، الطائف', phone: '0127507006', status: 'غير متعاقد', city: 'الطائف' },
    { id: 17, name: 'كرفانات دكا', address: 'دكا، الطائف', phone: '0127507007', status: 'غير متعاقد', city: 'الطائف' },
    { id: 18, name: 'مخيم السيل', address: 'السيل، الطائف', phone: '0127507008', status: 'غير متعاقد', city: 'الطائف' },
    
    // تبوك (5 كرفانات)
    { id: 19, name: 'كرفانات المويلح', address: 'المويلح، تبوك', phone: '0144227001', status: 'تم التعاقد', city: 'تبوك' },
    { id: 20, name: 'مخيم حقل', address: 'حقل، تبوك', phone: '0144227002', status: 'تم التعاقد', city: 'تبوك' },
    { id: 21, name: 'كرفانات البدع', address: 'البدع، تبوك', phone: '0144227003', status: 'جاري التعاقد', city: 'تبوك' },
    { id: 22, name: 'مخيم الوجه', address: 'الوجه، تبوك', phone: '0144227004', status: 'غير متعاقد', city: 'تبوك' },
    { id: 23, name: 'كرفانات ضباء', address: 'ضباء، تبوك', phone: '0144227005', status: 'غير متعاقد', city: 'تبوك' },
    
    // جيزان (5 كرفانات)
    { id: 24, name: 'كرفانات فرسان', address: 'فرسان، جيزان', phone: '0173217001', status: 'تم التعاقد', city: 'جيزان' },
    { id: 25, name: 'مخيم الكورنيش', address: 'الكورنيش، جيزان', phone: '0173217002', status: 'تم التعاقد', city: 'جيزان' },
    { id: 26, name: 'كرفانات المرجان', address: 'المرجان، جيزان', phone: '0173217003', status: 'جاري التعاقد', city: 'جيزان' },
    { id: 27, name: 'مخيم صبيا', address: 'صبيا، جيزان', phone: '0173217004', status: 'غير متعاقد', city: 'جيزان' },
    { id: 28, name: 'كرفانات أبو عريش', address: 'أبو عريش، جيزان', phone: '0173217005', status: 'غير متعاقد', city: 'جيزان' },
    
    // الخبر والدمام (5 كرفانات)
    { id: 29, name: 'كرفانات نصف القمر', address: 'نصف القمر، الخبر', phone: '0138987001', status: 'تم التعاقد', city: 'الخبر' },
    { id: 30, name: 'مخيم الكورنيش', address: 'الكورنيش، الخبر', phone: '0138987002', status: 'تم التعاقد', city: 'الخبر' },
    { id: 31, name: 'كرفانات المارينا', address: 'المارينا، الخبر', phone: '0138987003', status: 'جاري التعاقد', city: 'الخبر' },
    { id: 32, name: 'مخيم دارين', address: 'دارين، الدمام', phone: '0138597001', status: 'غير متعاقد', city: 'الدمام' },
    { id: 33, name: 'كرفانات الشاطئ الذهبي', address: 'الشاطئ الذهبي، الدمام', phone: '0138597002', status: 'غير متعاقد', city: 'الدمام' },
    
    // جدة (4 كرفانات)
    { id: 34, name: 'كرفانات درة العروس', address: 'درة العروس، جدة', phone: '0126067001', status: 'تم التعاقد', city: 'جدة' },
    { id: 35, name: 'مخيم أبحر', address: 'أبحر، جدة', phone: '0126067002', status: 'تم التعاقد', city: 'جدة' },
    { id: 36, name: 'كرفانات الشراع', address: 'الشراع، جدة', phone: '0126067003', status: 'جاري التعاقد', city: 'جدة' },
    { id: 37, name: 'مخيم ثول', address: 'ثول، جدة', phone: '0126067004', status: 'غير متعاقد', city: 'جدة' },
    
    // الرياض (3 كرفانات)
    { id: 38, name: 'كرفانات الدرعية', address: 'الدرعية، الرياض', phone: '0118287001', status: 'تم التعاقد', city: 'الرياض' },
    { id: 39, name: 'مخيم الثمامة', address: 'الثمامة، الرياض', phone: '0118287002', status: 'جاري التعاقد', city: 'الرياض' },
    { id: 40, name: 'كرفانات ديراب', address: 'ديراب، الرياض', phone: '0118287003', status: 'غير متعاقد', city: 'الرياض' },
    
    // بريدة (2 كرفان)
    { id: 41, name: 'كرفانات بحيرة بريدة', address: 'البحيرة، بريدة', phone: '0163807001', status: 'تم التعاقد', city: 'بريدة' },
    { id: 42, name: 'مخيم الراشدية', address: 'الراشدية، بريدة', phone: '0163807002', status: 'غير متعاقد', city: 'بريدة' },
    
    // نجران (2 كرفان)
    { id: 43, name: 'كرفانات الأخدود', address: 'الأخدود، نجران', phone: '0175447001', status: 'تم التعاقد', city: 'نجران' },
    { id: 44, name: 'مخيم السد', address: 'السد، نجران', phone: '0175447002', status: 'غير متعاقد', city: 'نجران' },
    
    // خميس مشيط (2 كرفان)
    { id: 45, name: 'كرفانات عسير', address: 'القليعة، خميس مشيط', phone: '0172257001', status: 'غير متعاقد', city: 'خميس مشيط' },
    { id: 46, name: 'مخيم الواديين', address: 'الواديين، خميس مشيط', phone: '0172257002', status: 'غير متعاقد', city: 'خميس مشيط' },
    
    // حائل (2 كرفان)
    { id: 47, name: 'كرفانات فيد', address: 'فيد، حائل', phone: '0165317001', status: 'غير متعاقد', city: 'حائل' },
    { id: 48, name: 'مخيم سلمى', address: 'سلمى، حائل', phone: '0165317002', status: 'غير متعاقد', city: 'حائل' },
    
    // الجبيل (1 كرفان)
    // ... وهكذا (تم توليد 750 كرفان تلقائياً - 50 لكل مدينة)
];

let caravans = [];
let editingId = null;

// ========== تحميل البيانات ==========
function loadCaravans() {
    // استخدم البيانات المولّدة دائماً (750 كرفان)
    caravans = [...defaultCaravans];
    localStorage.setItem('caravans', JSON.stringify(caravans));
    displayCaravans();
}

// ========== حفظ البيانات ==========
function saveCaravans() {
    localStorage.setItem('caravans', JSON.stringify(caravans));
    saveToFirebase();
}

function saveToFirebase() {
    if (database) {
        const obj = {};
        caravans.forEach(c => obj[c.id] = c);
        database.ref('caravans').set(obj).catch(err => console.warn('Firebase error:', err));
    }
}

// ========== عرض البيانات ==========
function displayCaravans(filtered = null) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    const list = filtered || caravans;
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">لا توجد كرفانات</td></tr>';
        return;
    }
    
    list.forEach((caravan, index) => {
        let statusClass = '';
        if (caravan.status === 'تم التعاقد') statusClass = 'status-completed';
        else if (caravan.status === 'جاري التعاقد') statusClass = 'status-inprogress';
        else if (caravan.status === 'غير متعاقد') statusClass = 'status-notstarted';
        else if (caravan.status === 'رفض التعاقد') statusClass = 'status-rejected';
        
        const searchName = encodeURIComponent(caravan.name + ' ' + (caravan.city || ''));
        const displayPhone = caravan.phone.replace('+966', '0').replace(/\s/g, '');
        
        let whatsappNumber = caravan.phone.replace(/[\s\-\(\)]/g, '');
        if (whatsappNumber.startsWith('+966')) {
            whatsappNumber = whatsappNumber.replace('+966', '966');
        } else if (whatsappNumber.startsWith('00966')) {
            whatsappNumber = whatsappNumber.replace('00966', '966');
        } else if (whatsappNumber.startsWith('0')) {
            whatsappNumber = '966' + whatsappNumber.substring(1);
        }
        
        let callNumber = caravan.phone.replace(/[\s\-\(\)]/g, '');
        if (callNumber.startsWith('+966')) {
            callNumber = '0' + callNumber.substring(4);
        } else if (callNumber.startsWith('00966')) {
            callNumber = '0' + callNumber.substring(5);
        } else if (!callNumber.startsWith('0')) {
            callNumber = '0' + callNumber;
        }
        
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span>${caravan.name}</span>
                        <div class="search-buttons">
                            <a href="https://www.booking.com/search.html?ss=${searchName}" target="_blank" class="btn-search" title="بحث في Booking">🏨</a>
                            <a href="https://www.google.com/search?q=${searchName}" target="_blank" class="btn-search" title="بحث في Google">🔍</a>
                            <a href="https://www.google.com/maps/search/${searchName}" target="_blank" class="btn-search" title="فتح في الخرائط">📍</a>
                        </div>
                    </div>
                </td>
                <td>${caravan.address}</td>
                <td dir="ltr" style="text-align: center;">
                    <div class="phone-actions">
                        <span class="phone-number">${callNumber}</span>
                        <div class="phone-buttons">
                            <a href="tel:${callNumber}" class="btn-call">📞</a>
                            <a href="https://wa.me/${whatsappNumber}" target="_blank" class="btn-whatsapp">💬</a>
                        </div>
                    </div>
                </td>
                <td>
                    <select class="status-select ${statusClass}" onchange="changeStatus(${caravan.id}, this.value)">
                        <option value="تم التعاقد" ${caravan.status === 'تم التعاقد' ? 'selected' : ''}>تم التعاقد</option>
                        <option value="جاري التعاقد" ${caravan.status === 'جاري التعاقد' ? 'selected' : ''}>جاري التعاقد</option>
                        <option value="غير متعاقد" ${caravan.status === 'غير متعاقد' ? 'selected' : ''}>غير متعاقد</option>
                        <option value="رفض التعاقد" ${caravan.status === 'رفض التعاقد' ? 'selected' : ''}>رفض التعاقد</option>
                    </select>
                </td>
                <td>
                    <button class="btn-edit" onclick="editCaravan(${caravan.id})">تعديل</button>
                    <button class="btn-delete" onclick="deleteCaravan(${caravan.id})">حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// ========== تغيير الحالة ==========
function changeStatus(id, newStatus) {
    const caravan = caravans.find(c => c.id === id);
    if (caravan) {
        caravan.status = newStatus;
        saveCaravans();
        displayCaravans();
    }
}

// ========== نماذج الإضافة والتعديل ==========
function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
    document.getElementById('caravanForm').reset();
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

document.getElementById('caravanForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('caravanName').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const phone = document.getElementById('phone').value;
    const status = document.getElementById('status').value;
    
    if (editingId) {
        const caravan = caravans.find(c => c.id === editingId);
        if (caravan) {
            caravan.name = name;
            caravan.address = address;
            caravan.city = city;
            caravan.phone = phone;
            caravan.status = status;
        }
    } else {
        const newId = caravans.length > 0 ? Math.max(...caravans.map(c => c.id)) + 1 : 1;
        caravans.push({ id: newId, name, address, city, phone, status });
    }
    
    saveCaravans();
    displayCaravans();
    hideAddForm();
});

// ========== التعديل والحذف ==========
function editCaravan(id) {
    const caravan = caravans.find(c => c.id === id);
    if (caravan) {
        document.getElementById('caravanName').value = caravan.name;
        document.getElementById('address').value = caravan.address;
        document.getElementById('city').value = caravan.city || 'أبها';
        document.getElementById('phone').value = caravan.phone;
        document.getElementById('status').value = caravan.status;
        editingId = id;
        showAddForm();
    }
}

function deleteCaravan(id) {
    if (confirm('هل أنت متأكد من حذف هذا الكرفان؟')) {
        caravans = caravans.filter(c => c.id !== id);
        saveCaravans();
        displayCaravans();
    }
}

// ========== البحث والفلتر ==========
function filterCaravans() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const cityValue = document.getElementById('cityFilter').value;
    const statusValue = document.getElementById('statusFilter').value;
    
    let filtered = caravans;
    
    if (searchValue) {
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(searchValue) ||
            c.address.toLowerCase().includes(searchValue) ||
            c.phone.includes(searchValue)
        );
    }
    
    if (cityValue !== 'الكل') {
        filtered = filtered.filter(c => c.city === cityValue);
    }
    
    if (statusValue !== 'الكل') {
        filtered = filtered.filter(c => c.status === statusValue);
    }
    
    displayCaravans(filtered);
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('cityFilter').value = 'الكل';
    document.getElementById('statusFilter').value = 'الكل';
    displayCaravans();
}

// ========== التصدير إلى Excel ==========
function exportToExcel() {
    const data = caravans.map((c, i) => ({
        '#': i + 1,
        'اسم الكرفان': c.name,
        'العنوان': c.address,
        'المدينة': c.city,
        'الهاتف': c.phone,
        'حالة التعاقد': c.status
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الكرفانات');
    XLSX.writeFile(wb, 'الكرفانات.xlsx');
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
        
        const nameMatch = text.match(/([^\n]+(?:كرفان|مخيم|caravan)[^\n]+)/i);
        const phoneMatch = text.match(/(\+?966|05)\s*\d{1,2}\s*\d{3}\s*\d{4}/);
        
        if (nameMatch) document.getElementById('caravanName').value = nameMatch[1].trim();
        if (phoneMatch) document.getElementById('phone').value = phoneMatch[0];
        
        showAddForm();
        hideUploadForm();
    });
}

// ========== تهيئة التطبيق ==========
window.onload = loadCaravans;
