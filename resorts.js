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

// ========== مولد البيانات الديناميكي - 50 منتجع لكل مدينة (750 منتجع) ==========
const CITIES = ['الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الطائف', 'تبوك', 'بريدة', 'خميس مشيط', 'أبها', 'نجران', 'جيزان', 'حائل', 'الخبر', 'الجبيل'];
const CITY_CODES = {'الرياض':'011','جدة':'012','مكة':'012','المدينة':'014','الدمام':'013','الطائف':'012','تبوك':'014','بريدة':'016','خميس مشيط':'017','أبها':'017','نجران':'017','جيزان':'017','حائل':'016','الخبر':'013','الجبيل':'013'};

const RESORT_NAMES = [
    'منتجع الشاطئ','منتجع البحيرة','منتجع الجبل','منتجع الغابة','منتجع الواحة','ريزورت النخيل','ريزورت المرجان','ريزورت اللؤلؤ','ريزورت الفيروز','ريزورت السماء',
    'منتجع الأفق','منتجع الغروب','منتجع الشروق','منتجع السحاب','منتجع النسيم','شاليهات الربيع','شاليهات الخريف','شاليهات الصيف','شاليهات الشتاء','شاليهات الجنة',
    'منتجع الطبيعة','منتجع الهدوء','منتجع السكون','منتجع الراحة','منتجع الاسترخاء','ريزورت الفخامة','ريزورت الرفاهية','ريزورت الأناقة','ريزورت الجمال','ريزورت السحر',
    'منتجع الزمرد','منتجع الياقوت','منتجع العقيق','منتجع المها','منتجع الغزال','شاليهات الصحراء','شاليهات الكثبان','شاليهات البرية','شاليهات الوديان','شاليهات السهول',
    'منتجع النجوم','منتجع القمر','منتجع الشمس','منتجع الكواكب','منتجع الأفلاك','ريزورت الأحلام','ريزورت الخيال','ريزورت السعادة','ريزورت البهجة','ريزورت المتعة'
];

const NEIGHBORHOODS = [
    'حي المروج','حي النخيل','حي الورود','حي الريحان','حي الياسمين','حي الربيع','حي الخريف','حي النسيم','حي السلام','حي الأمل',
    'حي النور','حي الهدى','حي الفيحاء','حي الزهراء','حي الرياض','حي العليا','حي الملز','حي السليمانية','حي المعذر','حي الروضة',
    'حي الشفا','حي الصفا','حي المروة','حي النسيم','حي الربوة','حي الخالدية','حي العزيزية','حي النزهة','حي الفيصلية','حي الملك فهد',
    'حي الملك عبدالله','حي الملك عبدالعزيز','حي الأمير سلطان','حي الأمير محمد','حي الأمير فيصل','حي الحمراء','حي الأندلس','حي قرطبة','حي غرناطة','حي إشبيلية',
    'حي المنار','حي الفجر','حي الشروق','حي الغروب','حي الأفق','حي البحيرة','حي الواحة','حي الروضة','حي البستان','حي الحديقة'
];

function generateResortsData() {
    const data = [];
    let id = 1;
    CITIES.forEach(city => {
        const code = CITY_CODES[city];
        for (let i = 0; i < 50; i++) {
            const status = i < 15 ? 'تم التعاقد' : (i < 30 ? 'جاري التعاقد' : (i < 45 ? 'غير متعاقد' : 'رفض التعاقد'));
            data.push({
                id: id++,
                name: RESORT_NAMES[i % RESORT_NAMES.length],
                address: `${NEIGHBORHOODS[i % NEIGHBORHOODS.length]}، ${city}`,
                city: city,
                phone: `0${code}${4000000 + (i * 1000)}`,
                status: status
            });
        }
    });
    return data;
}

const defaultResorts = generateResortsData();

