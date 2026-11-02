# Kiểm chứng collector, PostgreSQL và lịch chạy

> Đây là mốc hạ tầng trước khi có dữ liệu thật. Trạng thái mới nhất nằm ở [jobs-live-data.md](./jobs-live-data.md).

Ngày: 03/11/2026. Đây là kiểm chứng mã nguồn và hạ tầng local, chưa phải nghiệm thu dữ liệu tuyển dụng thật hoặc lịch chạy trên GitHub.

| Hạng mục | Kết quả |
| --- | --- |
| Blog | 12 test PASS |
| Chuẩn hóa, lọc, loại trùng job | 19 test PASS |
| SQL trên PostgreSQL nhúng PGlite | 13 test PASS |
| HTTP collector, robots, retry, DNS và giới hạn | 23 test PASS |
| Parser HTML JSON-LD và discovery | 13 test PASS |
| Pipeline, lease, lỗi nguồn, CLI chưa cấu hình | 8 test PASS |
| PostgreSQL 17 server thật local | 5 test PASS, gồm 4 subtest trong schema riêng |
| Smoke HTTP/SSR với PostgreSQL | 7 test PASS |
| Smoke HTTP/SSR với snapshot | 7 test PASS |
| Lint | PASS; 12 warning có sẵn ở portfolio |
| TypeScript | PASS |
| Production build | PASS, dùng mạng để tải Google Fonts |
| Workflow/Compose YAML | Parse và kiểm tra cấu hình PASS |

## Hạ tầng đã chạy

- Docker Desktop đã được khởi động; container `gray-portfolio-postgres-1` PostgreSQL 17 healthy, cổng local `127.0.0.1:55432`, volume bền vững.
- Migration public schema thành công. File private `.env.jobs.local` được tạo bằng mật khẩu ngẫu nhiên, đã xác minh Git ignore. Không sửa credential trong `.env.local` hiện có.
- Test server thật dùng schema ngẫu nhiên có tiền tố `jobs_test_`, dọn trong finally. Fixture không được nhập vào public board.
- `jobs:status`: public database có 0 bản ghi nguồn và chưa có lượt thu thập. `jobs:collect` trả exit 1 khi chưa bật nguồn; regression test xác minh đây là guard cấu hình, không phải thông báo thu thập thành công.
- Production web test ở cổng 3100/3102 đã được dừng sau smoke test; dev server có sẵn của người dùng không bị dừng. Database local giữ chạy để tiếp tục phát triển.

## Chưa vận hành thật

- `config/jobs-sources.json`: cả năm nguồn vẫn `enabled: false`. Chưa có endpoint/feed và quyền thu thập được xác nhận; chưa crawl hoặc nhập job thật.
- Workflow GitHub Actions đã viết lịch mỗi sáu giờ, chưa push/kích hoạt. Cần database được runner truy cập, secret, biến bật workflow và ít nhất một nguồn hợp lệ. Database local không tự trở thành database production cho runner GitHub.
- Chưa kiểm chứng role chỉ đọc production, restore backup hoặc cảnh báo trên hệ thống vận hành. Các bước này được ghi rõ trong [hướng dẫn](./jobs-collection.md).
- Chưa triển khai CV. Không có thay đổi hoặc công bố dữ liệu CV.
- Smoke test kiểm tra HTTP/markup, không thay thế nghiệm thu tương tác, bàn phím và bố cục mobile của mốc giao diện trước.

Build còn cảnh báo thiếu production `SITE_URL`; không đoán domain để bỏ cảnh báo. Các CLI TypeScript hiện có cảnh báo `MODULE_TYPELESS_PACKAGE_JSON` của Node nhưng exit code kiểm thử thành công.
