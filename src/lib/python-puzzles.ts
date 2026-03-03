/**
 * Python Coding Puzzle Data
 * LeetCode-style problems with test cases, solutions, and hints
 */

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface Puzzle {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: TestCase[];
  testCases: TestCase[];
  hints: string[];
  solution: string;
  explanation: string;
  learningPoints: string[];
  relatedConcepts: string[];
}

/** Collection of Python coding puzzles */
export const PYTHON_PUZZLES: Puzzle[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers that add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]'
      }
    ],
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
      { input: '[3,3], 6', expectedOutput: '[0,1]' },
      { input: '[-1,-2,-3,-4,-5], -8', expectedOutput: '[2,4]' },
    ],
    hints: [
      'Think about what you need to find for each number',
      'Can you use a hash map to store numbers you\'ve seen?',
      'For each number, check if (target - number) exists in your hash map'
    ],
    solution: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    explanation: `The key insight is to use a hash map to store numbers we've already seen along with their indices.

**Algorithm:**
1. Create an empty hash map to store {number: index}
2. For each number in the array:
   - Calculate the complement (target - current number)
   - If complement exists in hash map, we found our pair!
   - Otherwise, add current number to hash map
3. Return the indices

**Time Complexity:** O(n) - single pass through array
**Space Complexity:** O(n) - hash map storage`,
    learningPoints: [
      'Hash maps enable O(1) lookup time',
      'Trading space for time complexity',
      'The two-pass vs one-pass approach'
    ],
    relatedConcepts: ['Hash Maps', 'Arrays', 'Time Complexity']
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    category: 'Strings',
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]'
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]'
      }
    ],
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' },
      { input: '["a"]', expectedOutput: '["a"]' },
      { input: '["a","b"]', expectedOutput: '["b","a"]' },
    ],
    hints: [
      'Use two pointers - one at the start, one at the end',
      'Swap elements and move pointers toward center',
      'Stop when pointers meet in the middle'
    ],
    solution: `def reverse_string(s):
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1`,
    explanation: `This is a classic two-pointer problem where we swap elements from both ends.

**Algorithm:**
1. Initialize two pointers: left at start (0), right at end (len-1)
2. While left < right:
   - Swap s[left] and s[right]
   - Move left pointer forward (left += 1)
   - Move right pointer backward (right -= 1)
3. When pointers meet, array is reversed

**Time Complexity:** O(n) - visit each element once
**Space Complexity:** O(1) - only two pointer variables`,
    learningPoints: [
      'Two-pointer technique for in-place operations',
      'In-place array manipulation',
      'Understanding space complexity constraints'
    ],
    relatedConcepts: ['Two Pointers', 'Arrays', 'In-Place Algorithms']
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    category: 'Strings',
    description: `A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        explanation: 'After removing non-alphanumeric: "amanaplanacanalpanama" is a palindrome'
      },
      {
        input: 's = "race a car"',
        expectedOutput: 'false',
        explanation: 'After processing: "raceacar" is not a palindrome'
      }
    ],
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
      { input: '"race a car"', expectedOutput: 'false' },
      { input: '" "', expectedOutput: 'true' },
      { input: '"a"', expectedOutput: 'true' },
    ],
    hints: [
      'First, clean the string by removing non-alphanumeric characters',
      'Convert to lowercase for case-insensitive comparison',
      'Use two pointers to compare from both ends'
    ],
    solution: `def is_palindrome(s):
    # Clean and normalize string
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    
    # Two-pointer comparison
    left, right = 0, len(cleaned) - 1
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    return True`,
    explanation: `This problem combines string processing with the two-pointer technique.

**Algorithm:**
1. **Preprocessing:** Filter out non-alphanumeric characters and convert to lowercase
2. **Two-pointer comparison:** Check if cleaned string reads the same forwards and backwards
3. Return true only if all character pairs match

