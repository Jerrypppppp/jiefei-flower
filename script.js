// Firestore 讀取圖片
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
        imageElement.className = 'relative group overflow-hidden rounded-lg shadow-lg';
        imageElement.innerHTML = `
            <img src="${image.url}" alt="${image.title}" class="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300">
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div class="text-white text-center">
                    <h3 class="text-xl font-bold mb-2">${image.title}</h3>
                </div>
            </div>
        `;
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