// بيانات قديمة محفوظة للمرجع
const oldSampleResorts = [
    // أبها (10 منتجعات)
    { id: 1, name: 'منتجع أنانتارا الجبل الأخضر', address: 'الجبل الأخضر، أبها', phone: '0172408888', status: 'تم التعاقد', city: 'أبها' },
    { id: 2, name: 'منتجع السودة', address: 'منطقة السودة السياحية، أبها', phone: '0554442001', status: 'تم التعاقد', city: 'أبها' },
    { id: 3, name: 'منتجع قمم السروات', address: 'طريق السودة، أبها', phone: '0554442002', status: 'جاري التعاقد', city: 'أبها' },
    { id: 4, name: 'شاليهات الهدا', address: 'منطقة الهدا، أبها', phone: '0554442003', status: 'تم التعاقد', city: 'أبها' },
    { id: 5, name: 'منتجع الضباب', address: 'حي الضباب، أبها', phone: '0554442004', status: 'جاري التعاقد', city: 'أبها' },
    { id: 6, name: 'منتجع أبها الجديدة', address: 'أبها الجديدة، أبها', phone: '0554442005', status: 'تم التعاقد', city: 'أبها' },
    { id: 7, name: 'شاليهات الحبلة', address: 'منطقة الحبلة السياحية، أبها', phone: '0554442006', status: 'غير متعاقد', city: 'أبها' },
    { id: 8, name: 'منتجع الروشن', address: 'حي الروشن، أبها', phone: '0554442007', status: 'غير متعاقد', city: 'أبها' },
    { id: 9, name: 'منتجع الجرة', address: 'منطقة الجرة، أبها', phone: '0554442008', status: 'غير متعاقد', city: 'أبها' },
    { id: 10, name: 'شاليهات الشلال', address: 'قرب الشلال، أبها', phone: '0554442009', status: 'غير متعاقد', city: 'أبها' },
    
    // الطائف (8 منتجعات)
    { id: 11, name: 'منتجع الشفا', address: 'الشفا، الطائف', phone: '0127335555', status: 'تم التعاقد', city: 'الطائف' },
    { id: 12, name: 'شاليهات الهدا الطائف', address: 'الهدا، الطائف', phone: '0127336666', status: 'تم التعاقد', city: 'الطائف' },
    { id: 13, name: 'منتجع الكر السياحي', address: 'الكر، الطائف', phone: '0127337777', status: 'جاري التعاقد', city: 'الطائف' },
    { id: 14, name: 'شاليهات الردف', address: 'الردف، الطائف', phone: '0127338888', status: 'تم التعاقد', city: 'الطائف' },
    { id: 15, name: 'منتجع العقيق', address: 'العقيق، الطائف', phone: '0127339999', status: 'غير متعاقد', city: 'الطائف' },
    { id: 16, name: 'شاليهات الطائف الورد', address: 'شهار، الطائف', phone: '0127501111', status: 'غير متعاقد', city: 'الطائف' },
    { id: 17, name: 'منتجع جبل دكا', address: 'دكا، الطائف', phone: '0127502222', status: 'غير متعاقد', city: 'الطائف' },
    { id: 18, name: 'شاليهات السيل', address: 'السيل، الطائف', phone: '0127503333', status: 'غير متعاقد', city: 'الطائف' },
    
    // تبوك (5 منتجعات)
    { id: 19, name: 'منتجع شاطئ المويلح', address: 'المويلح، تبوك', phone: '0144228888', status: 'تم التعاقد', city: 'تبوك' },
    { id: 20, name: 'شاليهات حقل البحرية', address: 'حقل، تبوك', phone: '0144229999', status: 'تم التعاقد', city: 'تبوك' },
    { id: 21, name: 'منتجع البدع', address: 'البدع، تبوك', phone: '0144221111', status: 'جاري التعاقد', city: 'تبوك' },
    { id: 22, name: 'شاليهات الوجه', address: 'الوجه، تبوك', phone: '0144222222', status: 'غير متعاقد', city: 'تبوك' },
    { id: 23, name: 'منتجع ضباء السياحي', address: 'ضباء، تبوك', phone: '0144223333', status: 'غير متعاقد', city: 'تبوك' },
    
    // جيزان (5 منتجعات)
    { id: 24, name: 'منتجع جزر فرسان', address: 'جزر فرسان، جيزان', phone: '0173218888', status: 'تم التعاقد', city: 'جيزان' },
    { id: 25, name: 'شاليهات الكورنيش', address: 'الكورنيش، جيزان', phone: '0173219999', status: 'تم التعاقد', city: 'جيزان' },
    { id: 26, name: 'منتجع المرجان البحري', address: 'الشاطئ الشمالي، جيزان', phone: '0173211111', status: 'جاري التعاقد', city: 'جيزان' },
    { id: 27, name: 'شاليهات صبيا', address: 'صبيا، جيزان', phone: '0173212222', status: 'غير متعاقد', city: 'جيزان' },
    { id: 28, name: 'منتجع أبو عريش', address: 'أبو عريش، جيزان', phone: '0173213333', status: 'غير متعاقد', city: 'جيزان' },
    
    // الخبر والدمام (5 منتجعات)
    { id: 29, name: 'منتجع نصف القمر', address: 'شاطئ نصف القمر، الخبر', phone: '0138988888', status: 'تم التعاقد', city: 'الخبر' },
    { id: 30, name: 'شاليهات الكورنيش', address: 'الكورنيش، الخبر', phone: '0138989999', status: 'تم التعاقد', city: 'الخبر' },
    { id: 31, name: 'منتجع المارينا', address: 'المارينا، الخبر', phone: '0138981111', status: 'جاري التعاقد', city: 'الخبر' },
    { id: 32, name: 'شاليهات دارين', address: 'جزيرة دارين، الدمام', phone: '0138598888', status: 'غير متعاقد', city: 'الدمام' },
    { id: 33, name: 'منتجع الشاطئ الذهبي', address: 'الكورنيش، الدمام', phone: '0138599999', status: 'غير متعاقد', city: 'الدمام' },
    
    // جدة (4 منتجعات)
    { id: 34, name: 'منتجع درة العروس', address: 'شمال جدة، جدة', phone: '0126061111', status: 'تم التعاقد', city: 'جدة' },
    { id: 35, name: 'شاليهات أبحر', address: 'أبحر الشمالية، جدة', phone: '0126062222', status: 'تم التعاقد', city: 'جدة' },
    { id: 36, name: 'منتجع الشراع', address: 'الكورنيش، جدة', phone: '0126063333', status: 'جاري التعاقد', city: 'جدة' },
    { id: 37, name: 'شاليهات ثول', address: 'ثول، جدة', phone: '0126064444', status: 'غير متعاقد', city: 'جدة' },
    
    // الرياض (3 منتجعات)
    { id: 38, name: 'منتجع الدرعية', address: 'الدرعية، الرياض', phone: '0118280001', status: 'تم التعاقد', city: 'الرياض' },
    { id: 39, name: 'شاليهات الثمامة', address: 'الثمامة، الرياض', phone: '0118280002', status: 'جاري التعاقد', city: 'الرياض' },
    { id: 40, name: 'منتجع ديراب', address: 'ديراب، الرياض', phone: '0118280003', status: 'غير متعاقد', city: 'الرياض' },
    
    // بريدة (2 منتجع)
    { id: 41, name: 'منتجع بحيرة بريدة', address: 'البحيرة، بريدة', phone: '0163800001', status: 'تم التعاقد', city: 'بريدة' },
    { id: 42, name: 'شاليهات الراشدية', address: 'الراشدية، بريدة', phone: '0163800002', status: 'غير متعاقد', city: 'بريدة' },
    
    // نجران (2 منتجع)
    { id: 43, name: 'منتجع الأخدود', address: 'الأخدود، نجران', phone: '0175448881', status: 'تم التعاقد', city: 'نجران' },
    { id: 44, name: 'شاليهات السد', address: 'السد، نجران', phone: '0175448882', status: 'غير متعاقد', city: 'نجران' },
    
    // خميس مشيط (2 منتجع)
    { id: 45, name: 'منتجع عسير الخضراء', address: 'حي القليعة، خميس مشيط', phone: '0172258881', status: 'غير متعاقد', city: 'خميس مشيط' },
    { id: 46, name: 'شاليهات الواديين', address: 'وادي بيش، خميس مشيط', phone: '0172258882', status: 'غير متعاقد', city: 'خميس مشيط' },
    
    // حائل (2 منتجع)
    { id: 47, name: 'منتجع فيد التاريخي', address: 'فيد، حائل', phone: '0165318881', status: 'غير متعاقد', city: 'حائل' },
    { id: 48, name: 'شاليهات سلمى', address: 'جبل سلمى، حائل', phone: '0165318882', status: 'غير متعاقد', city: 'حائل' },
    
    // الجبيل (1 منتجع)
    // ... وهكذا (تم توليد 750 منتجع تلقائياً - 50 لكل مدينة)
];

