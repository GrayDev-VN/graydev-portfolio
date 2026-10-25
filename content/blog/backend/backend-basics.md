---
title: "What I am learning about backend boundaries"
titleVi: "Những điều mình đang học về ranh giới trong backend"
excerpt: "A few fundamentals that make APIs easier to maintain as an application grows."
excerptVi: "Một vài nền tảng giúp API dễ bảo trì hơn khi ứng dụng phát triển."
category: "Backend Development"
categoryVi: "Phát triển Backend"
publishedAt: "2026-10-14"
readingTime: "3 min read"
tags:
  - Backend
  - API Design
  - Validation
contentVi: |
  Một API backend không chỉ nhận dữ liệu rồi gọi cơ sở dữ liệu. Nó là ranh giới giữa các hệ thống, nên cần quy định rõ dữ liệu nào hợp lệ và điều gì sẽ xảy ra khi có lỗi.

  ## Xác thực dữ liệu ở biên

  Đừng giả định client luôn gửi đúng dữ liệu. Kiểm tra kiểu, độ dài và miền giá trị trước khi dùng dữ liệu trong logic nghiệp vụ. Việc này giúp lỗi được phát hiện gần nơi chúng đi vào hệ thống.

  ## Tách trách nhiệm

  Route nên điều phối request và response; phần nghiệp vụ nên có thể kiểm thử độc lập. Ranh giới rõ ràng giúp thay đổi cách lưu trữ mà không phải viết lại toàn bộ API.

  ## Trả lỗi có ích

  Mã trạng thái và thông báo lỗi cần nhất quán, đủ rõ cho client xử lý nhưng không tiết lộ thông tin nội bộ. Log phía server nên hỗ trợ điều tra mà không ghi dữ liệu nhạy cảm không cần thiết.

  Khi ứng dụng lớn dần, những quy ước nhỏ này giúp API dễ hiểu và đáng tin cậy hơn nhiều so với việc thêm nhiều lớp trừu tượng ngay từ đầu.
---

An API is more than a way to pass data to a database. It is a boundary between systems, so it should define what input is valid and what happens when something goes wrong.

## Validate at the boundary

Do not assume a client always sends correct data. Check types, lengths, and allowed values before using input in business logic. This catches problems close to where they enter the application.

## Separate responsibilities

A route should coordinate the request and response; business behavior should be testable on its own. Clear boundaries make it easier to change storage without rewriting every endpoint.

## Return useful errors

Status codes and error responses should be consistent and actionable without exposing internal details. Server logs should help investigate failures without recording unnecessary sensitive data.

As an application grows, these small conventions make an API easier to understand and trust than adding layers of abstraction before they are needed.
