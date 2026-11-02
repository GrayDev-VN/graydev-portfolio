# Thu thập job định kỳ và PostgreSQL

> Đã bật nguồn API doanh nghiệp SmartRecruiters/Bosch và Lever/ShopBack, thu thập vào PostgreSQL và hiển thị 4 job đúng phạm vi trên UI local. Năm kênh ban đầu vẫn tắt. Xem bằng chứng và lệnh kiểm tra ở [jobs-live-data.md](./jobs-live-data.md).

## Quyết định cho giai đoạn này

Luồng triển khai: **HTML JobPosting JSON-LD hoặc JSON feed được cấp phép → kiểm tra/chuẩn hóa → PostgreSQL → trang `/jobs`**. Worker viết bằng TypeScript, chạy bằng Node.js 24. GitHub Actions lên lịch mỗi sáu giờ; Next.js chỉ đọc dữ liệu, không gọi nguồn tuyển dụng khi khách mở trang.

Năm nguồn ITviec, TopDev, VietnamWorks, TopCV và LinkedIn trong `config/jobs-sources.json` **mặc định tắt**. Có bộ thu thập không có nghĩa đã có quyền truy cập hoặc đang đồng bộ tin thật. Xem [khảo sát nguồn](./job-sources.md) trước khi cấu hình. Không tự dùng endpoint nội bộ, vượt đăng nhập/CAPTCHA hoặc lấy dữ liệu từ đường dẫn ngẫu nhiên.

## Chạy cục bộ trên Windows

Cần Node.js 24, dependencies từ lockfile và Docker Desktop nếu dùng PostgreSQL cục bộ. Không cần Docker để chạy test cơ sở dữ liệu nhúng bằng PGlite; test nhúng không thay thế kiểm thử PostgreSQL qua mạng.

Cách nhanh đã hỗ trợ:

```powershell
npm.cmd run jobs:local:setup
npm.cmd run jobs:local:up
npm.cmd run jobs:db:migrate
npm.cmd run jobs:dev
```

Setup sinh mật khẩu ngẫu nhiên trong `.env.jobs.local` đã được Git ignore, không in credential và không ghi đè file đã có. Worker đọc `.env.local` rồi `.env.jobs.local`; `jobs:dev` nạp riêng cấu hình job local để không sửa `.env.local` của portfolio. Dừng server dev cũ trước nếu muốn dùng cùng cổng 3000. Có thể dùng `npm.cmd run jobs:dev -- --port 3001` để chạy song song.

Kiểm tra server PostgreSQL thật bằng `npm.cmd run test:jobs:postgres`. Test tạo schema tên ngẫu nhiên riêng, kiểm tra HTML crawler → SQL → repository và hai connection tranh lease, sau đó chỉ xóa schema test đó. Không đưa fixture vào schema public của board.

Chạy `npm.cmd run jobs:status` để xem số bản ghi nguồn và mười lượt chạy gần nhất mà không in URL kết nối hoặc credential.

Các bước cấu hình thủ công tương đương:

1. Thêm cấu hình riêng vào `.env.local` (file không được commit):

   ```dotenv
   JOBS_POSTGRES_PASSWORD=<mat-khau-cuc-bo-ban-tu-dat>
   JOBS_DATABASE_URL=postgresql://graydev:<mat-khau-da-URL-encode>@127.0.0.1:55432/graydev_jobs
   JOBS_STORAGE=postgres
   ```

   Thay các placeholder trước khi chạy. Mật khẩu trong URL phải được URL-encode; không sao chép URL có credential vào issue/log/chat. Worker dùng `JOBS_DATABASE_URL`; lệnh npm worker đọc `.env.local` bằng tùy chọn Node `--env-file-if-exists=.env.local`.

