# Jobs: vận hành và kiểm chứng mốc đầu

> Tài liệu này mô tả chế độ snapshot. Collector HTML/JSON, PostgreSQL và lịch chạy đã được bổ sung ở [jobs-collection.md](./jobs-collection.md). Những ghi chú “chưa có crawler” bên dưới chỉ áp dụng mốc snapshot ban đầu.

## Những gì đã triển khai

- `/jobs/`: giao diện EN/VI, tìm kiếm không phân biệt dấu, bộ lọc nhóm nghề/cấp độ/hình thức/nguồn, mô tả và link gốc.
- Chỉ hiển thị job còn hạn tại TP.HCM, có ít nhất một nhóm nghề và cấp độ thuộc phạm vi đã chốt. Phân loại là thông tin người nhập đã xác minh từ JD; hiện chưa tự suy luận bằng AI.
- Kho snapshot đọc phía server: `data/jobs.json`. Không gọi website tuyển dụng trong request của khách.
- Chưa bật crawler, lịch đồng bộ, tài khoản, upload CV hoặc phân tích CV. Trang trống khi chưa có dữ liệu hợp lệ.

## Chuẩn bị dữ liệu

Chỉ nhập dữ liệu bạn có quyền đăng lại. Nhập thủ công không thay thế quyền sử dụng; xem [khảo sát nguồn](./job-sources.md). Không đưa CV hoặc dữ liệu ứng viên vào kho job.

File đầu vào là mảng JSON. Ví dụ dưới đây **chỉ minh họa schema, không phải tin tuyển dụng thật**; không nhập hoặc công bố ví dụ này như job thật:

```json
[
  {
    "id": "operator-stable-id",
    "title": "[TEST ONLY] Java Backend Intern",
    "company": "[TEST ONLY] Example company",
    "location": "TP. Hồ Chí Minh",
    "workMode": "hybrid",
    "categories": ["java-backend"],
    "levels": ["intern"],
    "skills": ["Java", "Spring Boot", "SQL"],
    "description": "[TEST ONLY] Nội dung JD được phép sử dụng.",
    "checkedAt": "2026-11-03T00:00:00Z",
    "status": "active",
    "sources": [
      { "name": "ITviec", "url": "https://itviec.com/it-jobs/example-test-only" }
    ]
  }
]
```

- `categories`: `java-backend`, `ai-engineer`, `backend-ai`.
- `levels`: `intern`, `fresher`, `junior`. Để mảng trống nếu chưa xác minh; tin sẽ không xuất hiện trên board.
- `workMode`: `onsite`, `hybrid`, `remote`, `unknown`. Remote vẫn phải ghi rõ vị trí TP.HCM mới thuộc phạm vi hiện tại.
- `status`: `active` hoặc `expired`, do người nhập kiểm tra. Không coi lỗi truy cập nguồn là bằng chứng tin đã đóng.
- `sources`: tối thiểu một link HTTPS trên domain chính thức đúng nhãn ITviec/TopDev/VietnamWorks/TopCV/LinkedIn; `sourceId` tùy chọn. Không nhận URL tùy ý để server tải.
- Sau chuẩn hóa, mỗi nguồn giữ riêng `status`, `checkedAt`, `expiresAt` để không mất vòng đời khi gộp tin. Nếu đầu vào chưa có các trường này, importer lấy từ bản ghi job; nguồn đã đóng vẫn được ghi nhãn khi giữ link xuất xứ.
- `postedAt`, `expiresAt`, `salary` tùy chọn. Không suy đoán dữ liệu còn thiếu.
- Ngày: `YYYY-MM-DD` hoặc timestamp UTC kết thúc bằng `Z`. `checkedAt` không ở tương lai, ngày đăng không sau ngày kiểm tra. Hạn dạng ngày tính hết ngày tại Việt Nam (UTC+7).
- Giới hạn: file 10 MB, tối đa 10.000 bản ghi; mọi ID đầu vào phải khác nhau. Job ngoài phạm vi được giữ trong snapshot nhưng không hiển thị.

## Nhập và triển khai

```powershell
npm.cmd run jobs:import -- C:\path\authorized-jobs.json
```

Lệnh này **thay thế toàn bộ snapshot**, không append. Chuẩn bị bản sao dữ liệu cũ nếu cần giữ lịch sử. Nếu bất kỳ bản ghi nào không hợp lệ, lệnh thất bại và giữ nguyên snapshot cũ. Dữ liệu hợp lệ được ghi qua file tạm rồi rename. Chạy từ checkout phát triển; không chạy đồng thời nhiều importer.

Loại trùng ưu tiên URL hoặc ID nguồn. Heuristic liên nguồn chỉ gộp khi cùng tên công ty/vị trí/địa điểm đã chuẩn hóa và ngày đăng gần nhau; có thể bỏ sót, không phải nhận diện tuyệt đối. Giữ link xuất xứ; trạng thái mới nhất của cùng nguồn thắng bản cũ. Một nguồn còn active có thể giữ job hiển thị khi bản đăng ở nguồn khác đã đóng.

Kiểm tra snapshot và quyền sử dụng trước khi commit dữ liệu công khai. Với deployment Vercel hiện tại, snapshot nằm trong artifact: cần build/redeploy sau khi đổi dữ liệu. Route dynamic đọc snapshot và kiểm tra hạn mỗi request nhưng không tự đồng bộ dữ liệu mới từ máy local. Không ghi file lên filesystem của serverless để làm database.

## Quy trình kiểm tra

```powershell
npm.cmd test
npm.cmd run lint
npx.cmd tsc --noEmit
$env:PORTFOLIO_VERIFY_BUILD = "1"
try { npm.cmd run build } finally { Remove-Item Env:PORTFOLIO_VERIFY_BUILD }
```

Phải kiểm tra exit code từng lệnh; dừng và sửa nếu lỗi. Test job dùng fixture riêng và thư mục tạm, không ghi đè snapshot thật. Bao phủ validation, URL giả mạo, ngày sai, phạm vi địa lý/cấp độ, tìm kiếm, loại trùng, trạng thái đóng/hết hạn và import atomic.

Kiểm tra giao diện: desktop/mobile, đổi EN/VI và reload, bàn phím, tìm kiếm/kết hợp bộ lọc/reset, trạng thái rỗng/lỗi, link nguồn mở tab mới. Không gửi CV thật để kiểm thử.

Sau build, mở terminal riêng và chạy production server kiểm tra:

```powershell
$env:PORTFOLIO_VERIFY_BUILD = "1"
npm.cmd run start -- --port 3100
```

Ở terminal khác chạy `npm.cmd run test:smoke`. Mặc định kiểm tra server local cổng 3100; có thể đổi bằng `TEST_BASE_URL` (chỉ nhận host loopback). Smoke test xác minh HTTP, markup bộ lọc/thông báo và các route portfolio cũ; không thay thế kiểm tra tương tác hoặc bố cục trên trình duyệt.