let resorts = [];
let editingId = null;

// ========== تحميل البيانات ==========
function loadResorts() {
    const saved = localStorage.getItem('resorts');
    if (saved) {
        resorts = JSON.parse(saved);
    } else {
        resorts = [...defaultResorts];
    }
    
    if (database) {
        database.ref('resorts').once('value').then(snapshot => {
            const data = snapshot.val();
            if (data && Object.keys(data).length > 0) {
                const firebaseResorts = Object.values(data);
                resorts = firebaseResorts;
                localStorage.setItem('resorts', JSON.stringify(resorts));
            } else {
                saveToFirebase();
            }
            displayResorts();
        }).catch(error => {
            console.error('خطأ في Firebase:', error);
            displayResorts();
        });
    } else {
        displayResorts();
    }
}

// ========== حفظ البيانات ==========
function saveResorts() {
    localStorage.setItem('resorts', JSON.stringify(resorts));
    saveToFirebase();
}

function saveToFirebase() {
    if (database) {
        const obj = {};
        resorts.forEach(r => obj[r.id] = r);
        database.ref('resorts').set(obj).catch(err => console.warn('Firebase error:', err));
    }
}

// ========== عرض البيانات ==========
function displayResorts(filtered = null) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    const list = filtered || resorts;
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">لا توجد منتجعات</td></tr>';
        return;
    }
    
    list.forEach((resort, index) => {
        let statusClass = '';
        if (resort.status === 'تم التعاقد') statusClass = 'status-completed';
        else if (resort.status === 'جاري التعاقد') statusClass = 'status-inprogress';
        else if (resort.status === 'غير متعاقد') statusClass = 'status-notstarted';
        else if (resort.status === 'رفض التعاقد') statusClass = 'status-rejected';
        
        const searchName = encodeURIComponent(resort.name + ' ' + (resort.city || ''));
        const displayPhone = resort.phone.replace('+966', '0').replace(/\s/g, '');
        
        let whatsappNumber = resort.phone.replace(/[\s\-\(\)]/g, '');
        if (whatsappNumber.startsWith('+966')) {
            whatsappNumber = whatsappNumber.replace('+966', '966');
        } else if (whatsappNumber.startsWith('00966')) {
            whatsappNumber = whatsappNumber.replace('00966', '966');
        } else if (whatsappNumber.startsWith('0')) {
            whatsappNumber = '966' + whatsappNumber.substring(1);
        }
        
        let callNumber = resort.phone.replace(/[\s\-\(\)]/g, '');
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
                        <span>${resort.name}</span>
                        <div class="search-buttons">
                            <a href="https://www.booking.com/search.html?ss=${searchName}" target="_blank" class="btn-search" title="بحث في Booking">🏨</a>
                            <a href="https://www.google.com/search?q=${searchName}" target="_blank" class="btn-search" title="بحث في Google">🔍</a>
                            <a href="https://www.google.com/maps/search/${searchName}" target="_blank" class="btn-search" title="فتح في الخرائط">📍</a>
                        </div>
                    </div>
                </td>
                <td>${resort.address}</td>
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
                    <select class="status-select ${statusClass}" onchange="changeStatus(${resort.id}, this.value)">
                        <option value="تم التعاقد" ${resort.status === 'تم التعاقد' ? 'selected' : ''}>تم التعاقد</option>
                        <option value="جاري التعاقد" ${resort.status === 'جاري التعاقد' ? 'selected' : ''}>جاري التعاقد</option>
                        <option value="غير متعاقد" ${resort.status === 'غير متعاقد' ? 'selected' : ''}>غير متعاقد</option>
                        <option value="رفض التعاقد" ${resort.status === 'رفض التعاقد' ? 'selected' : ''}>رفض التعاقد</option>
                    </select>
                </td>
                <td>
                    <button class="btn-edit" onclick="editResort(${resort.id})">تعديل</button>
                    <button class="btn-delete" onclick="deleteResort(${resort.id})">حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// ========== تغيير الحالة ==========
function changeStatus(id, newStatus) {
    const resort = resorts.find(r => r.id === id);
    if (resort) {
        resort.status = newStatus;
        saveResorts();
        displayResorts();
    }
}

// ========== نماذج الإضافة والتعديل ==========
function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
    document.getElementById('resortForm').reset();
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

document.getElementById('resortForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('resortName').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const phone = document.getElementById('phone').value;
    const status = document.getElementById('status').value;
    
    if (editingId) {
        const resort = resorts.find(r => r.id === editingId);
        if (resort) {
            resort.name = name;
            resort.address = address;
            resort.city = city;
            resort.phone = phone;
            resort.status = status;
        }
    } else {
        const newId = resorts.length > 0 ? Math.max(...resorts.map(r => r.id)) + 1 : 1;
        resorts.push({ id: newId, name, address, city, phone, status });
    }
    
    saveResorts();
    displayResorts();
    hideAddForm();
});

// ========== التعديل والحذف ==========
function editResort(id) {
    const resort = resorts.find(r => r.id === id);
    if (resort) {
        document.getElementById('resortName').value = resort.name;
        document.getElementById('address').value = resort.address;
        document.getElementById('city').value = resort.city || 'أبها';
        document.getElementById('phone').value = resort.phone;
        document.getElementById('status').value = resort.status;
        editingId = id;
        showAddForm();
    }
}

function deleteResort(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتجع؟')) {
        resorts = resorts.filter(r => r.id !== id);
        saveResorts();
        displayResorts();
    }
}

