// گالری تصاویر
Fancybox.bind("[data-fancybox]", {
    loop: true,
    buttons: ["zoom", "slideShow", "fullScreen", "close"],
    animationEffect: "fade"
});

// نقشه گوگل
function initMap() {
    const propertyLocation = { lat: 35.7219, lng: 51.3347 };
    const map = new google.maps.Map(document.getElementById('propertyMap'), {
        zoom: 15,
        center: propertyLocation,
    });

    new google.maps.Marker({
        position: propertyLocation,
        map: map,
        title: 'موقعیت ملک'
    });
}

// محاسبه اقساط وام
function calculateMortgage() {
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const term = parseFloat(document.getElementById('loanTerm').value);
    const rate = parseFloat(document.getElementById('interestRate').value) / 100 / 12;
    
    if (isNaN(amount) || isNaN(term) || isNaN(rate)) {
        alert('لطفا تمام مقادیر را وارد کنید');
        return;
    }

    const monthlyPayment = (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - amount;

    document.getElementById('mortgageResult').innerHTML = `
        <p>پرداخت ماهیانه: ${formatNumber(monthlyPayment)} تومان</p>
        <p>کل بازپرداخت: ${formatNumber(totalPayment)} تومان</p>
        <p>کل سود: ${formatNumber(totalInterest)} تومان</p>
    `;
}

// فرمت‌بندی اعداد
function formatNumber(num) {
    return Math.round(num).toLocaleString('fa-IR');
}

// اشتراک‌گذاری
function shareProperty() {
    if (navigator.share) {
        navigator.share({
            title: 'ملک در فراملک',
            text: 'مشاهده این ملک در فراملک',
            url: window.location.href
        });
    } else {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert('لینک ملک کپی شد');
    }
}

// سیستم مقایسه
let compareList = JSON.parse(localStorage.getItem('compareList')) || [];

function addToCompare(propertyId) {
    if (compareList.includes(propertyId)) {
        compareList = compareList.filter(id => id !== propertyId);
        alert('ملک از لیست مقایسه حذف شد');
    } else {
        if (compareList.length >= 3) {
            alert('حداکثر ۳ ملک را می‌توانید مقایسه کنید');
            return;
        }
        compareList.push(propertyId);
        alert('ملک به لیست مقایسه اضافه شد');
    }
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareButton(propertyId);
}

function updateCompareButton(propertyId) {
    const btn = document.querySelector('.add-compare');
    if (compareList.includes(propertyId)) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-exchange-alt"></i> حذف از مقایسه';
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fas fa-exchange-alt"></i> افزودن به مقایسه';
    }
}

// اجرای اولیه
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    updateCompareButton(1); // شماره ملک فعلی
});