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

// DOM 元素
const loginForm = document.getElementById('loginForm');
const adminPanel = document.getElementById('adminPanel');
const login = document.getElementById('login');
const logoutBtn = document.getElementById('logoutBtn');
const addImageForm = document.getElementById('addImageForm');
const imageList = document.getElementById('imageList');

// 檢查登入狀態
auth.onAuthStateChanged(user => {
    if (user) {
        showAdminPanel();
        loadImages();
    } else {
        showLoginForm();
    }
});

// 登入表單提交
login.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        alert('登入失敗：' + error.message);
    }
});

// 登出
logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// 新增圖片
addImageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('imageUrl').value;
    const title = document.getElementById('imageTitle').value;
    const category = document.getElementById('imageCategory').value;

    try {
        await db.collection('images').add({
            url,
            title,
            category,
            active: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        addImageForm.reset();
        loadImages();
    } catch (error) {
        alert('新增圖片失敗：' + error.message);
    }
});

// 載入圖片列表
async function loadImages() {
    try {
        const snapshot = await db.collection('images').orderBy('createdAt', 'desc').get();
        imageList.innerHTML = '';
        
        snapshot.forEach(doc => {
            const image = doc.data();
            const div = document.createElement('div');
            div.className = 'bg-white rounded-lg shadow-md overflow-hidden';
            div.innerHTML = `
                <img src="${image.url}" alt="${image.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-bold mb-2">${image.title}</h3>
                    <p class="text-gray-600 mb-2">${image.category}</p>
                    <div class="flex justify-between items-center">
                        <label class="flex items-center">
                            <input type="checkbox" class="mr-2" ${image.active ? 'checked' : ''} 
                                onchange="toggleImageStatus('${doc.id}', this.checked)">
                            顯示
                        </label>
                        <button onclick="deleteImage('${doc.id}')" 
                            class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            imageList.appendChild(div);
        });
    } catch (error) {
        console.error('載入圖片失敗：', error);
    }
}

// 切換圖片狀態
async function toggleImageStatus(id, active) {
    try {
        await db.collection('images').doc(id).update({ active });
    } catch (error) {
        alert('更新狀態失敗：' + error.message);
    }
}

// 刪除圖片
async function deleteImage(id) {
    if (confirm('確定要刪除這張圖片嗎？')) {
        try {
            await db.collection('images').doc(id).delete();
            loadImages();
        } catch (error) {
            alert('刪除圖片失敗：' + error.message);
        }
    }
}

// 顯示管理面板
function showAdminPanel() {
    loginForm.classList.add('hidden');
    adminPanel.classList.remove('hidden');
}

// 顯示登入表單
function showLoginForm() {
    loginForm.classList.remove('hidden');
    adminPanel.classList.add('hidden');
} 