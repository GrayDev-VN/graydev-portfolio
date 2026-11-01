---
title: "Two Pointers: hiểu hai con trỏ qua LeetCode Two Sum II"
description: "Đi từ vét cạn đến lời giải O(n): hiểu vì sao dịch chuyển hai con trỏ, chứng minh tính đúng đắn và triển khai Two Sum II bằng Java."
category: backend
tags: [LeetCode, Two Pointers, Array, Java, Algorithms]
status: published
publishedAt: '2026-11-02'
---

Một bài tìm hai số có tổng cho trước có thể bắt đầu bằng hai vòng lặp. Nhưng khi mảng đã được sắp xếp, mỗi lần so sánh còn cho biết **những cặp nào chắc chắn không thể là đáp án**. Khai thác được điều đó là điểm cốt lõi của kỹ thuật Two Pointers.

Bài viết này dùng Java để đi từ ý tưởng đơn giản đến lời giải hoàn chỉnh. Đây là ghi chép hướng dẫn, không phải bản ghi một lần nộp bài trên tài khoản LeetCode.

## 1. Two Pointers là gì?

Two Pointers, hay hai con trỏ, là cách dùng hai vị trí để duyệt và thu hẹp vùng cần xử lý. Trong Java, với bài toán mảng, “con trỏ” thường chỉ là hai biến chỉ số kiểu `int`.

Có vài cách bố trí quen thuộc:

| Cách bố trí | Cách di chuyển | Ví dụ sử dụng |
| --- | --- | --- |
| Hai đầu tiến vào giữa | Một vị trí tăng, một vị trí giảm | Tìm cặp trong mảng có thứ tự, kiểm tra palindrome |
| Cùng chiều, tốc độ khác nhau | Một vị trí đọc, một vị trí ghi hoặc di chuyển chậm hơn | Loại phần tử trùng trong mảng |
| Biên trái và phải của cửa sổ | Mở rộng hoặc thu hẹp đoạn liên tiếp | Một số bài sliding window |

Hai biến chỉ số chưa đủ để tạo ra thuật toán tốt. Điều cần giải thích là: **mỗi lần di chuyển, vì sao không bỏ qua đáp án?** Bài này tập trung vào kiểu hai đầu tiến vào giữa.

## 2. Bài toán: Two Sum II

Đề gốc: [LeetCode 167 — Two Sum II: Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/).

Ta có mảng số nguyên `numbers` đã sắp xếp không giảm và giá trị `target`. Cần trả về vị trí của hai phần tử khác nhau có tổng bằng `target`. Vị trí trong kết quả được tính từ **1**, dù mảng Java bắt đầu từ **0**.

Đề đảm bảo có đúng một đáp án và yêu cầu bộ nhớ phụ hằng số. Độ dài mảng tối đa 30.000; giá trị phần tử và `target` nằm trong khoảng −1.000 đến 1.000.

Ví dụ tự phân tích:

```text
numbers = [1, 3, 4, 6, 12]
target = 10
Kết quả = [3, 4], vì numbers[2] + numbers[3] = 4 + 6 = 10.
```

Tính chất quan trọng nhất là **mảng đã có thứ tự**. Ta không cần sắp xếp lại, cũng không được tùy tiện thay đổi các vị trí cần trả về.

## 3. Bắt đầu bằng vét cạn

Một cách trực tiếp là thử mọi cặp chỉ số `i < j`:

```java
for (int i = 0; i < numbers.length - 1; i++) {
    for (int j = i + 1; j < numbers.length; j++) {
        if (numbers[i] + numbers[j] == target) {
            return new int[] {i + 1, j + 1};
        }
    }
}
```

Với `n` phần tử, số cặp có thể phải thử là `n(n - 1) / 2`. Khi `n = 30.000`, đó là 449.985.000 cặp. Độ phức tạp thời gian là `O(n²)`, bộ nhớ phụ `O(1)`.

Ta cũng có thể dùng Hash Map để tìm phần bù, nhưng sẽ cần bộ nhớ `O(n)`. Với bài này, tính có thứ tự cho phép đạt thời gian tuyến tính mà vẫn giữ bộ nhớ phụ hằng số.

## 4. Vì sao có thể di chuyển hai con trỏ?

Đặt `left = 0`, `right = numbers.length - 1`. Tính `sum = numbers[left] + numbers[right]`.

### Tổng quá nhỏ: tăng left

Nếu `sum < target`, ngay cả khi ghép phần tử ở `left` với phần tử lớn nhất còn lại, tổng vẫn chưa đủ.

Với mọi `k` nằm giữa `left + 1` và `right`:

```text
numbers[k] <= numbers[right]
numbers[left] + numbers[k] <= sum < target
```

Vậy không cặp nào trong vùng hiện tại sử dụng `left` có thể là đáp án. Bỏ vị trí đó bằng `left++` là an toàn. Tăng chỉ số có thể giữ nguyên giá trị nếu gặp phần tử trùng, nhưng vẫn thu hẹp vùng tìm kiếm.

### Tổng quá lớn: giảm right

Nếu `sum > target`, ghép phần tử ở `right` với phần tử nhỏ nhất còn lại vẫn quá lớn.

Với mọi `k` nằm giữa `left` và `right - 1`:

```text
numbers[k] >= numbers[left]
numbers[k] + numbers[right] >= sum > target
```

Không cặp hợp lệ nào trong vùng hiện tại dùng `right`. Ta có thể bỏ vị trí đó bằng `right--`.

### Tổng đúng: trả về đáp án

