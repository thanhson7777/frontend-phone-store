# 📱 PHONE STORE - ADMIN DASHBOARD

Hệ thống quản trị thương mại điện tử chuyên nghiệp được xây dựng trên nền tảng **MERN Stack**.

---

## 👤 THÔNG TIN TÁC GIẢ

- **Họ và tên:** Nguyễn Thanh Sơn  
- **Vai trò:** Fullstack Developer
- **Loại dự án:** Project cá nhân  

---

## 🚀 TỔNG QUAN DỰ ÁN

Dự án tập trung vào việc quản lý và vận hành cửa hàng điện thoại với các tiêu chuẩn bảo mật hiện đại và trải nghiệm người dùng tối ưu.

### 🔥 TÍNH NĂNG CHÍNH

| Module        | Mô tả |
|--------------|-------|
| 🔐 Bảo mật | Xác thực JWT (Access Token / Refresh Token), phân quyền Admin / Client |
| 👥 Quản lý User | Ngăn Admin tự khóa tài khoản hoặc tự hạ quyền của chính mình |
| 📦 Sản phẩm | CRUD sản phẩm, phân loại danh mục, lọc & tìm kiếm thông minh |
| 🧾 Đơn hàng | Quản lý luồng trạng thái: Chờ xác nhận → Đang xử lý → Đã giao / Hủy |
| 🎟️ Khuyến mãi | Hệ thống tạo và quản lý Coupon giảm giá linh hoạt |

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG

### Frontend
- React.js  
- Vite  
- Redux Toolkit  
- Material UI (MUI)

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB (Native Driver – tối ưu hiệu suất truy vấn)

### Validation
- Joi (Kiểm soát dữ liệu đầu vào chặt chẽ)

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

Dự án tuân thủ mô hình **MVC Architecture** nhằm tách biệt logic nghiệp vụ và giao diện, giúp hệ thống dễ bảo trì và mở rộng.

- **Controller:** Tiếp nhận request, điều phối dữ liệu  
- **Service:** Xử lý Business Logic tập trung  
- **Model:** Tương tác trực tiếp với MongoDB Atlas  
- **Validation Layer:** Kiểm tra dữ liệu đầu vào ngay tại API  

---

## ⚙️ HƯỚNG DẪN CÀI ĐẶT NHANH

### 1️⃣ Clone project

```bash
git clone https://github.com/thanhson7777/frontend-phone-store.git
cd frontend
npm install
npm run dev

tài khoản admin: thanhson11052003@gmail.com
mật khẩu admin: 12345678a@
vào /admin để vào trang admin nhé!!!

Nếu bạn thấy dự án hữu ích, hãy để lại một Star trên GitHub!