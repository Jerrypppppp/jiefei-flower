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

document.addEventListener('DOMContentLoaded', () => {
    loadGalleryImages();
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