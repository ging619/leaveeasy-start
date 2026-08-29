// ─────────────────────────────────────────────────────────────
// js/seed.js — เครื่องมือใส่ข้อมูลตัวอย่างลง Firestore (ใช้ครั้งเดียว)
//
// ใช้เนื้อหาเดียวกับ js/data.js เป๊ะ (หัวข้อ 7 ของ leaveeasy-spec.md)
// เขียนด้วยชื่อไฟล์ตายตัว (setDoc ไม่ใช่ addDoc) จึงกดปุ่มซ้ำได้โดยไม่เกิดข้อมูลซ้ำ
// ─────────────────────────────────────────────────────────────

import { db } from "./firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const ปุ่ม = document.getElementById("ปุ่มใส่ข้อมูล");
const กล่องล็อก = document.getElementById("กล่องล็อก");

ปุ่ม.addEventListener("click", ใส่ข้อมูลตัวอย่าง);

function log(ข้อความ) {
  กล่องล็อก.textContent += ข้อความ + "\n";
}

async function ใส่ข้อมูลตัวอย่าง() {
  ปุ่ม.disabled = true;
  กล่องล็อก.textContent = "";

  try {
    log("กำลังใส่ข้อมูล users…");
    for (const u of window.LEAVE_DATA.users) {
      const { id, ...ข้อมูล } = u;
      await setDoc(doc(db, "users", id), ข้อมูล);
    }

    log("กำลังใส่ข้อมูล leaveTypes…");
    for (const t of window.LEAVE_DATA.leaveTypes) {
      const { id, ...ข้อมูล } = t;
      await setDoc(doc(db, "leaveTypes", id), ข้อมูล);
    }

    log("กำลังใส่ข้อมูล leaveRequests…");
    for (const r of window.LEAVE_DATA.leaveRequests) {
      const { id, ...ข้อมูล } = r;
      await setDoc(doc(db, "leaveRequests", id), ข้อมูล);
    }

    log("กำลังใส่ข้อมูล approvals (โฟลเดอร์ย่อยของแต่ละใบลา)…");
    for (const a of window.LEAVE_DATA.approvals) {
      const { id, requestId, ...ข้อมูล } = a;
      await setDoc(doc(db, "leaveRequests", requestId, "approvals", id), ข้อมูล);
    }

    log("");
    log("✅ เสร็จแล้ว — เปิด Firebase Console ดูผลได้เลย");
  } catch (err) {
    log("");
    log("❌ ผิดพลาด: " + err.message);
    log("ตรวจว่าเปิด Cloud Firestore แล้ว และ Security Rules ยังเปิดให้เขียนอยู่ (ดู SETUP.md)");
  } finally {
    ปุ่ม.disabled = false;
  }
}
