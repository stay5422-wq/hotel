// مولد بيانات ذكي لإنشاء 50 وحدة لكل مدينة

const cities = ['الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الطائف', 'تبوك', 'بريدة', 'خميس مشيط', 'أبها', 'نجران', 'جيزان', 'حائل', 'الخبر', 'الجبيل'];

const hotelPrefixes = ['فندق', 'نزل', 'قصر', 'برج', 'فندق روز', 'فندق كراون', 'فندق غولدن', 'فندق ستار', 'فندق سيتي', 'فندق بلازا'];
const hotelNames = ['الملكي', 'الذهبي', 'الماسي', 'الفاخر', 'الراقي', 'المميز', 'العالمي', 'الكبير', 'السلطاني', 'الامبراطوري', 'الفيصلية', 'المرجان', 'اللؤلؤ', 'الياقوت', 'الزمرد', 'العقيق', 'المها', 'الغزال', 'الصقر', 'النسر'];

const apartmentPrefixes = ['شقق', 'أجنحة', 'فلل', 'شاليهات', 'أبراج'];
const apartmentNames = ['النخيل', 'الورود', 'الياسمين', 'الزهور', 'الريحان', 'البنفسج', 'الفل', 'النرجس', 'الربيع', 'الخريف', 'الصيف', 'الشتاء', 'النجوم', 'القمر', 'الشمس', 'البحر', 'الجبل', 'الوادي', 'السهل', 'الهضبة'];

const resortPrefixes = ['منتجع', 'ريزورت', 'شاليهات'];
const resortNames = ['الشاطئ', 'البحيرة', 'الجبل', 'الغابة', 'الواحة', 'النخيل', 'المرجان', 'اللؤلؤ', 'الفيروز', 'السماء', 'الأفق', 'الغروب', 'الشروق', 'السحاب', 'النسيم', 'الربيع', 'الخريف', 'الصيف', 'الشتاء', 'الجنة'];

const caravanPrefixes = ['كرفانات', 'مخيم', 'محطة'];
const caravanNames = ['الصحراء', 'الكثبان', 'البرية', 'الواحة', 'النجوم', 'الليل', 'القمر', 'الرمال', 'الهدوء', 'السكينة', 'الطبيعة', 'الجبال', 'الوديان', 'السهول', 'الهضاب', 'الشعاب', 'الغيوم', 'الأفق', 'البعيد', 'القريب'];

const neighborhoods = ['حي المروج', 'حي النخيل', 'حي الورود', 'حي الريحان', 'حي الياسمين', 'حي الربيع', 'حي الخريف', 'حي النسيم', 'حي السلام', 'حي الأمل', 'حي النور', 'حي الهدى', 'حي الفيحاء', 'حي الزهراء', 'حي الرياض', 'حي العليا', 'حي الملز', 'حي السليمانية', 'حي المعذر', 'حي الروضة'];

const statuses = ['تم التعاقد', 'جاري التعاقد', 'غير متعاقد', 'رفض التعاقد'];

// مولدات أرقام هاتف واقعية لكل مدينة
const cityPhonePrefixes = {
    'الرياض': '011',
    'جدة': '012',
    'مكة': '012',
    'المدينة': '014',
    'الدمام': '013',
    'الطائف': '012',
    'تبوك': '014',
    'بريدة': '016',
    'خميس مشيط': '017',
    'أبها': '017',
    'نجران': '017',
    'جيزان': '017',
    'حائل': '016',
    'الخبر': '013',
    'الجبيل': '013'
};

function generatePhone(city) {
    const prefix = cityPhonePrefixes[city] || '011';
    const number = Math.floor(Math.random() * 9000000) + 1000000;
    return `0${prefix}${number}`.substring(0, 10);
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateHotels() {
    const hotels = [];
    let id = 1;
    
    cities.forEach(city => {
        for (let i = 0; i < 50; i++) {
            const prefix = getRandomItem(hotelPrefixes);
            const name = getRandomItem(hotelNames);
            const neighborhood = getRandomItem(neighborhoods);
            const status = i < 15 ? 'تم التعاقد' : (i < 30 ? 'جاري التعاقد' : (i < 45 ? 'غير متعاقد' : 'رفض التعاقد'));
            
            hotels.push({
                id: id++,
                name: `${prefix} ${name} ${city}`,
                address: `${neighborhood}، ${city}`,
                city: city,
                phone: generatePhone(city),
                status: status
            });
        }
    });
    
    return hotels;
}

function generateApartments() {
    const apartments = [];
    let id = 1;
    
    cities.forEach(city => {
        for (let i = 0; i < 50; i++) {
            const prefix = getRandomItem(apartmentPrefixes);
            const name = getRandomItem(apartmentNames);
            const neighborhood = getRandomItem(neighborhoods);
            const status = i < 15 ? 'تم التعاقد' : (i < 30 ? 'جاري التعاقد' : (i < 45 ? 'غير متعاقد' : 'رفض التعاقد'));
            
            apartments.push({
                id: id++,
                name: `${prefix} ${name}`,
                address: `${neighborhood}، ${city}`,
                city: city,
                phone: generatePhone(city),
                status: status
            });
        }
    });
    
    return apartments;
}

function generateResorts() {
    const resorts = [];
    let id = 1;
    
    cities.forEach(city => {
        for (let i = 0; i < 50; i++) {
            const prefix = getRandomItem(resortPrefixes);
            const name = getRandomItem(resortNames);
            const neighborhood = getRandomItem(neighborhoods);
            const status = i < 15 ? 'تم التعاقد' : (i < 30 ? 'جاري التعاقد' : (i < 45 ? 'غير متعاقد' : 'رفض التعاقد'));
            
            resorts.push({
                id: id++,
                name: `${prefix} ${name}`,
                address: `${neighborhood}، ${city}`,
                city: city,
                phone: generatePhone(city),
                status: status
            });
        }
    });
    
    return resorts;
}

function generateCaravans() {
    const caravans = [];
    let id = 1;
    
    cities.forEach(city => {
        for (let i = 0; i < 50; i++) {
            const prefix = getRandomItem(caravanPrefixes);
            const name = getRandomItem(caravanNames);
            const neighborhood = getRandomItem(neighborhoods);
            const status = i < 15 ? 'تم التعاقد' : (i < 30 ? 'جاري التعاقد' : (i < 45 ? 'غير متعاقد' : 'رفض التعاقد'));
            
            caravans.push({
                id: id++,
                name: `${prefix} ${name}`,
                address: `${neighborhood}، ${city}`,
                city: city,
                phone: generatePhone(city),
                status: status
            });
        }
    });
    
    return caravans;
}

// توليد البيانات وطباعتها
console.log('=== Hotels Data ===');
console.log('const defaultHotels = ' + JSON.stringify(generateHotels(), null, 2) + ';');
console.log('\n\n=== Apartments Data ===');
console.log('const defaultApartments = ' + JSON.stringify(generateApartments(), null, 2) + ';');
console.log('\n\n=== Resorts Data ===');
console.log('const defaultResorts = ' + JSON.stringify(generateResorts(), null, 2) + ';');
console.log('\n\n=== Caravans Data ===');
console.log('const defaultCaravans = ' + JSON.stringify(generateCaravans(), null, 2) + ';');
