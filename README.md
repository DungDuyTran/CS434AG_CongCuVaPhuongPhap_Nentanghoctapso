📚 CS434AG: Nền Tảng Hỗ Trợ Học Tập Số (Trợ Lý Học Tập)

Dự án này là một ứng dụng web được xây dựng bằng Next.js, nhằm cung cấp các công cụ thiết yếu hỗ trợ sinh viên quản lý lịch học, lịch thi, thống kê thời gian học tập và ghi chú cá nhân.

GitHub: DungDuyTran/CS434AG_CongCuVaPhuongPhap_Nentanghoctapso

1. 🎯 Cấu Trúc Dự Án và Phân Chia Công Việc

Dự án được phân chia thành các module chính, mỗi thành viên phụ trách một phần:

| Tên thành viên       | Module phụ trách               |
| -------------------- | ------------------------------ |
| **Trần Duy Dũng**    | **Lịch Học** (`/app/calender`) |
| **Trần Huy Hoàng**   | **Thống Kê** (`/app/thongKe`)  |
| **Nguyễn Duy Nghĩa** | **Lịch Thi** (`/app/lichThi`)  |
| **Hà Phước Thịnh**   | **Ghi Chú** (`/app/ghiChu`)    |

2. ⚙️ Thiết Lập và Khởi Động Dự Án

2.1. Cài đặt Dependencies

Trước tiên, bạn cần đảm bảo Node.js và npm/yarn đã được cài đặt. Sau đó, chạy lệnh sau để tải về tất cả các thư viện cần thiết:

npm install

# hoặc

yarn install

2.2. Khởi động Development Server

Chạy lệnh dưới đây để khởi động máy chủ phát triển cục bộ (local development server):

npm run dev

# hoặc

yarn dev

Ứng dụng sẽ chạy tại địa chỉ: http://localhost:3000.

3. 🤝 Quy Trình Hợp Tác (Git Workflow)

Để đảm bảo quá trình phát triển đồng bộ và tránh lỗi non-fast-forward khi đẩy code, vui lòng tuân thủ quy trình sau:

3.1. Kéo mã mới nhất (Luôn làm bước này đầu tiên)

Trước khi bắt đầu làm việc hoặc đẩy code lên remote, luôn kéo mã mới nhất từ nhánh main về máy cục bộ.

git pull

3.2. Commit và Đẩy thay đổi

Sau khi hoàn tất tính năng hoặc sửa lỗi, hãy thêm (add) và commit các thay đổi của bạn:

# Thêm tất cả các file đã thay đổi/mới

git add .

# Thực hiện commit với thông điệp rõ ràng

git commit -m "feat: Thêm tính năng [Tên tính năng]"

# Đẩy các thay đổi đã commit lên GitHub

git push