2. Khởi động database rồi xem trạng thái:

   ```powershell
   docker compose --env-file .env.local -f compose.jobs.yml up -d
   docker compose --env-file .env.local -f compose.jobs.yml ps
   npm.cmd run jobs:db:migrate
   ```

   Compose dùng PostgreSQL 17, chỉ bind `127.0.0.1:55432`, database `graydev_jobs`, user `graydev` và volume bền vững `jobs-postgres-data`. Mật khẩu bắt buộc; Compose dừng nếu thiếu. User này chỉ dành cho phát triển cục bộ, không phải thiết kế quyền production. Đổi biến password không tự thay mật khẩu của database đã khởi tạo trong volume.

3. Sau khi được cấp phép, cập nhật nguồn trong `config/jobs-sources.json`: `enabled: true`, `mode`, `allowedHosts` chứa chính xác hostname được phép và `permissionReference` mô tả căn cứ quyền sử dụng. Chọn `json-feed` với HTTPS `feedUrl`, hoặc `jsonld` với `pageUrls` và/hoặc `listingUrls` cùng `detailPathPrefixes`. Không đưa token, mật khẩu hoặc URL có credential vào file cấu hình công khai. Nguồn chưa có quyền tiếp tục để tắt.

4. Chạy worker và web:

   ```powershell
   npm.cmd run jobs:collect
   npm.cmd run dev
   ```

   Mở `/jobs/`. Nếu chưa có nguồn được bật, CLI báo chưa cấu hình nguồn và thoát với mã lỗi; không coi đây là một lần thu thập dữ liệu thật thành công. Nếu cấu hình PostgreSQL nhưng kết nối/migration thất bại, sửa lỗi kết nối; không chuyển âm thầm sang snapshot để che lỗi.

5. Dừng database khi không dùng:

   ```powershell
   docker compose --env-file .env.local -f compose.jobs.yml stop
   ```

   Lệnh này giữ dữ liệu. Không dùng thao tác xóa volume nếu chưa chủ động muốn xóa database và đã có bản sao lưu.

## Hai chế độ thu thập

**`mode: "jsonld"`** là crawler HTML thật: đọc trang tuyển dụng công khai được cấp phép và trích các script `application/ld+json` loại `JobPosting`. Có thể cấu hình trang chi tiết qua `pageUrls`, hoặc tối đa ba trang danh sách qua `listingUrls` với các tiền tố đường dẫn chi tiết `detailPathPrefixes` do người vận hành chỉ định. Discovery chỉ đi một cấp, giới hạn tổng cộng 20 link chi tiết mỗi nguồn, cùng origin chính thức, không chạy JavaScript hoặc tự vượt chặn. Worker kiểm tra robots.txt trước khi lấy trang; robots không thay thế `permissionReference`. Mỗi nguồn có ngân sách thời gian tối đa 120 giây; nguồn chậm hoặc crawl-delay cao có thể phải chia seed nhỏ hơn. Một nguồn lỗi không được dùng để xóa dữ liệu cũ.

Parser đọc graph/array, giải mã HTML thành text, giữ link trang thực sự đã lấy làm nguồn ứng tuyển và chuyển ngày có timezone về UTC. Trang chi tiết cần đúng một JobPosting hợp lệ; nhiều bản schema giống hệt được gộp, nhiều vị trí khác nhau trên cùng trang bị từ chối để tránh gộp nhầm. Thiếu tiêu đề/công ty/địa điểm/mô tả hoặc JSON-LD hỏng làm lượt nguồn thất bại và giữ dữ liệu cũ. Trang chỉ render qua JavaScript hoặc không có JSON-LD chưa được hỗ trợ; cần adapter riêng được cấp phép, không thông báo đã crawl thành công.

Phân loại ngành/cấp độ dùng tín hiệu rõ ràng từ tiêu đề/JD. `JavaScript` không trở thành `Java`; tiêu đề Senior/Lead hoặc yêu cầu tối thiểu ba năm không được hạ thành Junior. Không rõ thì giữ mảng phân loại rỗng và không đưa vào danh sách mục tiêu. Không suy ra onsite/lương khi nguồn không công bố. Việc này có thể bỏ sót tin; cần kiểm tra fixture nguồn thật khi được cấp phép trước khi bật production.

