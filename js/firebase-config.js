// ─────────────────────────────────────────────────────────────
// js/firebase-config.js — ตั้งค่า Firebase ของโปรเจกต์ (สัปดาห์ที่ 6)
//
// ไฟล์นี้เป็น ES module — หน้าที่จะใช้ Firestore ต้อง import จากไฟล์นี้
// เช่น: import { db } from "./firebase-config.js";
//
// ⚠️ apiKey ของ Firebase Web App ไม่ใช่ความลับ (ถูกออกแบบให้อยู่ในโค้ดฝั่งเบราว์เซอร์ได้)
// ตัวที่คุมว่าใครอ่าน/เขียนข้อมูลได้จริงคือ Security Rules (ตั้งค่าใน Firebase Console)
// ─────────────────────────────────────────────────────────────

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbGBHi6zhEhrR4NBkMo6Ha-34G0FJaH4o",
  authDomain: "leaveeasy-peeraya-7b2c7.firebaseapp.com",
  projectId: "leaveeasy-peeraya-7b2c7",
  storageBucket: "leaveeasy-peeraya-7b2c7.firebasestorage.app",
  messagingSenderId: "805610234540",
  appId: "1:805610234540:web:debcbe1c210abff496b509"
};

if (!firebaseConfig.apiKey && typeof showConfigWarning === "function") {
  showConfigWarning();
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
