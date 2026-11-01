---
title: Những điều mình đang học về ranh giới trong backend
description: Một vài nền tảng giúp API dễ bảo trì hơn khi ứng dụng phát triển.
category: backend
tags:
  - Backend
  - API Design
  - Validation
status: published
publishedAt: '2026-10-14'
---
Một API backend không chỉ nhận dữ liệu rồi gọi cơ sở dữ liệu. Nó là ranh giới giữa các hệ thống, nên cần quy định rõ dữ liệu nào hợp lệ và điều gì sẽ xảy ra khi có lỗi.

## Xác thực dữ liệu ở biên

Đừng giả định client luôn gửi đúng dữ liệu. Kiểm tra kiểu, độ dài và miền giá trị trước khi dùng dữ liệu trong logic nghiệp vụ. Việc này giúp lỗi được phát hiện gần nơi chúng đi vào hệ thống.

## Tách trách nhiệm

Route nên điều phối request và response; phần nghiệp vụ nên có thể kiểm thử độc lập. Ranh giới rõ ràng giúp thay đổi cách lưu trữ mà không phải viết lại toàn bộ API.

## Trả lỗi có ích

Mã trạng thái và thông báo lỗi cần nhất quán, đủ rõ cho client xử lý nhưng không tiết lộ thông tin nội bộ. Log phía server nên hỗ trợ điều tra mà không ghi dữ liệu nhạy cảm không cần thiết.

Khi ứng dụng lớn dần, những quy ước nhỏ này giúp API dễ hiểu và đáng tin cậy hơn nhiều so với việc thêm nhiều lớp trừu tượng ngay từ đầu.