**`mode: "json-feed"`** hỗ trợ feed JSON được cấp phép và là mặc định tương thích khi bỏ `mode`.

Feed trả `application/json` với mảng các đối tượng `Job` theo `src/features/jobs/types.ts`, qua validator `normalizeJobs`. Mỗi đối tượng cần đúng một `sources` có tên khớp nguồn cấu hình và URL tin trên domain chính thức của nguồn đó; không dùng URL feed làm URL ứng tuyển. Phải có `id`, `title`, `company`, `location`, `description`, `workMode`, `categories`, `levels`, `skills`, `checkedAt`, `status` và `sources`; các ngày/lương chỉ thêm khi có bằng chứng. Mảng rỗng nghĩa là không quan sát thấy bản ghi, không phải yêu cầu xóa hoặc đóng toàn bộ tin cũ. JSON feed chưa hỗ trợ phân trang; nhà cung cấp cần cung cấp JSON phù hợp hay một adapter được cấp phép trước.

## Chọn nơi lưu và phân quyền

- `JOBS_STORAGE=snapshot`: đọc snapshot `data/jobs.json`, phù hợp phát triển offline; không có đồng bộ PostgreSQL. Khi chưa cấu hình storage/database, mặc định cục bộ vẫn dùng snapshot.
- `JOBS_STORAGE=postgres`: web đọc PostgreSQL. Worker cần `JOBS_DATABASE_URL` của database thật. Không dùng biến `NEXT_PUBLIC_*` cho kết nối database.
- `JOBS_READ_DATABASE_URL`: cấu hình kết nối chỉ đọc riêng cho web khi triển khai production. Không cung cấp quyền ghi/migration cho web; cấu hình role bằng công cụ quản trị nhà cung cấp và kiểm chứng quyền thực tế, không chỉ đặt tên role là “readonly”.
- Worker/migration cần quyền ghi và tạo/cập nhật schema phù hợp. Tách thêm role migration khỏi role worker khi vận hành yêu cầu mức quyền thấp hơn. Giữ credential ngoài Git và xoay khi bị lộ.
- Dùng TLS theo hướng dẫn nhà cung cấp; không tắt kiểm chứng chứng chỉ để sửa lỗi kết nối. Database production cần bản sao lưu, chính sách giữ dữ liệu và diễn tập restore. Named volume cục bộ không phải backup.

## Bật GitHub Actions khi đã sẵn sàng

File `.github/workflows/jobs-collect.yml` được tạo trong repo nhưng **chưa được push hay kích hoạt trên tài khoản GitHub**. Không có tài khoản/cloud/database bên ngoài nào được tạo bởi thay đổi này.

1. Chuẩn bị PostgreSQL có thể kết nối từ runner, TLS và quyền phù hợp. PostgreSQL trên `127.0.0.1` của máy bạn không truy cập được từ runner GitHub.
2. Kiểm tra quyền sử dụng từng feed và cấu hình nguồn. Chạy migrate/collect và các test cục bộ trước.
3. Sau khi chủ repo chủ động push workflow lên nhánh mặc định, đặt repository secret `JOBS_DATABASE_URL` cho worker. Đặt repository variable `JOBS_COLLECTION_ENABLED` đúng chuỗi `true` để cho phép job chạy. Giữ false hoặc bỏ trống để ngăn chạy ngoài ý muốn.
4. Vào Actions → **Collect authorized jobs** → **Run workflow** để chạy thủ công. Kiểm tra kết quả job và dữ liệu PostgreSQL; không công khai URL có secret hoặc dump database trong log/artifact.
5. Cấu hình deployment web với `JOBS_STORAGE=postgres` và kết nối đọc cùng database. Worker cập nhật database không đòi hỏi commit snapshot hay build lại website.

