---
title: 'Java Collections Framework: List, Set, Map and How to Choose'
description: >-
  Understand Java Collections Framework from the ground up — List, Set, Map,
  common implementations, time complexity, equals and hashCode, and practical
  patterns for backend development.
category: backend
tags:
  - Java
  - Java Core
  - Collections Framework
  - Data Structures
  - Backend Engineering
status: published
publishedAt: '2026-10-26'
---
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
