---
title: "Two Pointers: understanding LeetCode Two Sum II"
description: "From brute force to O(n): derive pointer movements, prove correctness, trace an example and implement Two Sum II in Java."
category: backend
tags: [LeetCode, Two Pointers, Array, Java, Algorithms]
status: published
publishedAt: '2026-11-02'
---

Finding two numbers with a given sum can start with two nested loops. A sorted array gives us something more useful: each comparison tells us which pairs cannot possibly work. That observation is the foundation of this two-pointer solution.

This is an educational walkthrough, not a record of an accepted submission on my LeetCode account.

## 1. What are two pointers?

Two pointers are two positions used to traverse or narrow a search space. In a Java array, they are usually ordinary integer indices.

| Arrangement | Movement | Typical use |
| --- | --- | --- |
| Opposite ends | Move inward | Pair search in sorted arrays, palindrome checks |
| Same direction | Read and write positions, or different speeds | Removing duplicates |
| Window boundaries | Expand and shrink a contiguous interval | Some sliding-window problems |

Using two indices is not the main insight. The important question is: **why can a pointer move without skipping the answer?** Here we focus on pointers moving inward from opposite ends.

## 2. The problem

See [LeetCode 167 — Two Sum II: Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/) for the original problem.

Given a non-decreasing integer array and a target, return the **1-based** positions of two distinct elements whose sum matches the target. The problem guarantees exactly one solution and requires constant auxiliary space. There can be up to 30,000 elements; element values and the target range from −1,000 to 1,000.

Our worked example:

```text
numbers = [1, 3, 4, 6, 12]
target = 10
answer = [3, 4], since numbers[2] + numbers[3] = 4 + 6.
```

The array is already sorted. We do not need to sort it or change the positions we must return.

## 3. Start with brute force

Try every pair of distinct indices:

```java
for (int i = 0; i < numbers.length - 1; i++) {
    for (int j = i + 1; j < numbers.length; j++) {
        if (numbers[i] + numbers[j] == target) {
            return new int[] {i + 1, j + 1};
        }
    }
}
```

There are `n(n - 1) / 2` possible pairs: 449,985,000 when `n = 30,000`. This takes `O(n²)` time and `O(1)` auxiliary space.

A hash map can find complements in linear expected time, but needs `O(n)` extra space. Sorted order lets us avoid that storage.

## 4. Derive the pointer movements

Initialize `left = 0` and `right = numbers.length - 1`, then compare their sum with the target.

### If the sum is too small

For every position `k` between `left + 1` and `right`:

```text
numbers[k] <= numbers[right]
numbers[left] + numbers[k] <= sum < target
```

Even the largest remaining partner is too small for `numbers[left]`. No remaining answer can use that left position, so `left++` safely discards it. Duplicate values may leave the sum unchanged, but the search interval still shrinks.

### If the sum is too large

For every position `k` between `left` and `right - 1`:

```text
numbers[k] >= numbers[left]
numbers[k] + numbers[right] >= sum > target
```

Even the smallest remaining partner makes the sum too large. No remaining answer can use that right position, so `right--` is safe.

### If the sum matches

Return `[left + 1, right + 1]`. The loop condition `left < right` ensures two distinct positions.

These arguments depend on ordering, not positivity. They work with negative values and duplicates as well.

## 5. Trace the example

For `[1, 3, 4, 6, 12]` and target `10`:

| Step | left | right | Values | Sum | Action |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 4 | 1 and 12 | 13 | Decrease right to 3 |
| 2 | 0 | 3 | 1 and 6 | 7 | Increase left to 1 |
| 3 | 1 | 3 | 3 and 6 | 9 | Increase left to 2 |
| 4 | 2 | 3 | 4 and 6 | 10 | Return [3, 4] |

Each movement eliminates an impossible position instead of explicitly trying every pair involving it.

## 6. Java solution

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

The exception handles inputs without a solution, outside the problem's guarantee, rather than returning a fabricated pair.

An `int` safely holds the sum under these constraints. For a version accepting larger integer values, use `long sum = (long) numbers[left] + numbers[right];`. Cast before adding so the addition itself cannot overflow an `int`.

## 7. Correctness and complexity

**Invariant:** until found, both answer indices remain inside `[left, right]`.

Initially the interval contains the whole array. The inequalities above prove that a too-small sum rules out the left position entirely, while a too-large sum rules out the right position. Each movement therefore preserves the invariant. Equality returns two distinct elements with the required sum.

Every unsuccessful iteration decreases `right - left` by one. The algorithm terminates, and the guaranteed solution must be found before the interval contains fewer than two positions.

- **Time: `O(n)`.** At most `n - 1` pairs are examined; neither pointer moves backward.
- **Auxiliary space: `O(1)`.** Two indices and a sum suffice. The output always contains exactly two elements.

## 8. Cases to test

| Purpose | numbers | target | Expected result |
| --- | --- | --- | --- |
| Move both pointers | [1, 3, 4, 6, 12] | 10 | [3, 4] |
| Two-element input | [1, 8] | 9 | [1, 2] |
| Negative values | [-8, -3, 0, 2, 9] | -6 | [1, 4] |
| Equal values at distinct positions | [3, 3] | 6 | [1, 2] |
| Answer at opposite ends | [1, 4, 6, 12] | 13 | [1, 4] |

Check the sum, index order, 1-based indexing and use of distinct positions.

## 9. Common mistakes

- Using `left <= right` and potentially selecting an element twice.
- Returning zero-based indices.
- Decreasing `right` when the sum is too small.
- Moving both pointers unconditionally and skipping candidates.
- Applying these elimination rules to an unsorted array.
- Sorting the ordinary Two Sum input in place and returning indices that no longer refer to the original positions.

## 10. What to revisit

When a problem asks for a pair in ordered data, try opposite-end pointers. Before coding, explain which candidates a too-small or too-large sum eliminates.

For further practice, explore palindrome checks, duplicate removal with same-direction pointers, and finding three values by fixing one value before searching for a pair.

Add alternative solutions, counterexamples and corrections to this same article as you learn, updating its Markdown `updatedAt` field. The useful long-term outcome is being able to reconstruct the reasoning without memorizing the code.
