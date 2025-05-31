// 導航欄滾動效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
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

// 從 JSON 加載作品集圖片
async function loadGalleryImages() {
    try {
        const response = await fetch('images.json');
        const data = await response.json();
        const galleryGrid = document.querySelector('#gallery-grid');
        
        // 清空現有內容
        galleryGrid.innerHTML = '';
        
        // 只顯示 active 為 true 的圖片
        data.gallery.filter(image => image.active).forEach(image => {
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
    } catch (error) {
        console.error('Error loading gallery images:', error);
    }
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