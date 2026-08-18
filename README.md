# crudVer2
CRUD V2.1 — แก้ปัญหา Google Drive Authentication
สร้าง Google Sheet และ worksheet `Students` โดยหัวตารางคือ `ID | Name | Age | ImageFileId`
สร้างโฟลเดอร์ Google Drive และคัดลอก Folder ID
แก้ `SPREADSHEET_ID`, `SHEET_NAME`, `DRIVE_FOLDER_ID` ใน `apps-script/Code.gs`
ใน Apps Script Editor เลือกฟังก์ชัน `authorizeApp` แล้วกด Run ครั้งแรก เพื่อให้เจ้าของสคริปต์อนุญาต Google Sheets/Drive
Deploy > New deployment > Web app
Execute as: Me
Who has access: เลือกตามนโยบายองค์กร เช่น Only myself / Anyone in organization / ตัวเลือกที่องค์กรอนุญาต
นำ URL `/exec` ไปใส่ใน `frontend/app.js`
นำไฟล์ใน `frontend/` ขึ้น GitHub Pages
ทำไม upload จึงติด Authentication?
DriveApp ต้องได้รับ authorization จากบัญชีที่รัน Apps Script ก่อน และ Web App ต้องกำหนด `Execute as: Me` หากต้องการให้สคริปต์ใช้สิทธิ์ของเจ้าของในการเขียนลง Drive folder
ถ้าเป็น Google Workspace และยังขึ้น Access denied ให้ตรวจ policy ของผู้ดูแลระบบ และตรวจว่าเจ้าของ Apps Script มีสิทธิ์ Editor/Contributor ใน Drive folder
ความเป็นส่วนตัว
`ALLOW_PUBLIC_IMAGE_LINK` ตั้งเป็น `false` เป็นค่าเริ่มต้น รูปจะไม่ถูกเปิดเป็น public link ผู้ดูรูปต้องมีสิทธิ์เข้าถึงไฟล์ใน Drive
หากตั้ง `true` รูปจะเป็น Anyone with the link ซึ่งไม่เหมาะกับข้อมูลเด็ก/นักเรียน
อายุ
ปรับเป็น 0-120 ปี และตรวจซ้ำทั้ง frontend และ Apps Script
หมายเหตุ
ตัวอย่างส่งรูปแบบ Base64 จึงเหมาะกับไฟล์ขนาดเล็ก/กลางและจำกัด 5 MB ต่อรูป