**Time Complexity:** O(n) - single pass to clean, single pass to check
**Space Complexity:** O(n) - storing cleaned string`,
    learningPoints: [
      'String preprocessing and filtering',
      'Two-pointer technique for palindrome checking',
      'Using Python list comprehension with join()'
    ],
    relatedConcepts: ['Strings', 'Two Pointers', 'String Manipulation']
  },
  {
    id: 'best-time-to-buy-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Arrays',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve. If you cannot achieve any profit, return 0.`,
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        expectedOutput: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5'
      },
      {
        input: 'prices = [7,6,4,3,1]',
        expectedOutput: '0',
        explanation: 'No profit possible as prices only decrease'
      }
    ],
    testCases: [
      { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
      { input: '[7,6,4,3,1]', expectedOutput: '0' },
      { input: '[2,4,1]', expectedOutput: '2' },
      { input: '[1,2]', expectedOutput: '1' },
    ],
    hints: [
      'Track the minimum price seen so far',
      'For each price, calculate profit if sold today',
      'Keep track of maximum profit seen'
    ],
    solution: `def max_profit(prices):
    if not prices:
        return 0
    
    min_price = prices[0]
    max_profit = 0
    
    for price in prices:
        min_price = min(min_price, price)
        profit = price - min_price
        max_profit = max(max_profit, profit)
    
    return max_profit`,
    explanation: `This is a single-pass greedy algorithm that tracks minimum price and maximum profit.

**Algorithm:**
1. Initialize min_price to first price and max_profit to 0
2. For each price in array:
   - Update min_price if current price is lower
   - Calculate profit if we sold at current price
   - Update max_profit if this profit is higher
3. Return max_profit

**Key Insight:** We want to buy at the lowest point before a peak. By tracking the minimum price seen so far, we can calculate the best profit for selling at each price.

**Time Complexity:** O(n) - single pass
**Space Complexity:** O(1) - only storing two variables`,
    learningPoints: [
      'Greedy algorithms for optimization problems',
      'Tracking running minimum/maximum',
      'One-pass solution vs brute force'
    ],
    relatedConcepts: ['Arrays', 'Greedy Algorithms', 'Dynamic Programming']
  },
  {
    id: 'fizz-buzz',
    title: 'Fizz Buzz',
    difficulty: 'Easy',
    category: 'Math',
    description: `Given an integer \`n\`, return a string array \`answer\` where:

- \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
- \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
- \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
- \`answer[i] == i\` (as a string) if none of the above conditions are true.`,
    examples: [
      {
        input: 'n = 15',
        expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]'
      },
      {
        input: 'n = 5',
        expectedOutput: '["1","2","Fizz","4","Buzz"]'
      }
    ],
    testCases: [
      { input: '15', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
      { input: '5', expectedOutput: '["1","2","Fizz","4","Buzz"]' },
      { input: '3', expectedOutput: '["1","2","Fizz"]' },
      { input: '1', expectedOutput: '["1"]' },
    ],
    hints: [
      'Check divisibility by both 3 and 5 first',
      'Use modulo operator (%) to check divisibility',
      'Order matters: check FizzBuzz before Fizz or Buzz'
    ],
    solution: `def fizz_buzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result`,
    explanation: `Classic programming interview problem testing basic control flow and modulo operations.

**Algorithm:**
1. Create empty result array
2. Iterate from 1 to n (inclusive)
3. For each number:
   - If divisible by both 3 and 5 (i.e., divisible by 15): "FizzBuzz"
   - Else if divisible by 3: "Fizz"
   - Else if divisible by 5: "Buzz"
   - Else: the number as a string
4. Return result array

**Key Points:**
- Must check divisibility by 15 BEFORE checking 3 or 5 individually
- Converting integers to strings is necessary for the output format

**Time Complexity:** O(n)
**Space Complexity:** O(n) - for result array`,
    learningPoints: [
      'Modulo operator for divisibility checking',
      'If-elif-else conditional logic',
      'Order of condition checking matters'
    ],
    relatedConcepts: ['Math', 'Control Flow', 'Basic Programming']
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        expectedOutput: 'true'
      },
      {
        input: 's = "()[]{}"',
        expectedOutput: 'true'
      },
      {
        input: 's = "(]"',
        expectedOutput: 'false'
      }
    ],
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
      { input: '"([)]"', expectedOutput: 'false' },
      { input: '"{[]}"', expectedOutput: 'true' },
    ],
    hints: [
      'Use a stack data structure',
      'Push opening brackets onto the stack',
      'When you see a closing bracket, check if it matches the top of stack'
    ],
    solution: `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    
    return not stack`,
    explanation: `This is a classic stack problem demonstrating Last-In-First-Out (LIFO) behavior.

**Algorithm:**
1. Create empty stack and mapping of closing to opening brackets
2. For each character:
   - If it's a closing bracket: pop from stack and verify it matches
   - If it's an opening bracket: push to stack
3. At the end, stack should be empty (all brackets closed)

**Key Insights:**
- Stack naturally handles nested brackets (LIFO)
- Using a mapping dictionary makes the code cleaner
- Edge case: popping from empty stack (use '#' as sentinel)

**Time Complexity:** O(n) - single pass
**Space Complexity:** O(n) - worst case all opening brackets`,
    learningPoints: [
      'Stack data structure and LIFO principle',
      'Using dictionaries for cleaner conditionals',
      'Handling edge cases (empty stack)'
    ],
    relatedConcepts: ['Stack', 'Strings', 'Data Structures']
  },
  {
    id: 'merge-sorted-arrays',
    title: 'Merge Two Sorted Arrays',
    difficulty: 'Easy',
    category: 'Arrays',
    description: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in non-decreasing order.

Merge \`nums2\` into \`nums1\` as one sorted array. The final sorted array should be returned.`,
    examples: [
      {
        input: 'nums1 = [1,2,3], nums2 = [2,5,6]',
        expectedOutput: '[1,2,2,3,5,6]'
      },
      {
        input: 'nums1 = [1], nums2 = []',
        expectedOutput: '[1]'
      }
    ],
    testCases: [
      { input: '[1,2,3], [2,5,6]', expectedOutput: '[1,2,2,3,5,6]' },
      { input: '[1], []', expectedOutput: '[1]' },
      { input: '[], [1]', expectedOutput: '[1]' },
      { input: '[1,3,5], [2,4,6]', expectedOutput: '[1,2,3,4,5,6]' },
    ],
    hints: [
      'Use two pointers - one for each array',
      'Compare elements and add smaller one to result',
      'Don\'t forget remaining elements after one array is exhausted'
    ],
    solution: `def merge(nums1, nums2):
    result = []
    i, j = 0, 0
    
    while i < len(nums1) and j < len(nums2):
        if nums1[i] <= nums2[j]:
            result.append(nums1[i])
            i += 1
        else:
            result.append(nums2[j])
            j += 1
    
    # Add remaining elements
    result.extend(nums1[i:])
    result.extend(nums2[j:])
    
    return result`,
    explanation: `Merge algorithm using two pointers, fundamental to merge sort.

**Algorithm:**
1. Initialize two pointers (i, j) at start of each array
2. While both arrays have elements:
   - Compare nums1[i] and nums2[j]
   - Add smaller element to result and advance that pointer
3. Add any remaining elements from either array

**Key Insight:** Since both arrays are already sorted, we only need to compare the current elements from each array.

**Time Complexity:** O(m + n) - visit each element once
**Space Complexity:** O(m + n) - for result array`,
    learningPoints: [
      'Merge operation in merge sort',
      'Two-pointer technique on multiple arrays',
      'Handling remaining elements efficiently'
    ],
    relatedConcepts: ['Arrays', 'Two Pointers', 'Merge Sort', 'Sorting']
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray Sum',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        expectedOutput: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum = 6'
      },
      {
        input: 'nums = [1]',
        expectedOutput: '1'
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        expectedOutput: '23'
      }
    ],
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23' },
      { input: '[-1,-2,-3]', expectedOutput: '-1' },
    ],
    hints: [
      'Can you track the maximum sum ending at each position?',
      'At each element, decide: extend current subarray or start new one?',
      'This is Kadane\'s Algorithm'
    ],
    solution: `def max_subarray(nums):
    max_sum = current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
    explanation: `This is Kadane's Algorithm - a classic dynamic programming solution.

