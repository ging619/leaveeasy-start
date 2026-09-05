// ─────────────────────────────────────────────────────────────
// js/signup.js — หน้าสมัครสมาชิก
// สร้างบัญชีด้วย Firebase Authentication + สร้างไฟล์ users/<uid> ให้เอง
// ─────────────────────────────────────────────────────────────

import { db, auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

(function () {
  var ฟอร์ม = document.getElementById("ฟอร์มสมัคร");
  var กล่องเตือน = document.getElementById("ข้อความเตือน");
  var ปุ่มสมัคร = document.getElementById("ปุ่มสมัคร");

  // ถ้าล็อกอินอยู่แล้ว (ตอนเปิดหน้านี้) ไม่ต้องมาหน้านี้อีก
  // เช็กครั้งเดียวตอนโหลดหน้า แล้วเลิกฟัง — กันไม่ให้ไปตัดจังหวะตอนสมัครสมาชิกสำเร็จใหม่ ๆ
  var เลิกฟัง = onAuthStateChanged(auth, function (user) {
    เลิกฟัง();
    if (user) location.href = "leave-requests.html";
  });

  ฟอร์ม.addEventListener("submit", async function (e) {
    e.preventDefault();

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value;

    if (!name || !email || !password) {
      เตือน("กรอกไม่ครบ — ต้องกรอกทุกช่องก่อนสมัคร");
      return;
    }

    ปุ่มสมัคร.disabled = true;
    try {
      var ผลลัพธ์ = await createUserWithEmailAndPassword(auth, email, password);
      var user = ผลลัพธ์.user;

      // ชื่อผู้ใช้เก็บไว้ในโฟลเดอร์ users (ตรงตามโครงสร้างข้อมูลในสเปก) ไม่ใช้ displayName ของ Auth
      await setDoc(doc(db, "users", user.uid), { name: name, email: email, role: "employee" });

      location.href = "leave-requests.html";
    } catch (err) {
      เตือน(ข้อความผิดพลาด(err));
      ปุ่มสมัคร.disabled = false;
    }
  });

  function เตือน(ข้อความ) {
    กล่องเตือน.textContent = "⚠️ " + ข้อความ;
    กล่องเตือน.classList.remove("hidden");
  }

  function ข้อความผิดพลาด(err) {
    switch (err.code) {
      case "auth/email-already-in-use": return "อีเมลนี้มีผู้ใช้แล้ว ลองเข้าสู่ระบบแทน";
      case "auth/invalid-email": return "รูปแบบอีเมลไม่ถูกต้อง";
      case "auth/weak-password": return "รหัสผ่านสั้นเกินไป ต้องมีอย่างน้อย 6 ตัวอักษร";
      default: return "สมัครไม่สำเร็จ: " + err.message;
    }
  }
})();
