// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyDY5m6pnu4bqaQUsmr27j4SIkWIfsawfPk",
    authDomain: "jiefei-flower.firebaseapp.com",
    projectId: "jiefei-flower",
    storageBucket: "jiefei-flower.firebasestorage.app",
    messagingSenderId: "761028186679",
    appId: "1:761028186679:web:19b10716623861fc48a5b2",
    measurementId: "G-G6FXQPJPPV"
};

// 初始化 Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM 元素
const loginForm = document.getElementById('adminLoginForm');
const adminPanel = document.getElementById('adminPanel');
const loginPanel = document.getElementById('loginPanel');
const logoutBtn = document.getElementById('logoutBtn');
const addImageForm = document.getElementById('addImageForm');
const imageList = document.getElementById('imageList');

const adminWelcome = document.getElementById('adminWelcome');

// 檢查登入狀態
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginPanel.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        adminWelcome.textContent = `歡迎，${user.email}`;
        loadImages();
    } else {
        loginPanel.classList.remove('hidden');
        adminPanel.classList.add('hidden');
        adminWelcome.textContent = '';
    }
});

// 登入表單提交
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        alert('登入失敗：' + error.message);
    }
});

// 登出
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// 新增圖片
addImageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
        alert('請先登入管理員帳號！');
        return;
    }
    const fileInput = document.getElementById('imageFile');
    const file = fileInput.files[0];
    const title = document.getElementById('imageTitle').value;
    const category = document.getElementById('imageCategory').value;
    
    if (!file) {
        alert('請選擇圖片檔案');
        return;
    }
    if (!title.trim()) {
        alert('請輸入標題');
        return;
    }
    if (!category.trim()) {
        alert('請選擇分類');
        return;
    }
    try {
        // 產生亂數英文檔名，避免中文檔名問題
        const randomString = Math.random().toString(36).substring(2, 10);
        const ext = file.name.split('.').pop();
        const filePath = `images/${Date.now()}_${randomString}.${ext}`;
        const imgRef = storageRef(storage, filePath);
        const metadata = {
            contentType: file.type
        };
        await uploadBytes(imgRef, file, metadata);
        const url = await getDownloadURL(imgRef);
        if (!url.includes('firebasestorage.app')) {
            throw new Error('取得圖片下載連結失敗，請稍後再試。');
        }
        // 存到 Firestore
        await addDoc(collection(db, 'images'), {
            url,
            title,
            category,
            storagePath: filePath,
            active: true,
            createdAt: serverTimestamp()
        });
        addImageForm.reset();
        loadImages();
        alert('圖片已上傳，前台作品集將自動顯示。');
    } catch (error) {
        alert('新增圖片失敗：' + (error.message || error));
    }
});

// 載入圖片列表
async function loadImages() {
    try {
        const q = query(collection(db, 'images'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        imageList.innerHTML = '';
        
        snapshot.forEach(doc => {
            const image = doc.data();
            // 只顯示 url 格式正確的圖片
            if (!image.url || !image.url.includes('alt=media')) return;
            const div = document.createElement('div');
            div.className = 'bg-white rounded-lg shadow-md overflow-hidden';
            div.innerHTML = `
                <img src="${image.url}" alt="${image.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-bold mb-2">${image.title}</h3>
                    <p class="text-xs text-gray-400 break-all">Storage 路徑：${image.storagePath}</p>
                    <div class="flex justify-between items-center mt-2">
                        <button onclick="deleteImage('${doc.id}')" class="text-red-500 hover:text-red-700 px-3 py-1 rounded bg-red-100">刪除</button>
                    </div>
                </div>
            `;
            imageList.appendChild(div);
        });
    } catch (error) {
        console.error('載入圖片失敗：', error);
    }
}

// 刪除圖片
window.deleteImage = async function(id) {
    if (confirm('確定要刪除這張圖片嗎？')) {
        try {
            // 先取得 Firestore 中的 storagePath
            const imageDoc = doc(db, 'images', id);
            const imageSnap = await getDocs(query(collection(db, 'images'), orderBy('createdAt', 'desc')));
            let storagePath = null;
            imageSnap.forEach(docItem => {
                if (docItem.id === id) {
                    storagePath = docItem.data().storagePath;
                }
            });
            
            if (storagePath) {
                // 刪除 Storage 檔案
                const imgRef = storageRef(storage, storagePath);
                await deleteObject(imgRef);
            }
            
            // 刪除 Firestore 資料
            await deleteDoc(imageDoc);
            loadImages();
            alert('圖片已刪除，前台作品集將自動移除。');
        } catch (error) {
            alert('刪除圖片失敗：' + error.message);
        }
    }
}; 