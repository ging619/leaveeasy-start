// ─────────────────────────────────────────────────────────────
// js/leave-request-detail.js — หน้าที่ 3 รายละเอียดใบลา
// สัปดาห์ที่ 7: อ่านใบลาจริงจาก Firestore · ลบใบลาจริง
// ─────────────────────────────────────────────────────────────

import { db, auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

(async function () {
  var รหัสใบลา = ค่าจากURL("id");
  var กล่องใบลา = document.getElementById("กล่องใบลา");
  var กล่องความเห็น = document.getElementById("กล่องความเห็น");
  var บทบาทผู้ใช้ = "employee"; // ค่าเริ่มต้นปลอดภัยสุด ระหว่างยังไม่รู้ role จริง

  var ใบ;
  try {
    var สแนปช็อต = await getDoc(doc(db, "leaveRequests", รหัสใบลา));
    if (!สแนปช็อต.exists()) {
      กล่องใบลา.innerHTML = "<p>ไม่พบใบขอลาที่ต้องการ — อาจถูกลบไปแล้ว หรือลิงก์ไม่ถูกต้อง</p>";
      return;
    }
    ใบ = Object.assign({ id: สแนปช็อต.id }, สแนปช็อต.data());
  } catch (err) {
    กล่องใบลา.innerHTML = "<p>ดึงข้อมูลจาก Firestore ไม่สำเร็จ: " + esc(err.message) + "</p>";
    return;
  }

  // ตาม ACL.md: ปุ่มอนุมัติ/ไม่อนุมัติ โชว์เฉพาะ manager/hr — รอให้รู้สถานะล็อกอินแน่นอนก่อนค่อยอ่าน role
  var ผู้ใช้ปัจจุบัน = await new Promise(function (resolve) {
    var เลิกฟัง = onAuthStateChanged(auth, function (user) { เลิกฟัง(); resolve(user); });
  });
  if (ผู้ใช้ปัจจุบัน) {
    try {
      var ผู้ใช้สแนปช็อต = await getDoc(doc(db, "users", ผู้ใช้ปัจจุบัน.uid));
      if (ผู้ใช้สแนปช็อต.exists() && ผู้ใช้สแนปช็อต.data().role) บทบาทผู้ใช้ = ผู้ใช้สแนปช็อต.data().role;
    } catch (err) { /* ใช้ค่าเริ่มต้น employee ถ้าอ่านไม่สำเร็จ (ปลอดภัยไว้ก่อน) */ }
  }

  // ความเห็น: ยังอ่านจากข้อมูลปลอม (เชื่อมโฟลเดอร์ย่อย approvals ของจริงเป็นงานถัดไป)
  var ความเห็น = window.LEAVE_DATA.approvals.filter(function (c) { return c.requestId === ใบ.id; });

  วาดใบลา();
  วาดความเห็น();
  กล่องความเห็น.classList.remove("hidden");

  document.getElementById("ปุ่มส่งความเห็น").addEventListener("click", ส่งความเห็น);

  // ── วาดข้อมูลใบลาลงหน้าจอ ──
  function วาดใบลา() {
    var แถว = [
      ["หัวข้อ", esc(ใบ.title)],
      ["เหตุผลการลา", esc(ใบ.reason)],
      ["ประเภทการลา", esc(ใบ.leaveTypeName)],
      ["วันที่ลา", esc(ใบ.startDate) + " ถึง " + esc(ใบ.endDate)],
      ["ผู้ขอลา", esc(ใบ.requesterName)],
      ["ผู้อนุมัติ", ใบ.approverName ? esc(ใบ.approverName) : "ยังไม่ได้กำหนดผู้อนุมัติ"],
      ["สถานะ", ป้ายสถานะ(ใบ.status)],
      ["วันที่ยื่น", esc(ใบ.createdAt)]
    ];

    var html = แถว.map(function (r) {
      return '<div class="field-row"><span class="k">' + r[0] + "</span><span>" + r[1] + "</span></div>";
    }).join("");

    // ปุ่มอนุมัติ/ไม่อนุมัติ ตาม ACL.md โชว์เฉพาะ manager/hr · ปุ่มลบยังโชว์ให้ทุกบทบาทเหมือนเดิม (กติกาการลบไม่ผูกกับ role)
    var แสดงปุ่มอนุมัติ = ใบ.status === "รอพิจารณา" && (บทบาทผู้ใช้ === "manager" || บทบาทผู้ใช้ === "hr");

    if (แสดงปุ่มอนุมัติ) {
      html +=
        '<div class="btn-row">' +
        '<button type="button" class="btn-ok" id="ปุ่มอนุมัติ">อนุมัติ</button>' +
        '<button type="button" class="btn-danger" id="ปุ่มไม่อนุมัติ">ไม่อนุมัติ</button>' +
        '<button type="button" class="btn-danger" id="ปุ่มลบ">ลบใบลานี้</button>' +
        "</div>";
    } else if (ใบ.status === "รอพิจารณา") {
      html +=
        '<div class="btn-row">' +
        '<button type="button" class="btn-danger" id="ปุ่มลบ">ลบใบลานี้</button>' +
        "</div>";
    } else {
      html += '<p class="hint">ใบนี้พิจารณาแล้ว จึงเปลี่ยนสถานะและลบต่อไม่ได้</p>';
    }

    กล่องใบลา.innerHTML = html;

    if (แสดงปุ่มอนุมัติ) {
      document.getElementById("ปุ่มอนุมัติ").addEventListener("click", function () { เปลี่ยนสถานะ("อนุมัติ"); });
      document.getElementById("ปุ่มไม่อนุมัติ").addEventListener("click", function () { เปลี่ยนสถานะ("ไม่อนุมัติ"); });
    }
    if (ใบ.status === "รอพิจารณา") {
      document.getElementById("ปุ่มลบ").addEventListener("click", ลบใบลา);
    }
  }

  // ── ลบใบลานี้ (ลบได้เฉพาะใบที่ยังรอพิจารณา — ปุ่มถูกซ่อนไปแล้วถ้าไม่ใช่) ──
  async function ลบใบลา() {
    if (!confirm("ยืนยันลบใบขอลานี้? เมื่อลบแล้วจะกู้คืนไม่ได้")) return;

    var ปุ่ม = document.getElementById("ปุ่มลบ");
    ปุ่ม.disabled = true;
    try {
      await deleteDoc(doc(db, "leaveRequests", ใบ.id));
      location.href = "leave-requests.html";
    } catch (err) {
      alert("ลบไม่สำเร็จ: " + err.message);
      ปุ่ม.disabled = false;
    }
  }

  // ── เปลี่ยนสถานะ (บันทึกจริงลง Firestore แก้เฉพาะช่อง status) ──
  async function เปลี่ยนสถานะ(สถานะใหม่) {
    // กฎ: จะไม่อนุมัติได้ ต้องมีความเห็นอย่างน้อย 1 รายการก่อน
    if (สถานะใหม่ === "ไม่อนุมัติ" && ความเห็น.length === 0) {
      alert("ต้องเขียนความเห็นอย่างน้อย 1 รายการก่อน จึงจะกดไม่อนุมัติได้");
      return;
    }

    document.getElementById("ปุ่มอนุมัติ").disabled = true;
    document.getElementById("ปุ่มไม่อนุมัติ").disabled = true;
    document.getElementById("ปุ่มลบ").disabled = true;

    try {
      await updateDoc(doc(db, "leaveRequests", ใบ.id), { status: สถานะใหม่ }); // แก้เฉพาะช่อง status เท่านั้น
      ใบ.status = สถานะใหม่;
      วาดใบลา();
    } catch (err) {
      alert("เปลี่ยนสถานะไม่สำเร็จ: " + err.message);
      document.getElementById("ปุ่มอนุมัติ").disabled = false;
      document.getElementById("ปุ่มไม่อนุมัติ").disabled = false;
      document.getElementById("ปุ่มลบ").disabled = false;
    }
  }

  // ── รายการความเห็น เรียงจากเก่าไปใหม่ ──
  function วาดความเห็น() {
    var ที่วาง = document.getElementById("รายการความเห็น");
    if (ความเห็น.length === 0) {
      ที่วาง.innerHTML = "<p>ยังไม่มีความเห็นในใบนี้</p>";
      return;
    }
    ที่วาง.innerHTML = ความเห็น
      .slice()
      .sort(function (a, b) { return a.createdAt < b.createdAt ? -1 : 1; })
      .map(function (c) {
        return '<div class="comment"><div class="meta">' + esc(c.authorName) + " · " + esc(c.createdAt) +
               "</div><div>" + esc(c.message) + "</div></div>";
      }).join("");
  }

  // ── ส่งความเห็นใหม่ ──
  function ส่งความเห็น() {
    var ช่อง = document.getElementById("ข้อความความเห็น");
    var เตือน = document.getElementById("เตือนความเห็น");
    var ข้อความ = ช่อง.value.trim();

    if (!ข้อความ) {
      เตือน.textContent = "⚠️ พิมพ์ข้อความก่อน จึงจะส่งความเห็นได้";
      เตือน.classList.remove("hidden");
      return;
    }
    เตือน.classList.add("hidden");

    // สัปดาห์ที่ 6 ยังไม่มีล็อกอิน จึงสมมติว่าผู้เขียนคือ สมหญิง รักงาน
    ความเห็น.push({
      id: "ap-ใหม่-" + Date.now(),
      requestId: ใบ.id,
      authorId: "u002", authorName: "สมหญิง รักงาน",
      message: ข้อความ,
      createdAt: เวลาตอนนี้()
    });
    ช่อง.value = "";
    วาดความเห็น();
  }
})();