**Algorithm (Kadane's):**
1. Initialize max_sum and current_sum to first element
2. For each subsequent element:
   - Decide: extend current subarray OR start fresh from this element
   - current_sum = max(num, current_sum + num)
   - Update max_sum if current_sum is larger
3. Return max_sum

**Key Insight:** At each position, we only need to know: is it better to extend the previous subarray, or start a new one from here? If the previous sum is negative, we're better off starting fresh.

**Time Complexity:** O(n) - single pass
**Space Complexity:** O(1) - only two variables

**Alternative:** Divide & Conquer in O(n log n), but Kadane's is optimal.`,
    learningPoints: [
      'Dynamic programming for optimization',
      'Kadane\'s Algorithm',
      'Greedy choice at each step'
    ],
    relatedConcepts: ['Dynamic Programming', 'Arrays', 'Greedy Algorithms']
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        input: 'n = 2',
        expectedOutput: '2',
        explanation: 'Two ways: 1. (1 step + 1 step) 2. (2 steps)'
      },
      {
        input: 'n = 3',
        expectedOutput: '3',
        explanation: 'Three ways: 1. (1+1+1) 2. (1+2) 3. (2+1)'
      }
    ],
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '4', expectedOutput: '5' },
      { input: '5', expectedOutput: '8' },
    ],
    hints: [
      'Think about how to reach step n - what are the previous steps?',
      'To reach step n, you can come from step (n-1) or step (n-2)',
      'This follows the Fibonacci sequence pattern'
    ],
    solution: `def climb_stairs(n):
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1`,
    explanation: `This is a Fibonacci sequence problem disguised as a staircase problem.

**Recurrence Relation:** 
\`\`\`
ways(n) = ways(n-1) + ways(n-2)
\`\`\`

Why? To reach step n, you can either:
- Take 1 step from step (n-1), OR
- Take 2 steps from step (n-2)

**Algorithm:**
1. Base cases: ways(1)=1, ways(2)=2
2. For each step from 3 to n:
   - ways(i) = ways(i-1) + ways(i-2)
3. Use two variables instead of array to optimize space

**Time Complexity:** O(n)
**Space Complexity:** O(1) - optimized from O(n) by using two variables

**Pattern Recognition:** This is the Fibonacci sequence: 1, 2, 3, 5, 8, 13...`,
    learningPoints: [
      'Recognizing Fibonacci patterns in problems',
      'Dynamic programming with memoization',
      'Space optimization techniques'
    ],
    relatedConcepts: ['Dynamic Programming', 'Math', 'Fibonacci', 'Recursion']
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Binary Search',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`.

