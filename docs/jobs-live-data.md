# Job thật trên UI

Xác minh ngày 03/11/2026: đã chạy collector thực tế, lưu PostgreSQL local và đối chiếu các thẻ job tại `http://localhost:3000/jobs/`.

## Kết quả

**4 job đủ phạm vi**, cùng thuộc Bosch Group, tại TP.HCM:

| Tin gốc | Cấp độ |
| --- | --- |
| [Junior Java Developer, yêu cầu 1–3 năm](https://jobs.smartrecruiters.com/BoschGroup/744000157095699--eta-3-junior-java-developer-1-3-years-of-experience-) | Junior |
| [AI Engineer Intern, chương trình Q1 2027](https://jobs.smartrecruiters.com/BoschGroup/744000158674030--internship-program-q1-2027-ai-engineer-intern) | Intern |
| [BD AI Engineer Intern, 6 tháng](https://jobs.smartrecruiters.com/BoschGroup/744000147157639--bd-ai-engineer-intern-6-month-fulltime-internship-) | Intern |
| [ETA AI Engineer Intern, 6 tháng](https://jobs.smartrecruiters.com/BoschGroup/744000145938529--eta-ai-engineer-intern-6-month-fulltime-internship-) | Intern |

Không nhập job mẫu vào public database. Có 23 bản ghi nguồn sau lượt thu thập, nhưng chỉ 4 bản ghi thỏa bộ lọc công khai. Các quan sát chưa rõ ngành/cấp độ vẫn được lưu để lần cập nhật có thể sửa phân loại cũ; không ép chúng thành job phù hợp.

Lượt cuối đã kiểm chứng:

- SmartRecruiters/BoschGroup: thành công, 20 quan sát được cập nhật.
- Lever/shopback-2: thành công, 3 quan sát được cập nhật; hiện không có tin khớp đầy đủ bộ lọc. Không gán Backend AI chỉ vì JD nhắc dùng công cụ AI.
- Tin SAP Developer có nhắc Java đã được sửa phân loại và không xuất hiện trong Java Backend.

Tin Q1 2027 có thông tin ngày ứng tuyển mâu thuẫn trong JD gốc. Giữ nội dung nguồn, không suy ra deadline; ứng viên cần kiểm tra lại với nhà tuyển dụng. Số lượng và tình trạng tuyển dụng có thể thay đổi sau lần thu thập này.

## Nguồn API

- [SmartRecruiters Posting API](https://developers.smartrecruiters.com/docs/posting-api), [xác thực](https://developers.smartrecruiters.com/docs/authentication): lấy public postings qua endpoint chính thức, luôn gửi `destination=PUBLIC` và `country=vn`. Không dùng internal postings hoặc thông tin ứng viên.
- [Lever Postings API](https://github.com/lever/postings-api): tài liệu nêu API để xây trang job, tin đã publish hiển thị công khai và bên thứ ba có thể scrape. Chỉ dùng GET, không ứng tuyển thay người dùng.

Giới hạn mỗi nguồn: tối đa 5 company slug, 3 trang danh sách/company, 20 chi tiết/source, 120 giây; request dùng transport có giới hạn, DNS kiểm tra và không theo URL ref tùy ý.

Năm nguồn ITviec/TopDev/VietnamWorks/TopCV/LinkedIn vẫn chưa bật. Nguồn API doanh nghiệp mới không phải dữ liệu lấy từ những nền tảng đó.

## Chạy lại và kiểm tra

```powershell
npm.cmd run jobs:collect
npm.cmd run jobs:status
npm.cmd run test:jobs:live
```

`test:jobs:live` yêu cầu PostgreSQL thật và server local đang chạy. Test đọc job từ database, tải `/jobs/`, kiểm tra đúng số lượng/tên thẻ và link nguồn trong markup, đồng thời từ chối fixture. Không chỉ kiểm tra HTTP 200.

Dev/start mặc định đọc `.env.jobs.local` nếu có. Server đã mở trước thay đổi được kích hoạt qua `.env.local`; dữ liệu job hiển thị không còn phụ thuộc snapshot rỗng. Nếu trình duyệt còn bộ lọc cũ, xóa bộ lọc và tải lại trang.

Migration từ 5 sang 7 nguồn đã chạy trên database local, giữ dữ liệu cũ. Test migration nâng cấp, test API adapter, toàn bộ test repo, TypeScript, lint và production build đã pass; lint còn 12 warning có sẵn.

GitHub Actions vẫn chỉ là workflow trong checkout, chưa push/kích hoạt trên GitHub. Dữ liệu thật hiện đến từ các lượt collector local; chưa khẳng định có lịch cloud đang chạy. Không commit credential hoặc dữ liệu ứng viên.
