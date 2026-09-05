// ─────────────────────────────────────────────────────────────
// js/login.js — หน้าเข้าสู่ระบบ
// ─────────────────────────────────────────────────────────────

import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

(function () {
  var ฟอร์ม = document.getElementById("ฟอร์มเข้าสู่ระบบ");
  var กล่องเตือน = document.getElementById("ข้อความเตือน");
  var ปุ่มเข้าสู่ระบบ = document.getElementById("ปุ่มเข้าสู่ระบบ");

  // ถ้าล็อกอินอยู่แล้ว (ตอนเปิดหน้านี้) ไม่ต้องมาหน้านี้อีก — เช็กครั้งเดียวแล้วเลิกฟัง
  var เลิกฟัง = onAuthStateChanged(auth, function (user) {
    เลิกฟัง();
    if (user) location.href = "leave-requests.html";
  });

  ฟอร์ม.addEventListener("submit", async function (e) {
    e.preventDefault();

    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value;

    if (!email || !password) {
      เตือน("กรอกไม่ครบ — ต้องกรอกอีเมลและรหัสผ่าน");
      return;
    }

    ปุ่มเข้าสู่ระบบ.disabled = true;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      location.href = "leave-requests.html";
    } catch (err) {
      เตือน(ข้อความผิดพลาด(err));
      ปุ่มเข้าสู่ระบบ.disabled = false;
    }
  });

  function เตือน(ข้อความ) {
    กล่องเตือน.textContent = "⚠️ " + ข้อความ;
    กล่องเตือน.classList.remove("hidden");
  }

  function ข้อความผิดพลาด(err) {
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      case "auth/invalid-email": return "รูปแบบอีเมลไม่ถูกต้อง";
      case "auth/too-many-requests": return "ลองผิดหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่";
      default: return "เข้าสู่ระบบไม่สำเร็จ: " + err.message;
    }
  }
})();
