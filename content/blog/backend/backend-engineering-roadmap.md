---
title: "Java Collections Framework: List, Set, Map and How to Choose"
titleVi: "Java Collections Framework: List, Set, Map và cách lựa chọn"
excerpt: "Understand Java Collections Framework from the ground up — List, Set, Map, common implementations, time complexity, equals and hashCode, and practical patterns for backend development."
excerptVi: "Tìm hiểu Java Collections Framework từ nền tảng: List, Set, Map, các implementation phổ biến, độ phức tạp thuật toán, equals và hashCode, cùng những ứng dụng thực tế trong phát triển Backend."
category: "Java Development"
categoryVi: "Phát triển Java"
publishedAt: "2026-10-26"
readingTime: "12 min read"
tags:
  - Java
  - Java Core
  - Collections Framework
  - Data Structures
  - Backend Engineering
contentVi: |
  # Java Collections Framework: List, Set, Map và cách lựa chọn

  Khi bắt đầu học Java, chúng ta thường làm quen với biến, mảng, vòng lặp và các câu lệnh điều kiện. Nhưng khi chuyển sang xây dựng một ứng dụng thực tế, đặc biệt là Backend, việc lưu trữ và thao tác với dữ liệu trở nên phức tạp hơn rất nhiều.

  Hãy tưởng tượng bạn đang xây dựng một hệ thống ngân hàng. Bạn cần lưu lịch sử giao dịch, đảm bảo mỗi mã giao dịch là duy nhất và tìm kiếm tài khoản dựa trên mã định danh. Liệu một mảng thông thường có phải lựa chọn tốt nhất cho tất cả những nhu cầu này?

  Đây là lúc **Java Collections Framework (JCF)** phát huy vai trò.

  Trong bài viết này, chúng ta sẽ tìm hiểu ba interface cốt lõi: `List`, `Set` và `Map`, cách lựa chọn implementation phù hợp, độ phức tạp của các thao tác và những lỗi thường gặp khi sử dụng Collections trong ứng dụng Backend.

  ## 1. Java Collections Framework là gì?

  Java Collections Framework là một tập hợp các interface, implementation và thuật toán được cung cấp bởi Java để lưu trữ, truy xuất và thao tác với nhóm đối tượng.

  Thay vì tự xây dựng cấu trúc dữ liệu từ đầu, chúng ta có thể sử dụng những implementation có sẵn như `ArrayList`, `HashSet` và `HashMap`.

  JCF chủ yếu nằm trong package `java.util`, trong khi các cấu trúc phục vụ xử lý đồng thời như `ConcurrentHashMap` nằm trong `java.util.concurrent`.

  ### Ba interface quan trọng nhất

  | Interface | Đặc điểm | Ví dụ sử dụng |
  |---|---|---|
  | `List<E>` | Có thứ tự, cho phép phần tử trùng lặp, truy cập theo index | Danh sách giao dịch |
  | `Set<E>` | Không cho phép các phần tử trùng nhau theo quy tắc equality của implementation | Tập mã giao dịch duy nhất |
  | `Map<K, V>` | Ánh xạ key sang value; mỗi key là duy nhất | Tra cứu tài khoản theo ID |

  Lưu ý: `Map` là một phần của Collections Framework nhưng không kế thừa interface `Collection`.

  Một cách ghi nhớ đơn giản:

  - `List`: Tôi cần giữ một danh sách.
  - `Set`: Tôi cần đảm bảo không có phần tử trùng nhau.
  - `Map`: Tôi cần tìm một giá trị thông qua một key.

  ## 2. List: Khi thứ tự dữ liệu quan trọng

  `List` biểu diễn một chuỗi phần tử có thứ tự. Phần tử có thể xuất hiện nhiều lần và có thể được truy cập thông qua vị trí index.

  ### 2.1. ArrayList

  `ArrayList` là implementation dựa trên mảng có thể thay đổi kích thước.

  Đặc điểm:

  - Truy cập theo index thường có độ phức tạp O(1).
  - Thêm phần tử vào cuối thường có chi phí khấu hao O(1).
  - Chèn hoặc xóa ở giữa thường tốn O(n) do phải dịch chuyển các phần tử.
  - Không tự đồng bộ hóa các thao tác để đảm bảo an toàn khi nhiều thread cùng truy cập.

  Ví dụ:

  ```java
  import java.util.ArrayList;
  import java.util.List;

  public class ListExample {
      public static void main(String[] args) {
          List<String> transactions = new ArrayList<>();

          transactions.add("TXN-001");
          transactions.add("TXN-002");
          transactions.add("TXN-001");

          System.out.println(transactions);
          System.out.println(transactions.get(1));
      }
  }
  ```

  Output:

  ```text
  [TXN-001, TXN-002, TXN-001]
  TXN-002
  ```

  Mã `TXN-001` xuất hiện hai lần vì `List` cho phép phần tử trùng lặp.

  **Khi nào nên dùng ArrayList?**

  Đây thường là lựa chọn mặc định khi bạn cần lưu danh sách dữ liệu, duyệt phần tử hoặc truy cập theo index.

  Ví dụ trong Backend: danh sách sản phẩm của một đơn hàng, danh sách giao dịch đã truy vấn hoặc danh sách DTO trả về từ API.

  ### 2.2. LinkedList

  `LinkedList` là danh sách liên kết kép. Mỗi node liên kết với node trước và node sau.

  Đặc điểm:

  - Truy cập theo index có độ phức tạp O(n) vì phải duyệt các node.
  - Thêm hoặc xóa ở đầu hoặc cuối có chi phí O(1).
  - Khi đã có iterator hoặc vị trí node phù hợp, việc thay đổi liên kết có thể thực hiện trong O(1).
  - Tốn thêm bộ nhớ cho các liên kết giữa node và thường có locality of reference kém hơn `ArrayList`.

  Ví dụ:

  ```java
  import java.util.LinkedList;
  import java.util.List;

  public class LinkedListExample {
      public static void main(String[] args) {
          List<String> events = new LinkedList<>();

          events.add("LOGIN");
          events.add("VIEW_ACCOUNT");
          events.add("LOGOUT");

          System.out.println(events);
      }
  }
  ```

  Output:

  ```text
  [LOGIN, VIEW_ACCOUNT, LOGOUT]
  ```

  Tuy nhiên, không nên kết luận rằng `LinkedList` luôn nhanh hơn `ArrayList` khi thêm hoặc xóa. Nếu phải tìm vị trí bằng index trước khi sửa, bước tìm kiếm vẫn tốn O(n). Chi phí bộ nhớ và cache locality cũng ảnh hưởng đến hiệu năng thực tế.

  **Quy tắc thực tế:** ưu tiên `ArrayList` nếu chưa có lý do rõ ràng để chọn `LinkedList`.

  ## 3. Set: Khi tính duy nhất quan trọng

  `Set` biểu diễn một tập hợp không chứa các phần tử trùng nhau theo quy tắc xác định equality của implementation.

  Có ba implementation thường gặp: `HashSet`, `LinkedHashSet` và `TreeSet`.

  ### 3.1. HashSet

  `HashSet` sử dụng cấu trúc dựa trên bảng băm để quản lý các phần tử.

  Đặc điểm:

  - `add`, `remove` và `contains` thường có độ phức tạp O(1) trong điều kiện băm tốt.
  - Không đảm bảo thứ tự duyệt.
  - Cho phép tối đa một phần tử `null`.
  - Tính duy nhất phụ thuộc vào `equals()` và `hashCode()` của phần tử.

  Ví dụ:

  ```java
  import java.util.HashSet;
  import java.util.Set;

  public class SetExample {
      public static void main(String[] args) {
          Set<String> transactionIds = new HashSet<>();

          transactionIds.add("TXN-001");
          transactionIds.add("TXN-002");
          transactionIds.add("TXN-001");

          System.out.println(transactionIds.size());
          System.out.println(transactionIds.contains("TXN-002"));
      }
  }
  ```

  Output:

  ```text
  2
  true
  ```

  `HashSet` chỉ giữ một giá trị `"TXN-001"` vì hai chuỗi có cùng nội dung được xem là bằng nhau.

  **Ứng dụng:** loại bỏ phần tử trùng, kiểm tra một mã đã xuất hiện trong tập dữ liệu hay chưa, hoặc theo dõi các ID đã xử lý trong một phạm vi nhất định.

  Lưu ý rằng `Set` chỉ giúp duy trì tính duy nhất trong chính collection đó. Nó không tự đảm bảo tính duy nhất giữa nhiều request, nhiều instance ứng dụng hoặc nhiều giao dịch cơ sở dữ liệu.

  ### 3.2. LinkedHashSet

  `LinkedHashSet` kết hợp bảng băm với các liên kết để duy trì thứ tự chèn.

  ```java
  import java.util.LinkedHashSet;
  import java.util.Set;

  public class LinkedHashSetExample {
      public static void main(String[] args) {
          Set<String> roles = new LinkedHashSet<>();

          roles.add("USER");
          roles.add("ADMIN");
          roles.add("USER");

          System.out.println(roles);
      }
  }
  ```

  Output:

  ```text
  [USER, ADMIN]
  ```

  Đây là lựa chọn phù hợp khi bạn cần loại bỏ phần tử trùng nhưng vẫn muốn giữ thứ tự chèn.

  ### 3.3. TreeSet

  `TreeSet` lưu phần tử theo thứ tự sắp xếp dựa trên natural ordering hoặc một `Comparator`.

  ```java
  import java.util.Set;
  import java.util.TreeSet;

  public class TreeSetExample {
      public static void main(String[] args) {
          Set<Integer> scores = new TreeSet<>();

          scores.add(90);
          scores.add(70);
          scores.add(80);
          scores.add(70);

          System.out.println(scores);
      }
  }
  ```

  Output:

  ```text
  [70, 80, 90]
  ```

  Những thao tác tìm kiếm, thêm và xóa thông thường có độ phức tạp O(log n).

  Một điểm cần chú ý: `TreeSet` xác định phần tử trùng dựa trên kết quả so sánh bằng 0 từ natural ordering hoặc `Comparator`. Vì vậy, comparator nên nhất quán với `equals()` nếu bạn muốn giữ ngữ nghĩa equality thông thường của Java.

  Ngoài ra, `TreeSet` không chấp nhận `null` với natural ordering; việc hỗ trợ `null` với comparator phụ thuộc vào comparator đó.

  ## 4. Map: Khi cần tra cứu bằng key

  `Map<K, V>` lưu các cặp key-value. Mỗi key chỉ ánh xạ đến một value tại một thời điểm.

  Nếu gọi `put()` với key đã tồn tại, value cũ sẽ được thay thế.

  ### 4.1. HashMap

  `HashMap` là implementation dựa trên bảng băm.

  Đặc điểm:

  - `get`, `put` và `remove` thường có độ phức tạp O(1) trong điều kiện băm tốt.
  - Không đảm bảo thứ tự duyệt.
  - Cho phép một key `null` và nhiều value `null`.
  - Không đồng bộ hóa để đảm bảo an toàn cho các thao tác cập nhật đồng thời.

  Ví dụ:

  ```java
  import java.util.HashMap;
  import java.util.Map;

  public class MapExample {
      public static void main(String[] args) {
          Map<String, Long> balances = new HashMap<>();

          balances.put("ACC-001", 1_000_000L);
          balances.put("ACC-002", 2_500_000L);

          System.out.println(balances.get("ACC-001"));

          balances.put("ACC-001", 1_200_000L);

          System.out.println(balances.get("ACC-001"));
          System.out.println(balances.size());
      }
  }
  ```

  Output:

  ```text
  1000000
  1200000
  2
  ```

  Khi thêm một value mới cho key `"ACC-001"`, `HashMap` cập nhật ánh xạ hiện có thay vì tạo một key mới.

  **Ứng dụng trong Backend:**

  - Tra cứu dữ liệu theo ID trong phạm vi xử lý.
  - Đếm số lần xuất hiện của một phần tử.
  - Nhóm dữ liệu theo trạng thái.
  - Lưu kết quả tính toán tạm thời trong bộ nhớ.

  Tuy nhiên, `HashMap` trong bộ nhớ của một ứng dụng không phải database và không phải distributed cache. Dữ liệu có thể mất khi ứng dụng dừng và không tự đồng bộ giữa các instance.

  ### 4.2. LinkedHashMap

  `LinkedHashMap` duy trì thứ tự duyệt xác định, thông thường là thứ tự chèn.

  ```java
  import java.util.LinkedHashMap;
  import java.util.Map;

  public class LinkedHashMapExample {
      public static void main(String[] args) {
          Map<String, Integer> priorities = new LinkedHashMap<>();

          priorities.put("LOW", 1);
          priorities.put("MEDIUM", 2);
          priorities.put("HIGH", 3);

          System.out.println(priorities);
      }
  }
  ```

  Output:

  ```text
  {LOW=1, MEDIUM=2, HIGH=3}
  ```

  `LinkedHashMap` cũng hỗ trợ chế độ duy trì thứ tự truy cập, hữu ích khi triển khai một số dạng cache như LRU. Tuy nhiên, muốn có cache giới hạn dung lượng đúng nghĩa, bạn vẫn phải thiết kế chính sách loại bỏ phần tử.

  ### 4.3. TreeMap

  `TreeMap` duy trì key theo thứ tự sắp xếp.

  ```java
  import java.util.Map;
  import java.util.TreeMap;

  public class TreeMapExample {
      public static void main(String[] args) {
          Map<Integer, String> statusCodes = new TreeMap<>();

          statusCodes.put(500, "Internal Server Error");
          statusCodes.put(200, "OK");
          statusCodes.put(404, "Not Found");

          System.out.println(statusCodes);
      }
  }
  ```

  Output:

  ```text
  {200=OK, 404=Not Found, 500=Internal Server Error}
  ```

  `TreeMap` thường phù hợp khi bạn cần dữ liệu có thứ tự theo key, truy vấn theo khoảng hoặc tìm key gần nhất. Các thao tác cơ bản như `get`, `put` và `remove` có độ phức tạp O(log n).

  ## 5. Bảng so sánh: Nên chọn implementation nào?

  | Nhu cầu | Lựa chọn thường dùng | Lý do |
  |---|---|---|
  | Danh sách có thứ tự, truy cập index | `ArrayList` | Truy cập ngẫu nhiên hiệu quả |
  | Loại bỏ phần tử trùng | `HashSet` | Kiểm tra thành viên thường nhanh |
  | Set không trùng, giữ thứ tự chèn | `LinkedHashSet` | Duy trì thứ tự duyệt |
  | Set có thứ tự sắp xếp | `TreeSet` | Duy trì thứ tự theo comparator |
  | Tra cứu key-value thông thường | `HashMap` | Truy xuất trung bình hiệu quả |
  | Map giữ thứ tự chèn | `LinkedHashMap` | Thứ tự duyệt xác định |
  | Map sắp xếp theo key | `TreeMap` | Hỗ trợ truy vấn theo thứ tự |
  | Map được cập nhật đồng thời từ nhiều thread | `ConcurrentHashMap` | Cung cấp các thao tác đồng thời phù hợp |

  Các độ phức tạp trên là mức thường gặp, không phải cam kết rằng mọi thao tác luôn có thời gian chạy giống nhau. Hiệu năng còn phụ thuộc vào kích thước dữ liệu, phân bố hash, comparator, bộ nhớ và workload.

  ## 6. Hiểu equals() và hashCode()

  Đây là một trong những phần quan trọng nhất khi làm việc với `HashSet` và `HashMap`.

  Java sử dụng `equals()` để xác định hai object có được xem là bằng nhau hay không. `hashCode()` cung cấp giá trị hash được sử dụng trong các cấu trúc dữ liệu dựa trên bảng băm.

  Quy tắc quan trọng:

  **Nếu hai object bằng nhau theo `equals()`, chúng phải có cùng `hashCode()`. Chiều ngược lại không bắt buộc đúng.**

  Hai object có cùng hash code vẫn có thể khác nhau theo `equals()`.

  ### Ví dụ lỗi thường gặp

  ```java
  import java.util.HashSet;
  import java.util.Set;

  class User {
      private final String email;

      User(String email) {
          this.email = email;
      }
  }

  public class EqualityBug {
      public static void main(String[] args) {
          Set<User> users = new HashSet<>();

          users.add(new User("gray@example.com"));
          users.add(new User("gray@example.com"));

          System.out.println(users.size());
      }
  }
  ```

  Output:

  ```text
  2
  ```

  Vì `User` chưa override `equals()` và `hashCode()`, hai instance khác nhau được xem là khác nhau theo hành vi mặc định của `Object`.

  ### Cách sửa

  Với Java 21, có thể dùng `record` nếu mô hình dữ liệu phù hợp:

  ```java
  import java.util.HashSet;
  import java.util.Set;

  record User(String email) {}

  public class EqualityFixed {
      public static void main(String[] args) {
          Set<User> users = new HashSet<>();

          users.add(new User("gray@example.com"));
          users.add(new User("gray@example.com"));

          System.out.println(users.size());
      }
  }
  ```

  Output:

  ```text
  1
  ```

  `record` tự tạo `equals()` và `hashCode()` dựa trên các thành phần của record.

  Nếu sử dụng class thông thường, hãy override cả hai method theo cùng một định nghĩa equality.

  Một lưu ý nâng cao: không nên thay đổi các trường tham gia vào `equals()` hoặc `hashCode()` của một object trong khi object đó đang được dùng làm key của `HashMap` hoặc phần tử của `HashSet`. Thay đổi đó có thể khiến collection không tìm thấy phần tử như mong đợi.

  ## 7. Những sai lầm phổ biến khi sử dụng Collections

  ### Sai lầm 1: Giả định HashMap luôn giữ thứ tự chèn

  `HashMap` không cam kết thứ tự duyệt. Nếu thứ tự là một yêu cầu nghiệp vụ, hãy chọn `LinkedHashMap` hoặc `TreeMap` theo nhu cầu.

  ### Sai lầm 2: Cho rằng Set giải quyết mọi vấn đề trùng lặp

  `Set` chỉ duy trì tính duy nhất theo equality trong chính collection. Nó không đảm bảo tính duy nhất xuyên nhiều request hoặc nhiều máy chủ.

  Với mã giao dịch trong hệ thống thực tế, hãy cân nhắc unique constraint trong database và cơ chế idempotency phù hợp.

  ### Sai lầm 3: Sử dụng ArrayList cho mọi tình huống

  `ArrayList` là lựa chọn mặc định tốt cho nhiều trường hợp, nhưng không phải lúc nào cũng tối ưu. Nếu cần duy trì thứ tự sắp xếp, tra cứu theo key hoặc xử lý hàng đợi, các cấu trúc khác có thể phù hợp hơn.

  ### Sai lầm 4: Cho rằng Collections thông thường an toàn khi nhiều thread cùng cập nhật

  `ArrayList`, `HashSet` và `HashMap` không tự cung cấp cơ chế đồng bộ hóa cho các thao tác cập nhật đồng thời.

  Với `Map` cần truy cập đồng thời, có thể cân nhắc `ConcurrentHashMap`. Nhưng nếu nghiệp vụ cần thực hiện nhiều thao tác như một đơn vị nguyên tử, chỉ đổi sang collection concurrent chưa chắc đã đủ.

  ### Sai lầm 5: Dùng List để tìm kiếm liên tục mà không cân nhắc chi phí

  `list.contains(value)` thường cần duyệt O(n). Nếu phải kiểm tra thành viên nhiều lần trên một tập dữ liệu lớn, một `HashSet` có thể phù hợp hơn, miễn là bạn không cần các đặc tính về thứ tự và index của `List`.

  ## 8. Mini Project: Transaction Analyzer

  Hãy xây dựng một chương trình nhỏ mô phỏng việc phân tích lịch sử giao dịch.

  Yêu cầu:

  - Dùng `List` để lưu các giao dịch theo thứ tự đầu vào.
  - Dùng `Set` để xác định các mã giao dịch duy nhất.
  - Dùng `Map` để đếm số giao dịch theo trạng thái.
  - In ra tổng số giao dịch, số mã duy nhất và số giao dịch theo từng trạng thái.

  ```java
  import java.util.ArrayList;
  import java.util.HashMap;
  import java.util.HashSet;
  import java.util.List;
  import java.util.Map;
  import java.util.Set;

  record Transaction(String id, String status) {}

  public class TransactionAnalyzer {
      public static void main(String[] args) {
          List<Transaction> transactions = new ArrayList<>();

          transactions.add(new Transaction("TXN-001", "SUCCESS"));
          transactions.add(new Transaction("TXN-002", "FAILED"));
          transactions.add(new Transaction("TXN-003", "SUCCESS"));
          transactions.add(new Transaction("TXN-001", "SUCCESS"));

          Set<String> uniqueIds = new HashSet<>();
          Map<String, Integer> countByStatus = new HashMap<>();

          for (Transaction transaction : transactions) {
              uniqueIds.add(transaction.id());

              countByStatus.merge(
                  transaction.status(),
                  1,
                  Integer::sum
              );
          }

          System.out.println("Total records: " + transactions.size());
          System.out.println("Unique transaction IDs: " + uniqueIds.size());
          System.out.println("Counts by status: " + countByStatus);
      }
  }
  ```

  Output có thể là:

  ```text
  Total records: 4
  Unique transaction IDs: 3
  Counts by status: {SUCCESS=3, FAILED=1}
  ```

  Thứ tự các key khi in `HashMap` không được đảm bảo.

  Điểm cần chú ý: chương trình đếm trạng thái theo từng bản ghi, trong khi số mã duy nhất được tính riêng. Nếu cùng một mã giao dịch xuất hiện nhiều lần, số bản ghi và số mã duy nhất sẽ khác nhau.

  Đây là ví dụ nhỏ nhưng phản ánh một nguyên tắc quan trọng của Backend: chọn cấu trúc dữ liệu theo đúng ý nghĩa nghiệp vụ, không chỉ theo cú pháp.

  ## 9. Bài tập thực hành

  ### Level 1 — Fundamentals

  1. Tạo một `List<Integer>` chứa các số nguyên và tìm giá trị lớn nhất.
  2. Loại bỏ các phần tử trùng lặp khỏi một danh sách nhưng vẫn giữ thứ tự xuất hiện đầu tiên.
  3. Đếm số lần xuất hiện của từng từ trong một đoạn văn bằng `HashMap`.

  ### Level 2 — Implementation Choices

  4. Viết chương trình so sánh thứ tự duyệt của `HashSet`, `LinkedHashSet` và `TreeSet`.
  5. Tạo class `Product` và định nghĩa equality dựa trên mã sản phẩm.
  6. Giải thích vì sao `ArrayList` phù hợp với truy cập index hơn `LinkedList` trong trường hợp thông thường.

  ### Level 3 — Backend Thinking

  7. Thiết kế cấu trúc dữ liệu cho lịch sử giao dịch, trong đó cần giữ thứ tự, kiểm tra mã trùng và thống kê theo trạng thái.
  8. Giải thích vì sao `HashMap` trong bộ nhớ không thể thay thế database trong một hệ thống chạy nhiều instance.
  9. Nếu hai thread cùng cập nhật một bộ đếm trong `HashMap`, những vấn đề gì có thể xảy ra? Đề xuất giải pháp và giải thích giới hạn của giải pháp đó.

  ## 10. Checklist: Khi nào bạn thực sự hiểu Collections?

  - [ ] Phân biệt được `Collection` và `Map`.
  - [ ] Giải thích được khác biệt giữa `List`, `Set` và `Map`.
  - [ ] Chọn được `ArrayList`, `HashSet`, `LinkedHashSet`, `TreeSet`, `HashMap` và `TreeMap` dựa trên yêu cầu.
  - [ ] Hiểu độ phức tạp Big-O của các thao tác thông thường.
  - [ ] Hiểu hợp đồng `equals()` và `hashCode()`.
  - [ ] Nhận biết giới hạn về thread safety của collections thông thường.
  - [ ] Hoàn thành mini project Transaction Analyzer.
  - [ ] Giải thích được khi nào collection trong bộ nhớ không đủ cho yêu cầu của hệ thống Backend.

  ## Kết luận

  Java Collections Framework không chỉ là một nhóm class dùng để lưu dữ liệu. Đây là bộ công cụ giúp bạn lựa chọn cấu trúc phù hợp với yêu cầu về thứ tự, tính duy nhất, khả năng tra cứu, hiệu năng và an toàn khi truy cập đồng thời.

  Khi làm Backend, đừng bắt đầu bằng câu hỏi “Collection nào nhanh nhất?”. Hãy bắt đầu bằng câu hỏi “Dữ liệu này cần đảm bảo điều gì?”.

  Một khi hiểu rõ yêu cầu và trade-off, việc chọn cấu trúc dữ liệu sẽ trở thành một quyết định kỹ thuật có cơ sở thay vì chỉ là thói quen.

  ### References

  - [Oracle Java Collections Framework Overview](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/doc-files/coll-overview.html)
  - [Java Collections Framework — Dev.java](https://dev.java/learn/api/collections-and-streams/collections-framework/)
  - [Java Object API — equals() and hashCode()](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html)
  - [Java Collections API — Java SE 21](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/package-summary.html)

contentEn: |
  # Java Collections Framework: List, Set, Map and How to Choose

  When learning Java, we usually start with variables, arrays, loops, and conditional statements. But when we build real applications, especially backend services, managing data becomes more complex.

  Imagine building a banking system. You need to store transaction history, track unique transaction IDs, and retrieve accounts by their identifiers. Is a regular array the best choice for every requirement?

  This is where the **Java Collections Framework (JCF)** becomes useful.

  In this article, we will explore the three core interfaces — `List`, `Set`, and `Map` — along with their common implementations, time complexity, practical selection criteria, and mistakes to avoid in backend development.

  ## 1. What Is the Java Collections Framework?

  The Java Collections Framework is a set of interfaces, implementations, and algorithms for storing, retrieving, and manipulating groups of objects.

  Instead of implementing data structures from scratch, developers can use existing implementations such as `ArrayList`, `HashSet`, and `HashMap`.

  Most collection types belong to `java.util`. Concurrent data structures such as `ConcurrentHashMap` are provided by `java.util.concurrent`.

  ### The three core interfaces

  | Interface | Main characteristics | Example use case |
  |---|---|---|
  | `List<E>` | Ordered, generally allows duplicates, supports index-based access | Transaction history |
  | `Set<E>` | Prevents duplicate elements according to its equality semantics | Unique transaction IDs |
  | `Map<K, V>` | Maps unique keys to values | Account lookup by ID |

  Note that `Map` is part of the Collections Framework, but it does not extend the `Collection` interface.

  A simple mental model:

  - `List`: I need a sequence of elements.
  - `Set`: I need unique elements.
  - `Map`: I need to retrieve a value using a key.

  ## 2. List: When Order Matters

  A `List` represents an ordered sequence. Elements may appear more than once and can be accessed by their index.

  ### 2.1. ArrayList

  `ArrayList` is a resizable-array implementation of `List`.

  Key characteristics:

  - Index-based access is typically O(1).
  - Appending an element is amortized O(1).
  - Inserting or removing elements in the middle is generally O(n) because elements must be shifted.
  - It does not synchronize its operations to provide thread safety.

  Example:

  ```java
  import java.util.ArrayList;
  import java.util.List;

  public class ListExample {
      public static void main(String[] args) {
          List<String> transactions = new ArrayList<>();

          transactions.add("TXN-001");
          transactions.add("TXN-002");
          transactions.add("TXN-001");

          System.out.println(transactions);
          System.out.println(transactions.get(1));
      }
  }
  ```

  Output:

  ```text
  [TXN-001, TXN-002, TXN-001]
  TXN-002
  ```

  `TXN-001` appears twice because a `List` allows duplicates.

  **When should you use ArrayList?**

  It is a strong default when you need a collection of elements, iteration, or efficient index-based access.

  Typical backend examples include order items, queried transaction records, and lists of response DTOs.

  ### 2.2. LinkedList

  `LinkedList` is a doubly linked list. Each node links to the previous and next nodes.

  Key characteristics:

  - Index-based access takes O(n) because nodes must be traversed.
  - Insertion or removal at either end takes O(1).
  - Once a node or suitable iterator position is available, changing links can take O(1).
  - It requires additional memory for links and typically has poorer locality of reference than `ArrayList`.

  Example:

  ```java
  import java.util.LinkedList;
  import java.util.List;

  public class LinkedListExample {
      public static void main(String[] args) {
          List<String> events = new LinkedList<>();

          events.add("LOGIN");
          events.add("VIEW_ACCOUNT");
          events.add("LOGOUT");

          System.out.println(events);
      }
  }
  ```

  Output:

  ```text
  [LOGIN, VIEW_ACCOUNT, LOGOUT]
  ```

  However, `LinkedList` is not automatically faster for every insertion or removal. Finding an index first still takes O(n), and memory overhead and cache locality also affect real-world performance.

  **Practical rule:** prefer `ArrayList` unless you have a specific reason to choose `LinkedList`.

  ## 3. Set: When Uniqueness Matters

  A `Set` represents a collection without duplicate elements, according to the equality semantics of its implementation.

  Three common implementations are `HashSet`, `LinkedHashSet`, and `TreeSet`.

  ### 3.1. HashSet

  `HashSet` uses a hash-table-based structure to manage elements.

  Key characteristics:

  - `add`, `remove`, and `contains` are typically O(1) under good hashing conditions.
  - Iteration order is not guaranteed.
  - It allows at most one `null` element.
  - Uniqueness depends on the elements' `equals()` and `hashCode()` implementations.

  Example:

  ```java
  import java.util.HashSet;
  import java.util.Set;

  public class SetExample {
      public static void main(String[] args) {
          Set<String> transactionIds = new HashSet<>();

          transactionIds.add("TXN-001");
          transactionIds.add("TXN-002");
          transactionIds.add("TXN-001");

          System.out.println(transactionIds.size());
          System.out.println(transactionIds.contains("TXN-002"));
      }
  }
  ```

  Output:

  ```text
  2
  true
  ```

  The set keeps only one `"TXN-001"` because equal strings with the same content are considered equal.

  **Use cases:** removing duplicates, checking membership, or tracking IDs already processed within a defined scope.

  A `Set` only guarantees uniqueness within that collection. It does not automatically enforce uniqueness across multiple requests, application instances, or database transactions.

  ### 3.2. LinkedHashSet

  `LinkedHashSet` combines a hash table with linked entries to preserve insertion order.

  ```java
  import java.util.LinkedHashSet;
  import java.util.Set;

  public class LinkedHashSetExample {
      public static void main(String[] args) {
          Set<String> roles = new LinkedHashSet<>();

          roles.add("USER");
          roles.add("ADMIN");
          roles.add("USER");

          System.out.println(roles);
      }
  }
  ```

  Output:

  ```text
  [USER, ADMIN]
  ```

  Use it when you want unique elements while preserving insertion order.

  ### 3.3. TreeSet

  `TreeSet` keeps elements sorted according to their natural ordering or a supplied `Comparator`.

  ```java
  import java.util.Set;
  import java.util.TreeSet;

  public class TreeSetExample {
      public static void main(String[] args) {
          Set<Integer> scores = new TreeSet<>();

          scores.add(90);
          scores.add(70);
          scores.add(80);
          scores.add(70);

          System.out.println(scores);
      }
  }
  ```

  Output:

  ```text
  [70, 80, 90]
  ```

  Common search, insertion, and removal operations take O(log n).

  An important detail: `TreeSet` determines duplicates using whether its comparator, or natural ordering, considers two elements equal by returning zero. A comparator should be consistent with `equals()` when conventional Java equality semantics are required.

  `TreeSet` with natural ordering does not accept `null`; support for `null` with a custom comparator depends on that comparator.

  ## 4. Map: When You Need Key-Based Lookup

  A `Map<K, V>` stores key-value associations. Each key maps to at most one value at a time.

  Calling `put()` with an existing key replaces its previous value.

  ### 4.1. HashMap

  `HashMap` is a hash-table-based implementation of `Map`.

  Key characteristics:

  - `get`, `put`, and `remove` are typically O(1) under good hashing conditions.
  - Iteration order is not guaranteed.
  - It permits one `null` key and multiple `null` values.
  - It does not synchronize updates to make concurrent access safe.

  Example:

  ```java
  import java.util.HashMap;
  import java.util.Map;

  public class MapExample {
      public static void main(String[] args) {
          Map<String, Long> balances = new HashMap<>();

          balances.put("ACC-001", 1_000_000L);
          balances.put("ACC-002", 2_500_000L);

          System.out.println(balances.get("ACC-001"));

          balances.put("ACC-001", 1_200_000L);

          System.out.println(balances.get("ACC-001"));
          System.out.println(balances.size());
      }
  }
  ```

  Output:

  ```text
  1000000
  1200000
  2
  ```

  Adding a new value for `"ACC-001"` updates the existing mapping instead of creating another key.

  **Backend use cases:**

  - Looking up data by ID within a processing scope.
  - Counting occurrences.
  - Grouping data by status.
  - Storing temporary computation results in memory.

  A `HashMap` is not a database or distributed cache. Its contents can disappear when the application stops, and separate application instances do not automatically share the same map.

  ### 4.2. LinkedHashMap

  `LinkedHashMap` maintains a predictable iteration order, usually insertion order.

  ```java
  import java.util.LinkedHashMap;
  import java.util.Map;

  public class LinkedHashMapExample {
      public static void main(String[] args) {
          Map<String, Integer> priorities = new LinkedHashMap<>();

          priorities.put("LOW", 1);
          priorities.put("MEDIUM", 2);
          priorities.put("HIGH", 3);

          System.out.println(priorities);
      }
  }
  ```

  Output:

  ```text
  {LOW=1, MEDIUM=2, HIGH=3}
  ```

  `LinkedHashMap` also supports access-order iteration, which is useful for implementing some LRU-style caches. A proper bounded cache still needs an eviction policy.

  ### 4.3. TreeMap

  `TreeMap` keeps its keys sorted.

  ```java
  import java.util.Map;
  import java.util.TreeMap;

  public class TreeMapExample {
      public static void main(String[] args) {
          Map<Integer, String> statusCodes = new TreeMap<>();

          statusCodes.put(500, "Internal Server Error");
          statusCodes.put(200, "OK");
          statusCodes.put(404, "Not Found");

          System.out.println(statusCodes);
      }
  }
  ```

  Output:

  ```text
  {200=OK, 404=Not Found, 500=Internal Server Error}
  ```

  `TreeMap` is useful when keys must be sorted, when you need range queries, or when you need to find nearby keys. Basic operations such as `get`, `put`, and `remove` typically take O(log n).

  ## 5. Comparison: Which Implementation Should You Choose?

  | Requirement | Typical choice | Why |
  |---|---|---|
  | Ordered sequence with index access | `ArrayList` | Efficient random access |
  | Unique elements | `HashSet` | Typically fast membership checks |
  | Unique elements in insertion order | `LinkedHashSet` | Predictable iteration order |
  | Sorted unique elements | `TreeSet` | Maintains comparator-based order |
  | General key-value lookup | `HashMap` | Efficient average-case lookup |
  | Map in insertion order | `LinkedHashMap` | Predictable iteration order |
  | Map sorted by key | `TreeMap` | Supports ordered and range operations |
  | Map updated concurrently by multiple threads | `ConcurrentHashMap` | Provides appropriate concurrent operations |

  These complexities describe typical behavior, not a guarantee that every operation always takes the same amount of time. Performance depends on collection size, hash distribution, comparators, memory, and workload.

  ## 6. Understanding equals() and hashCode()

  This is one of the most important topics when working with `HashSet` and `HashMap`.

  Java uses `equals()` to determine whether two objects should be considered equal. `hashCode()` supplies a hash value used by hash-based data structures.

  The key rule is:

  **If two objects are equal according to `equals()`, they must have the same `hashCode()`. The reverse is not required.**

  Different objects may have the same hash code while remaining unequal according to `equals()`.

  ### A common bug

  ```java
  import java.util.HashSet;
  import java.util.Set;

  class User {
      private final String email;

      User(String email) {
          this.email = email;
      }
  }

  public class EqualityBug {
      public static void main(String[] args) {
          Set<User> users = new HashSet<>();

          users.add(new User("gray@example.com"));
          users.add(new User("gray@example.com"));

          System.out.println(users.size());
      }
  }
  ```

  Output:

  ```text
  2
  ```

  Because `User` does not override `equals()` and `hashCode()`, the two instances are treated as distinct under the default `Object` behavior.

  ### The fix

  In Java 21, a `record` is useful when its data-model semantics fit the problem:

  ```java
  import java.util.HashSet;
  import java.util.Set;

  record User(String email) {}

  public class EqualityFixed {
      public static void main(String[] args) {
          Set<User> users = new HashSet<>();

          users.add(new User("gray@example.com"));
          users.add(new User("gray@example.com"));

          System.out.println(users.size());
      }
  }
  ```

  Output:

  ```text
  1
  ```

  A record automatically implements `equals()` and `hashCode()` based on its components.

  For ordinary classes, override both methods using the same definition of equality.

  An advanced caution: do not change fields that participate in `equals()` or `hashCode()` while an object is being used as a `HashMap` key or `HashSet` element. Doing so can make the collection unable to locate the element as expected.

  ## 7. Common Collection Mistakes

  ### Mistake 1: Assuming HashMap preserves insertion order

  `HashMap` does not guarantee iteration order. If ordering is a requirement, choose `LinkedHashMap` or `TreeMap` according to your needs.

  ### Mistake 2: Assuming Set solves every duplicate problem

  A `Set` enforces uniqueness according to its equality semantics within that collection. It does not guarantee uniqueness across requests or application servers.

  For transaction IDs in a real system, consider database unique constraints and an appropriate idempotency mechanism.

  ### Mistake 3: Using ArrayList for every scenario

  `ArrayList` is a good default in many cases, but it is not always optimal. Sorted data, key-based lookups, and queue processing may require different structures.

  ### Mistake 4: Assuming ordinary collections are safe for concurrent updates

  `ArrayList`, `HashSet`, and `HashMap` do not provide built-in synchronization for concurrent updates.

  For concurrent map access, consider `ConcurrentHashMap`. However, if the business operation consists of multiple steps that must be atomic as a unit, merely switching to a concurrent collection may not be sufficient.

  ### Mistake 5: Repeatedly searching a List without considering cost

  `list.contains(value)` typically takes O(n). If you perform many membership checks on a large dataset, a `HashSet` may be more suitable, provided you do not need the list's ordering and index-access behavior.

  ## 8. Mini Project: Transaction Analyzer

  Build a small program that analyzes transaction records.

  Requirements:

  - Use a `List` to preserve the input records and their order.
  - Use a `Set` to identify unique transaction IDs.
  - Use a `Map` to count transactions by status.
  - Print the total records, unique IDs, and count for each status.

  ```java
  import java.util.ArrayList;
  import java.util.HashMap;
  import java.util.HashSet;
  import java.util.List;
  import java.util.Map;
  import java.util.Set;

  record Transaction(String id, String status) {}

  public class TransactionAnalyzer {
      public static void main(String[] args) {
          List<Transaction> transactions = new ArrayList<>();

          transactions.add(new Transaction("TXN-001", "SUCCESS"));
          transactions.add(new Transaction("TXN-002", "FAILED"));
          transactions.add(new Transaction("TXN-003", "SUCCESS"));
          transactions.add(new Transaction("TXN-001", "SUCCESS"));

          Set<String> uniqueIds = new HashSet<>();
          Map<String, Integer> countByStatus = new HashMap<>();

          for (Transaction transaction : transactions) {
              uniqueIds.add(transaction.id());

              countByStatus.merge(
                  transaction.status(),
                  1,
                  Integer::sum
              );
          }

          System.out.println("Total records: " + transactions.size());
          System.out.println("Unique transaction IDs: " + uniqueIds.size());
          System.out.println("Counts by status: " + countByStatus);
      }
  }
  ```

  Possible output:

  ```text
  Total records: 4
  Unique transaction IDs: 3
  Counts by status: {SUCCESS=3, FAILED=1}
  ```

  The iteration order of `HashMap` keys is not guaranteed.

  Notice that status counts are calculated from records, while unique IDs are calculated separately. If a transaction ID appears more than once, the record count and unique-ID count will differ.

  This small example illustrates an important backend principle: choose data structures according to business meaning, not just syntax.

  ## 9. Hands-on Exercises

  ### Level 1 — Fundamentals

  1. Create a `List<Integer>` and find its maximum value.
  2. Remove duplicates from a list while preserving the first occurrence of each element.
  3. Count word frequencies in a paragraph using `HashMap`.

  ### Level 2 — Implementation Choices

  4. Compare the iteration order of `HashSet`, `LinkedHashSet`, and `TreeSet`.
  5. Create a `Product` class and define equality using its product ID.
  6. Explain why `ArrayList` usually offers more efficient index access than `LinkedList`.

  ### Level 3 — Backend Thinking

  7. Design data structures for transaction history, preserving order, checking duplicate IDs, and aggregating by status.
  8. Explain why an in-memory `HashMap` cannot replace a database in a multi-instance application.
  9. What can happen when two threads update a counter stored in a `HashMap`? Propose a solution and explain its limitations.

  ## 10. Completion Checklist

  - [ ] Explain the difference between `Collection` and `Map`.
  - [ ] Distinguish `List`, `Set`, and `Map`.
  - [ ] Choose common implementations based on requirements.
  - [ ] Understand the Big-O complexity of typical operations.
  - [ ] Explain the `equals()` and `hashCode()` contract.
  - [ ] Recognize the thread-safety limitations of ordinary collections.
  - [ ] Complete the Transaction Analyzer mini project.
  - [ ] Explain when in-memory collections are insufficient for backend requirements.

  ## Conclusion

  The Java Collections Framework is more than a group of classes for storing data. It provides tools for selecting structures based on ordering, uniqueness, lookup performance, and concurrent-access requirements.

  When building a backend service, do not start by asking, "Which collection is the fastest?" Start by asking, "What guarantees does this data need?"

  Once you understand the requirements and trade-offs, choosing a collection becomes an informed engineering decision rather than a habit.

  ### References

  - [Oracle Java Collections Framework Overview](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/doc-files/coll-overview.html)
  - [Java Collections Framework — Dev.java](https://dev.java/learn/api/collections-and-streams/collections-framework/)
  - [Java Object API — equals() and hashCode()](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html)
  - [Java Collections API — Java SE 21](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/package-summary.html)
---

