// Firestore 讀取圖片
import { getFirestore, collection, getDocs, orderBy, query, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDY5m6pnu4bqaQUsmr27j4SIkWIfsawfPk",
    authDomain: "jiefei-flower.firebaseapp.com",
    projectId: "jiefei-flower",
    storageBucket: "jiefei-flower.appspot.com",
    messagingSenderId: "761028186679",
    appId: "1:761028186679:web:19b10716623861fc48a5b2",
    measurementId: "G-G6FXQPJPPV"
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const serviceTypes = [
  { key: 'space', label: '空間花藝設計佈置' },
  { key: 'wedding', label: '婚禮花藝設計佈置' },
  { key: 'business', label: '企業／門市週花服務' },
  { key: 'gift', label: '花禮' },
  { key: 'course', label: '花藝課程' },
  { key: 'microgarden', label: '花圃微景觀設計施作' }
];

// 儲存分類圖片
let serviceImagesByType = {};
serviceTypes.forEach(t => serviceImagesByType[t.key] = []);

async function loadGalleryImages() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    const q = query(collection(db, 'images'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
        const image = doc.data();
        const imageElement = document.createElement('div');
        imageElement.className = 'relative overflow-hidden rounded-lg shadow-lg flex-shrink-0 w-72 md:w-auto';
        imageElement.style.scrollSnapAlign = 'start';
        imageElement.innerHTML = `
            <img src="${image.url}" alt="${image.title}" class="w-full h-64 object-cover cursor-zoom-in rounded-t-lg" data-lightbox="gallery">
            <div class="bg-white text-center py-2 px-2 rounded-b-lg border-t border-gray-100">
                <span class="block text-base font-semibold text-gray-700 tracking-wide truncate">${image.title || ''}</span>
            </div>
        `;
        // 點擊圖片開啟 lightbox
        imageElement.querySelector('img').addEventListener('click', function() {
            const imgs = Array.from(document.querySelectorAll('#gallery-grid img')).map(img => img.src);
            const idx = imgs.indexOf(this.src);
            openLightbox(imgs, idx);
        });
        galleryGrid.appendChild(imageElement);
    });
}

async function loadServiceImagesFromFirestore() {
  const q = query(collection(db, 'serviceImages'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  // 清空
  serviceTypes.forEach(t => serviceImagesByType[t.key] = []);
  snapshot.forEach(doc => {
    const img = doc.data();
    if (serviceImagesByType[img.type]) {
      serviceImagesByType[img.type].push(img.url);
    }
  });
}

// 綁定服務卡片點擊事件
function bindServiceCardClicks() {
  serviceTypes.forEach(type => {
    const card = document.querySelector(`.service-card[data-service="${type.key}"]`);
    if (card) {
      card.onclick = () => showServiceImages(type.key);
    }
  });
}

// 顯示服務圖片（動態）
function showServiceImages(serviceType) {
  const modal = document.getElementById('serviceModal');
  const modalContent = document.getElementById('serviceModalContent');
  const images = serviceImagesByType[serviceType] || [];
  // 清空現有內容
  modalContent.innerHTML = '';
  // 添加圖片
  images.forEach((imageUrl, idx) => {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'relative overflow-hidden w-full h-72';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'w-full h-full object-contain';
    img.alt = '服務圖片';
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
      openLightbox(images, idx);
    });
    imgContainer.appendChild(img);
    modalContent.appendChild(imgContainer);
  });
  // 顯示模態框
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

// 關閉服務圖片 modal
function closeServiceModal() {
  const modal = document.getElementById('serviceModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

// 初始化服務項目圖片功能
async function initServiceImages() {
  await loadServiceImagesFromFirestore();
  bindServiceCardClicks();
  
  // 使用事件委派處理 modal 關閉按鈕
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'closeServiceModal') {
      closeServiceModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
    loadGalleryImages();
    initServiceImages();
});

const bookingForm = document.getElementById('bookingForm');
const bookingMsg = document.getElementById('bookingMsg');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const note = document.getElementById('note').value;

    try {
      await addDoc(collection(db, 'orders'), {
        userName,
        userEmail,
        phone,
        date,
        time,
        note,
        status: 'new',
        createdAt: serverTimestamp()
      });
      bookingForm.reset();
      bookingMsg.classList.remove('hidden');
      setTimeout(() => bookingMsg.classList.add('hidden'), 4000);
    } catch (error) {
      alert('預約失敗：' + error.message);
    }
  });
} 