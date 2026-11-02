# Kết quả kiểm chứng mốc nền tảng Jobs

> Đây là báo cáo mốc snapshot trước đó. Trạng thái collector/database mới nhất ở [jobs-collection-verification.md](./jobs-collection-verification.md).

Ngày: 03/11/2026. Phạm vi: board `/jobs/`, snapshot/import và tích hợp với portfolio. Không phải nghiệm thu crawler hoặc phân tích CV.

| Kiểm tra | Kết quả |
| --- | --- |
| `npm.cmd test` | PASS: 12 test blog + 19 test job |
| `npm.cmd run lint` | PASS, exit 0; còn 12 warning có sẵn về font, ảnh và import chưa dùng |
| `npx.cmd tsc --noEmit` | PASS |
| Production build với `PORTFOLIO_VERIFY_BUILD=1` | PASS; dùng quyền mạng để tải Google Fonts |
| `npm.cmd run test:smoke` trên production server local cổng 3100 | PASS: 7 test HTTP/SSR |
| Deployment file tracing | PASS: manifest `/jobs` chứa `data/jobs.json` |
| `git diff --check` | PASS |
| Quan sát desktop | Đã thấy trang `/jobs` và trạng thái rỗng hiển thị trong Edge |
| Tương tác browser, mobile, bàn phím, lưu locale qua reload | Chưa hoàn tất: công cụ báo cửa sổ thu nhỏ hoặc phát hiện người dùng đang thao tác |

Build còn cảnh báo thiếu `SITE_URL`/metadataBase. Không đoán domain production; cấu hình origin thật trước triển khai.

## Giới hạn còn lại

- `data/jobs.json` đang rỗng. Chưa có crawler hoặc nguồn dữ liệu thật được bật. Chi tiết quyền và khả năng truy cập nằm trong [job-sources.md](./job-sources.md).
- CV upload, dịch vụ AI và đối chiếu CV chưa triển khai.
- Smoke test chỉ kiểm tra HTTP và markup, không khẳng định tương tác hoặc responsive đã pass.
- Chưa commit, push hoặc deploy. Chưa gửi liên hệ cho bất kỳ nhà cung cấp nguồn nào.

Quy trình chạy lại và nhập dữ liệu nằm trong [jobs.md](./jobs.md). Chỉ nghiệm thu đầy đủ phần giao diện sau khi hoàn tất những mục browser còn thiếu.
