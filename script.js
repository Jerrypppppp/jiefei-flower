// Firebase 配置
const firebaseConfig = {
    // 這裡需要填入您的 Firebase 配置
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// 導航欄滾動效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }
});

// 登入彈窗控制
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');

// 檢查登入狀態
auth.onAuthStateChanged(user => {
    if (user) {
        loginBtn.textContent = '登出';
        loginBtn.onclick = () => auth.signOut();
    } else {
        loginBtn.textContent = '登入';
        loginBtn.onclick = () => {
            loginModal.classList.remove('hidden');
            loginModal.classList.add('flex');
        };
    }
});

closeModal.addEventListener('click', () => {
    loginModal.classList.add('hidden');
    loginModal.classList.remove('flex');
});

// 點擊彈窗外部關閉
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.add('hidden');
        loginModal.classList.remove('flex');
    }
});

// 平滑滾動
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 圖片配置
const galleryImages = [
    {
        url: 'images/wedding.jpg',  // 婚禮花藝圖片
        title: '婚禮花藝',
        category: '婚禮佈置'
    },
    {
        url: 'images/space.jpg',    // 空間佈置圖片
        title: '空間佈置',
        category: '室內設計'
    },
    {
        url: 'images/gift.jpg',     // 花禮設計圖片
        title: '花禮設計',
        category: '禮品花束'
    }
];

// 載入作品集圖片
function loadGalleryImages() {
    const galleryGrid = document.querySelector('#gallery-grid');
    galleryGrid.innerHTML = '';
    
    galleryImages.forEach(image => {
        const imgElement = document.createElement('div');
        imgElement.className = 'group relative overflow-hidden rounded-lg shadow-lg';
        imgElement.innerHTML = `
            <img src="${image.url}" alt="${image.title}" class="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 class="text-xl font-bold mb-2">${image.title}</h3>
                    <p class="text-sm opacity-90">${image.category}</p>
                </div>
            </div>
        `;
        galleryGrid.appendChild(imgElement);
    });
}

// 頁面加載時執行
document.addEventListener('DOMContentLoaded', loadGalleryImages);

// 移動端選單
const menuButton = document.querySelector('button.md\\:hidden');
const navLinks = document.querySelector('.hidden.md\\:flex');

menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('hidden');
    navLinks.classList.toggle('flex');
    navLinks.classList.toggle('flex-col');
    navLinks.classList.toggle('absolute');
    navLinks.classList.toggle('top-full');
    navLinks.classList.toggle('left-0');
    navLinks.classList.toggle('right-0');
    navLinks.classList.toggle('bg-white');
    navLinks.classList.toggle('p-4');
    navLinks.classList.toggle('shadow-lg');
}); 