# สรุปโปรเจกต์: User Profile Web Application

แอปพลิเคชันจัดการโปรไฟล์ผู้ใช้ (User Profile) แบบ full-stack ประกอบด้วย frontend เป็น **React (TypeScript + Vite)** และ backend เป็น **ASP.NET Core Web API (.NET 10)**

## โครงสร้างโปรเจกต์

```
workshop/
├── backend/    # ASP.NET Core Web API (.NET 10)
└── frontend/   # React + TypeScript (Vite)
```

## Backend (`backend/`)

ASP.NET Core Web API ที่ให้บริการ CRUD สำหรับ user profile โดยเก็บข้อมูลแบบ in-memory

| ไฟล์ | หน้าที่ |
|---|---|
| `Models/UserProfile.cs` | โมเดลข้อมูลโปรไฟล์ผู้ใช้ (Id, ชื่อ-นามสกุล, อีเมล, bio, avatar, timestamps) |
| `Models/UpsertUserProfileRequest.cs` | DTO สำหรับสร้าง/แก้ไขโปรไฟล์ พร้อม validation attributes |
| `Services/IUserProfileService.cs` | interface ของ service ชั้น business logic |
| `Services/InMemoryUserProfileService.cs` | implementation แบบ thread-safe in-memory store (มีข้อมูลตัวอย่าง 1 รายการ) พร้อมสลับไปใช้ฐานข้อมูลจริงได้ในอนาคต |
| `Controllers/UserProfilesController.cs` | REST endpoints ที่ `/api/userprofiles` |
| `Program.cs` | ตั้งค่า Controllers, CORS (อนุญาต origin `http://localhost:5173`), OpenAPI |

### API Endpoints

| Method | Route | คำอธิบาย |
|---|---|---|
| GET | `/api/userprofiles` | ดึงรายการโปรไฟล์ทั้งหมด |
| GET | `/api/userprofiles/{id}` | ดึงโปรไฟล์ตาม id |
| POST | `/api/userprofiles` | สร้างโปรไฟล์ใหม่ |
| PUT | `/api/userprofiles/{id}` | แก้ไขโปรไฟล์ |
| DELETE | `/api/userprofiles/{id}` | ลบโปรไฟล์ |

รันที่ `http://localhost:5052` (ค่าเริ่มต้นตาม `Properties/launchSettings.json`)

## Frontend (`frontend/`)

React + TypeScript (Vite) สำหรับแสดง/สร้าง/แก้ไข/ลบ โปรไฟล์ผู้ใช้

| ไฟล์ | หน้าที่ |
|---|---|
| `src/types.ts` | type ของ `UserProfile` และ `UpsertUserProfileRequest` |
| `src/api/userProfiles.ts` | API client (fetch wrapper) เรียก backend |
| `src/components/UserProfileForm.tsx` | ฟอร์มสร้าง/แก้ไขโปรไฟล์ |
| `src/components/UserProfileList.tsx` | แสดงรายการโปรไฟล์เป็นการ์ด พร้อมปุ่ม edit/delete |
| `src/App.tsx` | หน้าหลัก รวม state, loading/error handling |
| `.env` | กำหนด `VITE_API_BASE_URL` (ค่าเริ่มต้น `http://localhost:5052`) |

รันที่ `http://localhost:5173`

## วิธีรันโปรเจกต์

**Backend**
```bash
cd backend
dotnet run
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## การตรวจสอบที่ทำแล้ว

- ✅ `dotnet build` ที่ backend ผ่าน ไม่มี error/warning
- ✅ `npm run build` ที่ frontend ผ่าน type-check และ build สำเร็จ
- ✅ รัน backend + frontend จริง แล้วทดสอบเรียก `GET /api/userprofiles` ได้ข้อมูลตัวอย่างกลับมา
- ✅ ทดสอบ CORS จาก origin `http://localhost:5173` เรียก backend ที่ `http://localhost:5052` สำเร็จ (มี header `Access-Control-Allow-Origin`)

## หมายเหตุ

- ข้อมูลปัจจุบันเก็บแบบ in-memory (หายเมื่อรีสตาร์ท backend) ออกแบบผ่าน interface `IUserProfileService` ไว้แล้ว หากต้องการเชื่อมฐานข้อมูลจริง (เช่น SQL Server, PostgreSQL ผ่าน EF Core) สามารถสร้าง implementation ใหม่มาแทนที่ `InMemoryUserProfileService` ได้โดยไม่กระทบส่วนอื่น
