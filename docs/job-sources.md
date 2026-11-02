# Khảo sát nguồn job

> Cập nhật: đã bổ sung API công khai SmartRecruiters/Bosch và Lever/ShopBack; đã thu thập và hiển thị job thật. Xem [jobs-live-data.md](./jobs-live-data.md). Trạng thái chưa bật trong tài liệu này áp dụng cho năm kênh ban đầu.

Ngày kiểm tra: **03/11/2026**. Phạm vi: công cụ công khai tổng hợp Java Backend, AI Engineer và Backend tích hợp AI; Intern/Fresher/Junior tại TP.HCM.

Đây là ghi nhận kỹ thuật để quyết định bật bộ tích hợp, không phải kết luận pháp lý. Trang công khai hoặc robots.txt cho phép crawl không đồng nghĩa với quyền sao chép và đăng lại dữ liệu. Chưa có nguồn nào trong năm kênh yêu cầu được xác nhận đủ quyền để bật thu thập tự động cho ứng dụng này.

## Các nguồn mục tiêu

| Nguồn | Bằng chứng đã kiểm tra | Trạng thái đề xuất |
| --- | --- | --- |
| ITviec | [Điều khoản, mục 2.2](https://itviec.com/blog/terms-and-conditions/) yêu cầu đồng ý bằng văn bản cho việc lấy, hiển thị và sao chép nội dung ngoài sử dụng cá nhân hợp lý. [robots.txt](https://itviec.com/robots.txt) cho crawl phần lớn website, loại `/subscriptions/new`; quy tắc robots không thay thế điều khoản nội dung. | **Chờ quyền sử dụng/feed/API chính thức.** Chưa tìm thấy tài liệu API tổng hợp job công khai trong lần khảo sát này. |
| TopDev | [Thỏa thuận, mục Các Quyền Sở Hữu Trí Tuệ](https://topdev.vn/term-of-services) hạn chế sao chép/phân phối/công bố, có ngoại lệ phục vụ xem và dùng nội bộ; chưa thấy cho phép tổng hợp công khai. [robots.txt](https://topdev.vn/robots.txt) không truy cập được bằng công cụ kiểm tra. | **Chờ thỏa thuận dữ liệu.** Không dùng endpoint nội bộ được tìm thấy trên website làm bằng chứng được cấp quyền. |
| VietnamWorks | [robots.txt](https://www.vietnamworks.com/robots.txt) và [đường dẫn điều khoản đã thử](https://www.vietnamworks.com/terms-of-use) trả 403 trong công cụ kiểm tra. Chưa xác minh được nội dung điều khoản hoặc API/feed công khai. | **Chưa xác minh; mặc định tắt.** 403 không chứng minh cấm pháp lý, nhưng không vượt chặn để thu thập. Kiểm tra lại với đơn vị vận hành. |
| TopCV | [Điều khoản, mục Nội dung](https://www.topcv.vn/terms-of-service) bảo vệ nội dung TopCV và hạn chế sao chép, hiển thị, xuất bản, phân phối. [robots.txt](https://www.topcv.vn/robots.txt) cấm nhiều đường dẫn CV riêng tư; không thấy chặn toàn bộ job trong bản kiểm tra. | **Chờ quyền sử dụng/API chính thức.** Không thu thập bất kỳ CV ứng viên nào từ nguồn này. |
| LinkedIn | [User Agreement, mục 8.2](https://www.linkedin.com/legal/user-agreement) hạn chế scraping/copy bằng bot và công cụ tự động. [robots.txt](https://www.linkedin.com/robots.txt) nêu cần được cho phép rõ ràng; có hướng dẫn xin quyền crawl. | **Không bật crawler.** Chỉ dùng tích hợp được cấp phép hoặc nội dung JD người dùng có quyền cung cấp. Không dùng tài khoản/cookie cá nhân để vượt giới hạn. |

TopDev tuyển dụng là **topdev.vn**, khác với website công cụ lập trình **topdev.com.vn**. Không dùng nhầm tài liệu hai website.

## API công khai khác đã tìm thấy

### TechJobs.vn: phù hợp bộ lọc, chưa phù hợp quyền triển khai hiện tại

[Tài liệu chính thức](https://techjobs.vn/developers) có API chỉ đọc `GET /api/v1/jobs`, hỗ trợ `city=hcm`, `seniority=intern,junior`, từ khóa và kết quả chi tiết. Không có key bị giới hạn 10 tin/trang, tối đa 3 trang; API không có giá trị seniority `fresher` riêng.

Quy tắc yêu cầu ghi nguồn/link TechJobs.vn và cấm bán lại dữ liệu hoặc xây cơ sở dữ liệu việc làm cạnh tranh. Vì dự án này cũng là công cụ tìm job/CV công khai, **không tự suy ra rằng API miễn phí đồng nghĩa được dùng cho sản phẩm này**. Cần hỏi nhà cung cấp trước khi bật. Chưa gọi API để nhập dữ liệu, chưa xác nhận hiện có job phù hợp.

### Remotive: API công khai cho remote, ngoài phạm vi địa lý hiện tại

[Tài liệu do Remotive duy trì](https://github.com/remotive-com/remote-jobs-api) cho phép chia sẻ job qua API với ghi nguồn và link Remotive, giới hạn cách tái phân phối và không được buộc đăng ký/email để xem tin. Họ khuyên tối đa khoảng bốn lần lấy dữ liệu/ngày; tin trễ 24 giờ.

Feed dành cho remote, có giới hạn quốc gia theo từng tin, không bảo đảm vị trí tại TP.HCM hoặc cấp độ đầu vào. Vì vậy **không dùng để lấp danh sách HCM bằng job remote toàn cầu**. Chỉ cân nhắc khi người dùng mở rộng phạm vi và kiểm tra lại điều khoản lúc tích hợp.

## Cách triển khai khi chưa có quyền thu thập

1. Xây mô hình dữ liệu, chuẩn hóa, bộ lọc, loại trùng và giao diện độc lập với nguồn. Danh sách rỗng phải giải thích trung thực tình trạng nguồn; không hiển thị job giả như tin thật.
2. Hỗ trợ nhập dữ liệu do chủ tin/đơn vị có quyền cung cấp, kèm nguồn, link, thời điểm xác minh và căn cứ sử dụng. Việc nhập thủ công không tự tạo quyền đăng lại JD.
3. Dữ liệu mẫu chỉ nằm trong fixture kiểm thử hoặc chế độ demo được ghi nhãn; không công bố là nguồn đang đồng bộ.
4. Khi có API/feed được cấp phép: ghi lại phạm vi quyền, yêu cầu attribution, giới hạn lưu trữ, tần suất và ngày cần kiểm tra lại; chỉ bật connector đó.
5. Lấy dữ liệu bằng tác vụ định kỳ, timeout, retry hữu hạn và backoff; không gọi nguồn mỗi lần khách mở trang. Không dùng proxy xoay IP hoặc vượt CAPTCHA.

## Rủi ro cần kiểm thử khi tích hợp

- Không nhận arbitrary URL để server tải: tránh SSRF, URL có userinfo, giao thức không phải HTTPS và redirect sang host khác.
- Không render HTML JD trực tiếp; xử lý như nội dung không đáng tin, tránh XSS và chỉ dẫn nhúng cho AI.
- Phân biệt tin hết hạn đã xác minh với tin chưa kiểm tra được; không biến lỗi mạng thành “đã đóng”.
- Loại trùng không gộp các vị trí khác nhau chỉ vì cùng công ty; giữ toàn bộ link xuất xứ và ngày thu thập.
- Không đoán lương/cấp độ/địa điểm còn thiếu. Từ “JavaScript” không chứng minh Java; “AI” trong tên công ty không chứng minh AI Engineer.
- Không hạ job yêu cầu Senior xuống Junior chỉ vì JD có câu “hướng dẫn junior”. Chuẩn hóa phải đọc kinh nghiệm và tín hiệu phủ định.
- CV là luồng riêng tư ở mốc sau, không đi qua kho dữ liệu job công khai và không đưa vào fixture/log.

## Giới hạn kiểm chứng

Khảo sát dùng trang chính thức và tìm kiếm web, không crawl danh sách tin, không đăng nhập, không liên hệ nhà cung cấp và chưa có hợp đồng/API key. Kết quả có thể thay đổi; cần xác minh lại trước khi bật nguồn. Chưa tìm được nguồn có quyền được xác nhận cho đầy đủ phạm vi HCM và sản phẩm tổng hợp/CV công khai hiện tại.