Khi `sum == target`, trả về `[left + 1, right + 1]`. Dùng điều kiện lặp `left < right` để tránh chọn cùng một phần tử hai lần.

Lập luận trên vẫn đúng với số âm và các giá trị trùng nhau. Nó dựa vào **thứ tự**, không dựa vào giả định mọi số đều dương.

## 5. Chạy tay từng bước

Với `numbers = [1, 3, 4, 6, 12]`, `target = 10`:

| Bước | left | right | Hai giá trị | Tổng | Xử lý |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 4 | 1 và 12 | 13 | Tổng lớn → right = 3 |
| 2 | 0 | 3 | 1 và 6 | 7 | Tổng nhỏ → left = 1 |
| 3 | 1 | 3 | 3 và 6 | 9 | Tổng nhỏ → left = 2 |
| 4 | 2 | 3 | 4 và 6 | 10 | Trả về [3, 4] |

Mỗi bước bỏ một vị trí không thể thuộc đáp án, thay vì thử lần lượt mọi cặp chứa vị trí đó.

## 6. Lời giải Java

```java
class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0;
        int right = numbers.length - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];

            if (sum == target) {
                return new int[] {left + 1, right + 1};
            }
            if (sum < target) {
                left++;
            } else {
                right--;
            }
        }

        throw new IllegalArgumentException("No valid pair");
    }
}
```

Nhánh ném exception chỉ xảy ra khi đầu vào không có đáp án, nằm ngoài giả thiết của đề. Nó giúp tránh trả về một cặp chỉ số giả nếu tái sử dụng phương thức.

Với giới hạn của bài này, tổng hai phần tử nằm trong phạm vi của `int`. Nếu dùng thuật toán cho dữ liệu số nguyên lớn hơn, có thể đổi thành `long sum = (long) numbers[left] + numbers[right];`. Phép ép kiểu phải diễn ra **trước** phép cộng để tránh tràn số ngay trong phép cộng `int`.

## 7. Tính đúng đắn và độ phức tạp

**Bất biến:** nếu đáp án chưa được tìm thấy, cả hai chỉ số của nó vẫn nằm trong đoạn `[left, right]`.

Ban đầu, đoạn này chứa toàn bộ mảng. Khi tổng nhỏ, lập luận ở phần 4 chứng minh không đáp án nào dùng vị trí `left`, nên tăng `left` vẫn giữ bất biến. Khi tổng lớn, giảm `right` cũng an toàn với lý do đối xứng. Khi tổng bằng `target`, ta trả về hai vị trí khác nhau và đúng tổng yêu cầu.

Mỗi lần chưa tìm ra đáp án, khoảng cách `right - left` giảm một. Thuật toán không thể lặp vô hạn. Vì đề đảm bảo có đáp án, vòng lặp sẽ tìm được cặp đó trước khi hai con trỏ gặp nhau.

- **Thời gian `O(n)`:** tối đa `n - 1` lần kiểm tra cặp; không có thao tác đưa con trỏ quay lại.
- **Bộ nhớ phụ `O(1)`:** chỉ giữ hai chỉ số và tổng. Mảng kết quả có đúng hai phần tử, không tăng theo `n`.

## 8. Các ca kiểm thử nên tự chạy

| Mục đích | numbers | target | Kết quả mong đợi |
| --- | --- | --- | --- |
| Di chuyển cả hai phía | [1, 3, 4, 6, 12] | 10 | [3, 4] |
| Mảng chỉ có hai phần tử | [1, 8] | 9 | [1, 2] |
| Có số âm | [-8, -3, 0, 2, 9] | -6 | [1, 4] |
| Hai giá trị bằng nhau, khác vị trí | [3, 3] | 6 | [1, 2] |
| Hai đầu là đáp án | [1, 4, 6, 12] | 13 | [1, 4] |

Đừng chỉ kiểm tra tổng đúng. Cần kiểm tra thứ tự hai chỉ số, đánh số từ 1 và không dùng lại cùng vị trí.

## 9. Những lỗi dễ gặp

- Dùng `left <= right`, cho phép một phần tử được dùng hai lần.
- Trả `[left, right]` và quên chuyển sang chỉ số bắt đầu từ 1.
- Tổng nhỏ nhưng lại giảm `right`, khiến tổng chỉ nhỏ hơn hoặc giữ nguyên.
- Luôn tăng cả hai con trỏ sau mỗi lần so sánh, có thể bỏ qua đáp án.
- Dùng cùng quy tắc cho mảng chưa sắp xếp: mất tính đơn điệu nên không còn chứng minh được bước loại bỏ.
- Sắp xếp trực tiếp mảng của bài Two Sum thông thường rồi trả chỉ số mới, làm mất vị trí trong đầu vào ban đầu.

## 10. Ghi nhớ và luyện tiếp

Khi gặp bài tìm cặp trên dữ liệu có thứ tự, hãy thử đặt hai con trỏ ở hai đầu. Trước khi viết code, tự trả lời: tổng lớn thì bỏ được những cặp nào, tổng nhỏ thì bỏ được những cặp nào?

Có thể luyện tiếp theo các hướng: palindrome để thực hành hai đầu tiến vào; loại trùng trong mảng để học hai con trỏ cùng chiều; hoặc bài tìm ba số có tổng cho trước bằng cách cố định một phần tử rồi tìm cặp trên phần còn lại.

Khi ôn lại, bổ sung cách giải khác, phản ví dụ hoặc lỗi từng gặp ngay trong bài này, rồi cập nhật `updatedAt` của file Markdown. Một ghi chép tốt nên giúp mình giải thích được **vì sao thuật toán đúng**, kể cả khi đã quên code.