// ========== البحث والفلتر ==========
function filterResorts() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const cityValue = document.getElementById('cityFilter').value;
    const statusValue = document.getElementById('statusFilter').value;
    
    let filtered = resorts;
    
    if (searchValue) {
        filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(searchValue) ||
            r.address.toLowerCase().includes(searchValue) ||
            r.phone.includes(searchValue)
        );
    }
    
    if (cityValue !== 'الكل') {
        filtered = filtered.filter(r => r.city === cityValue);
    }
    
    if (statusValue !== 'الكل') {
        filtered = filtered.filter(r => r.status === statusValue);
    }
    
    displayResorts(filtered);
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('cityFilter').value = 'الكل';
    document.getElementById('statusFilter').value = 'الكل';
    displayResorts();
}

// ========== التصدير إلى Excel ==========
function exportToExcel() {
    const data = resorts.map((r, i) => ({
        '#': i + 1,
        'اسم المنتجع': r.name,
        'العنوان': r.address,
        'المدينة': r.city,
        'الهاتف': r.phone,
        'حالة التعاقد': r.status
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المنتجعات');
    XLSX.writeFile(wb, 'المنتجعات.xlsx');
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
        
        const nameMatch = text.match(/([^\n]+(?:منتجع|شاليه|ريزورت|resort)[^\n]+)/i);
        const phoneMatch = text.match(/(\+?966|05)\s*\d{1,2}\s*\d{3}\s*\d{4}/);
        
        if (nameMatch) document.getElementById('resortName').value = nameMatch[1].trim();
        if (phoneMatch) document.getElementById('phone').value = phoneMatch[0];
        
        showAddForm();
        hideUploadForm();
    });
}

// ========== تهيئة التطبيق ==========
window.onload = loadResorts;
