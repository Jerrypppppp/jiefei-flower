// 圖片資料
const galleryImages = [
    {
        url: 'images/wedding.jpg',
        title: '婚禮花藝',
        category: '婚禮'
    },
    {
        url: 'images/space.jpg',
        title: '空間佈置',
        category: '空間'
    },
    {
        url: 'images/gift.jpg',
        title: '花禮設計',
        category: '花禮'
    }
];

// 載入圖片到作品集
function loadGalleryImages() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    galleryImages.forEach(image => {
        const imageElement = document.createElement('div');
        imageElement.className = 'relative group overflow-hidden rounded-lg shadow-lg';
        imageElement.innerHTML = `
            <img src="${image.url}" alt="${image.title}" class="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300">
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div class="text-white text-center">
                    <h3 class="text-xl font-bold mb-2">${image.title}</h3>
                    <p class="text-sm">${image.category}</p>
                </div>
            </div>
        `;
        galleryGrid.appendChild(imageElement);
    });
}

// 當頁面載入完成時執行
document.addEventListener('DOMContentLoaded', () => {
    loadGalleryImages();
}); 