Lịch `17 */6 * * *` dùng UTC: 00:17, 06:17, 12:17, 18:17; tại Việt Nam là 07:17, 13:17, 19:17, 01:17. Đây là lịch dự kiến, không phải bảo đảm chạy đúng phút: GitHub có thể trì hoãn hoặc bỏ lượt khi tải cao; lịch chạy trên nhánh mặc định và repo công khai không hoạt động lâu có thể bị tắt lịch. [Tài liệu schedule của GitHub](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

Workflow chỉ có `contents: read`, không push dữ liệu vào Git; concurrency cố định không hủy lượt đang chạy; giới hạn mỗi job 20 phút. Secrets chỉ được đưa vào các bước cần database, không bước cài dependencies. `actions/checkout@v7` và `actions/setup-node@v7` theo ví dụ README chính thức được kiểm tra ngày 03/11/2026; Node của ứng dụng cố định major 24. [Checkout](https://github.com/actions/checkout), [setup-node](https://github.com/actions/setup-node).

## Vì sao chưa dùng Airflow

| Phương án | Phù hợp khi | Quyết định hiện tại |
| --- | --- | --- |
| GitHub Actions schedule | Ít feed, chạy định kỳ, cần log và chạy lại thủ công ngay trong repo | Dùng hiện tại; chấp nhận lịch có thể trễ và giới hạn runner |
| Cron/systemd trên máy chủ | Đã có máy chủ luôn chạy và người quản lý backup, log, khóa chống chạy trùng | Thay thế hợp lý nếu đã có hạ tầng; chưa dựng thêm máy chủ chỉ để chạy worker |
| Vercel Cron | Tác vụ chạy qua route/function được bảo vệ, phù hợp giới hạn runtime/gói triển khai | Chưa dùng; tránh tạo endpoint công khai để kích hoạt worker lúc này |
| Apache Airflow | Nhiều pipeline phụ thuộc nhau, cần DAG, backfill, theo dõi từng task và vận hành scheduler | Để sau khi nhu cầu rõ; chưa thêm Python/Airflow chỉ cho năm feed |

Airflow có DAG/tasks và nhiều thành phần bắt buộc như scheduler, DAG processor, API server, metadata database. Đây là chi phí vận hành bổ sung so với chạy một CLI có kiểm thử; database metadata Airflow cũng khác database job của sản phẩm. [Kiến trúc Airflow](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html). Vercel Cron gọi deployment theo lịch và chịu các giới hạn của dịch vụ; cần kiểm tra gói/runtime trước khi đổi. [Vercel Cron](https://vercel.com/docs/cron-jobs).

## Kiểm chứng và vận hành

```powershell
npm.cmd run test:jobs
npm.cmd run test:jobs:db
npm.cmd run test:jobs:collection
npm.cmd run test:jobs:pipeline
npm.cmd run test:jobs:jsonld
npm.cmd test
npm.cmd run lint
npx.cmd tsc --noEmit
```

Các test fixture/feed giả lập cần tách khỏi dữ liệu công khai. Phải kiểm tra lỗi feed, timeout, kích thước, redirect, URL không được phép, quyền nguồn, transaction, chạy lại không sinh bản sao và cách giữ dữ liệu cũ khi nguồn lỗi. Kết quả test không chứng minh đã thu thập được tin thật hoặc workflow GitHub đã chạy.

Trước khi thông báo vận hành production, cần kiểm chứng riêng: migrate PostgreSQL thật, một feed thực sự được cấp phép, lượt collect có dữ liệu, web đọc cùng database, quyền chỉ đọc, cảnh báo lượt chạy lỗi và khả năng restore. Nếu chưa có môi trường/nguồn, ghi rõ phần đó chưa được xác minh.

Tham khảo cấu hình cục bộ: [Docker Compose interpolation](https://docs.docker.com/reference/compose-file/interpolation/) và [PostgreSQL official image](https://hub.docker.com/_/postgres). Hợp đồng crawler dựa trên [Schema.org JobPosting](https://schema.org/JobPosting), [Google JobPosting](https://developers.google.com/search/docs/appearance/structured-data/job-posting) và [Cheerio load](https://cheerio.js.org/docs/basics/loading/).
