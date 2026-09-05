// ─────────────────────────────────────────────────────────────
// js/auth.js — ยามเฝ้าล็อกอิน ใช้ในทุกหน้าที่ต้องล็อกอินก่อนดู
//
// วิธีใช้: ใส่ <script type="module" src="js/auth.js"></script>
// ต่อจาก js/nav.js ในทุกหน้า ยกเว้น login.html และ signup.html
// ─────────────────────────────────────────────────────────────

import { db, auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

onAuthStateChanged(auth, async function (user) {
  if (!user) {
    location.href = "login.html";
    return;
  }

  var ที่วาง = document.getElementById("navUser");
  if (!ที่วาง) return;

  var ชื่อที่แสดง = user.email;
  try {
    var สแนปช็อต = await getDoc(doc(db, "users", user.uid));
    if (สแนปช็อต.exists() && สแนปช็อต.data().name) ชื่อที่แสดง = สแนปช็อต.data().name;
  } catch (err) { /* แสดงอีเมลแทนถ้าอ่านชื่อไม่สำเร็จ */ }

  ที่วาง.textContent = "";
  var ชื่อ = document.createElement("span");
  ชื่อ.textContent = ชื่อที่แสดง;
  var ปุ่มออก = document.createElement("button");
  ปุ่มออก.type = "button";
  ปุ่มออก.className = "btn-ghost";
  ปุ่มออก.style.padding = "3px 10px";
  ปุ่มออก.style.fontSize = "14px";
  ปุ่มออก.textContent = "ออกจากระบบ";
  ปุ่มออก.addEventListener("click", function () {
    signOut(auth).then(function () { location.href = "login.html"; });
  });

  ที่วาง.appendChild(ชื่อ);
  ที่วาง.appendChild(ปุ่มออก);
});
