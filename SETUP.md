# SETUP.md — ตั้งค่า Firebase สำหรับ LeaveEasy (สัปดาห์ที่ 6)

> ทำตามลำดับนี้ครั้งเดียวตอนเริ่มสัปดาห์ที่ 6 ทำตามลำดับ อย่าข้ามขั้น

## ขั้นที่ 1 — เปิดใช้งาน Cloud Firestore

1. เปิด [Firebase Console](https://console.firebase.google.com/) เข้าโปรเจกต์ `leaveeasy-peeraya-7b2c7`
2. เมนูซ้าย **Build → Firestore Database** → กด **Create database**
3. เลือก **Start in test mode** (ยังไม่มีล็อกอินในสัปดาห์นี้ จึงต้องเปิดกว้างไว้ก่อน)
4. เลือกโลเคชันเซิร์ฟเวอร์ (region ใดก็ได้ที่ใกล้ที่สุด) → กด **Enable**

## ขั้นที่ 2 — ตรวจ/ตั้ง Security Rules ชั่วคราว

> ⚠️ **กฎนี้เปิดกว้างชั่วคราวเท่านั้น** ใช้ได้แค่สัปดาห์ที่ 6 — สัปดาห์ที่ 7 จะเปลี่ยนเป็น "ต้องล็อกอินก่อน" และสัปดาห์ที่ 8 จะเปลี่ยนเป็นกฎรายห้อง ห้ามปล่อยกฎนี้ไว้ตอนขึ้นออนไลน์จริง

ในแท็บ **Rules** ของ Firestore ให้ตั้งเป็น:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

กด **Publish**

## ขั้นที่ 3 — ใส่ข้อมูลตัวอย่าง (seed)

1. เปิดเว็บด้วย `npm run dev` แล้วเข้า `seed.html`
2. กดปุ่ม **ใส่ข้อมูลตัวอย่าง** รอจนขึ้น "✅ เสร็จแล้ว"
3. กลับไปที่ Firebase Console → Firestore → ต้องเห็นโฟลเดอร์ `users` (3 ไฟล์) · `leaveTypes` (3 ไฟล์) · `leaveRequests` (5 ไฟล์ พร้อมโฟลเดอร์ย่อย `approvals` ในบางใบ)
4. กดปุ่มนี้ซ้ำได้เสมอโดยไม่เกิดข้อมูลซ้ำ (เขียนทับด้วยชื่อไฟล์เดิม)

## ขั้นที่ 4 — ตั้งค่า Firebase config ในโค้ด

ค่า config อยู่ใน [`js/firebase-config.js`](js/firebase-config.js) แล้ว (ใส่ไว้ให้ตอนตั้งโปรเจกต์) — ถ้าย้ายไปคนละโปรเจกต์ Firebase ให้ไปคัดลอกค่าจาก Firebase Console → **⚙️ Project settings → General → Your apps** มาแทนที่ใน `firebaseConfig` ของไฟล์นั้น

## ตรวจว่าเสร็จสมบูรณ์

1. เปิด `leave-requests.html` — ต้องเห็นใบลา 5 ใบ (เหมือนตอนใช้ข้อมูลปลอม)
2. แก้ค่า `status` ของใบใดใบหนึ่งตรงใน Firebase Console โดยตรง แล้วรีเฟรชหน้า — ค่าบนหน้าจอต้องเปลี่ยนตาม