If \`target\` exists, return its index. Otherwise, return \`-1\`.

You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        expectedOutput: '4',
        explanation: '9 exists in nums and its index is 4'
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        expectedOutput: '-1',
        explanation: '2 does not exist in nums so return -1'
      }
    ],
    testCases: [
      { input: '[-1,0,3,5,9,12], 9', expectedOutput: '4' },
      { input: '[-1,0,3,5,9,12], 2', expectedOutput: '-1' },
      { input: '[5], 5', expectedOutput: '0' },
      { input: '[1,2,3,4,5], 1', expectedOutput: '0' },
    ],
    hints: [
      'Divide the search space in half each iteration',
      'Use left and right pointers',
      'Calculate middle index and compare with target'
    ],
    solution: `def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
    explanation: `Binary search is the fundamental divide-and-conquer algorithm for sorted arrays.

**Algorithm:**
1. Initialize pointers: left=0, right=len-1
2. While left <= right:
   - Calculate middle index: mid = (left + right) // 2
   - If nums[mid] == target: found it, return mid
   - If nums[mid] < target: search right half (left = mid + 1)
   - If nums[mid] > target: search left half (right = mid - 1)
3. If not found, return -1

**Key Insight:** By comparing with the middle element, we eliminate half the search space each iteration.

**Time Complexity:** O(log n) - halving search space each time
**Space Complexity:** O(1) - only pointer variables`,
    learningPoints: [
      'Binary search algorithm',
      'Divide and conquer strategy',
      'Logarithmic time complexity'
    ],
    relatedConcepts: ['Binary Search', 'Arrays', 'Divide and Conquer']
  }
];

/** Get puzzle by ID */
export function getPuzzleById(id: string): Puzzle | undefined {
  return PYTHON_PUZZLES.find(p => p.id === id);
}

/** Get puzzle by index (for daily rotation) */
export function getPuzzleByIndex(index: number): Puzzle {
  const idx = ((index % PYTHON_PUZZLES.length) + PYTHON_PUZZLES.length) % PYTHON_PUZZLES.length;
  return PYTHON_PUZZLES[idx];
}

/** Get puzzles by difficulty */
export function getPuzzlesByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Puzzle[] {
  return PYTHON_PUZZLES.filter(p => p.difficulty === difficulty);
}

/** Get puzzles by category */
export function getPuzzlesByCategory(category: string): Puzzle[] {
  return PYTHON_PUZZLES.filter(p => p.category === category);
}

/** Get all unique categories */
export function getAllCategories(): string[] {
  return Array.from(new Set(PYTHON_PUZZLES.map(p => p.category)));
}
