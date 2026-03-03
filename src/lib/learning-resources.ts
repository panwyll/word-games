/**
 * Learning Resources - Concepts, Algorithms, and Data Structures
 */

export interface Concept {
  id: string;
  name: string;
  category: 'data-structure' | 'algorithm' | 'technique' | 'pattern';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  keyPoints: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  useCases: string[];
  codeExample: string;
  relatedPuzzles: string[];
  furtherReading: { title: string; url: string }[];
}

export const LEARNING_CONCEPTS: Concept[] = [
  {
    id: 'hash-maps',
    name: 'Hash Maps / Dictionaries',
    category: 'data-structure',
    difficulty: 'Beginner',
    description: `A hash map (also called dictionary in Python, or hash table) is a data structure that stores key-value pairs and provides O(1) average-case lookup, insertion, and deletion.

Hash maps are one of the most important data structures in programming, enabling efficient solutions to many problems.`,
    keyPoints: [
      'Stores key-value pairs with fast lookup',
      'Average O(1) time for get, set, delete operations',
      'Uses hashing function to map keys to array indices',
      'In Python, implemented as dict or collections.defaultdict'
    ],
    timeComplexity: 'O(1) average for lookup, insert, delete',
    spaceComplexity: 'O(n) where n is number of elements',
    useCases: [
      'Counting frequency of elements',
      'Finding pairs or complements',
      'Caching/memoization',
      'Grouping elements by a key'
    ],
    codeExample: `# Basic hash map usage in Python
freq = {}  # Empty hash map

# Insertion
freq['apple'] = 5

# Lookup
count = freq.get('apple', 0)  # Returns 0 if key not found

# Iteration
for key, value in freq.items():
    print(f"{key}: {value}")

# Common pattern: counting
nums = [1, 2, 2, 3, 3, 3]
counts = {}
for num in nums:
    counts[num] = counts.get(num, 0) + 1

# Using defaultdict (no need for get)
from collections import defaultdict
counts = defaultdict(int)
for num in nums:
    counts[num] += 1`,
    relatedPuzzles: ['two-sum', 'valid-parentheses'],
    furtherReading: [
      { title: 'Python dict documentation', url: 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries' },
      { title: 'Hash Table - Wikipedia', url: 'https://en.wikipedia.org/wiki/Hash_table' }
    ]
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers Technique',
    category: 'technique',
    difficulty: 'Beginner',
    description: `The two pointers technique uses two references (pointers) to traverse data structures, often arrays or linked lists. It's particularly useful for problems involving sorted arrays, palindromes, or finding pairs.

This technique can reduce time complexity from O(n²) to O(n) in many cases.`,
    keyPoints: [
      'Uses two pointers moving toward/away from each other',
      'Common patterns: convergent (toward center), divergent (from center), same direction',
      'Often used on sorted arrays',
      'Reduces nested loops to single pass'
    ],
    timeComplexity: 'O(n) - single pass through data',
    spaceComplexity: 'O(1) - only two pointer variables',
    useCases: [
      'Finding pairs in sorted array',
      'Palindrome checking',
      'In-place array manipulation',
      'Merging sorted arrays'
    ],
    codeExample: `# Example 1: Palindrome check (convergent pointers)
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

# Example 2: Two sum in sorted array (convergent)
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1  # Need larger sum
        else:
            right -= 1  # Need smaller sum
    return []

# Example 3: Remove duplicates (same direction)
def remove_duplicates(nums):
    if not nums:
        return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1`,
    relatedPuzzles: ['reverse-string', 'valid-palindrome', 'merge-sorted-arrays'],
    furtherReading: [
      { title: 'Two Pointers Pattern', url: 'https://leetcode.com/tag/two-pointers/' }
    ]
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    category: 'algorithm',
    difficulty: 'Intermediate',
    description: `Dynamic Programming (DP) is an optimization technique that breaks down problems into overlapping subproblems, solves each once, and stores results to avoid redundant computation.

The key is recognizing that a problem can be broken into smaller instances of the same problem.`,
    keyPoints: [
      'Break problem into overlapping subproblems',
      'Store solutions to avoid recomputation (memoization)',
      'Build solution bottom-up or top-down',
      'Identify recurrence relation'
    ],
    timeComplexity: 'Varies - often O(n) or O(n²) depending on problem',
    spaceComplexity: 'Varies - can often be optimized',
    useCases: [
      'Optimization problems (min/max)',
      'Counting problems (how many ways)',
      'Fibonacci-like sequences',
      'Knapsack problems, longest subsequence'
    ],
    codeExample: `# Example 1: Fibonacci (classic DP)
# Naive recursion - O(2^n) - exponential!
def fib_naive(n):
    if n <= 1:
        return n
    return fib_naive(n-1) + fib_naive(n-2)

# Top-down with memoization - O(n)
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]

# Bottom-up (iterative) - O(n) time, O(1) space
def fib_dp(n):
    if n <= 1:
        return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    return prev1

# Example 2: Climbing stairs
def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
    relatedPuzzles: ['climbing-stairs', 'maximum-subarray'],
    furtherReading: [
      { title: 'Dynamic Programming Patterns', url: 'https://leetcode.com/tag/dynamic-programming/' }
    ]
  },
  {
    id: 'binary-search',
    name: 'Binary Search Algorithm',
    category: 'algorithm',
    difficulty: 'Beginner',
    description: `Binary search is a divide-and-conquer algorithm for efficiently finding an element in a sorted array. It repeatedly divides the search interval in half.

This is one of the most fundamental algorithms in computer science, achieving O(log n) time complexity.`,
    keyPoints: [
      'Only works on sorted arrays',
      'Divides search space in half each iteration',
      'Uses left, right, and mid pointers',
      'O(log n) time complexity'
    ],
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1) iterative, O(log n) recursive',
    useCases: [
      'Searching in sorted arrays',
      'Finding insertion position',
      'Search in rotated sorted arrays',
      'Finding boundaries (first/last occurrence)'
    ],
    codeExample: `# Iterative binary search
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Recursive binary search
def binary_search_recursive(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1
    
    mid = (left + right) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)

# Finding insertion position
def search_insert(arr, target):
    left, right = 0, len(arr)
    while left < right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left`,
    relatedPuzzles: ['binary-search'],
    furtherReading: [
      { title: 'Binary Search - Wikipedia', url: 'https://en.wikipedia.org/wiki/Binary_search_algorithm' }
    ]
  },
  {
    id: 'stack',
    name: 'Stack Data Structure',
    category: 'data-structure',
    difficulty: 'Beginner',
    description: `A stack is a Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end (the "top"). Think of it like a stack of plates - you can only add or remove from the top.

Stacks are fundamental for solving problems involving nested structures, parsing, and backtracking.`,
    keyPoints: [
      'Last-In-First-Out (LIFO) ordering',
      'Main operations: push (add), pop (remove), peek (view top)',
      'In Python, use list with append() and pop()',
      'O(1) time for all operations'
    ],
    timeComplexity: 'O(1) for push, pop, peek',
    spaceComplexity: 'O(n) where n is number of elements',
    useCases: [
      'Matching parentheses/brackets',
      'Expression evaluation',
      'Undo/redo functionality',
      'Depth-first search (DFS)',
      'Function call stack'
    ],
    codeExample: `# Stack implementation using Python list
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        raise IndexError("pop from empty stack")
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# Using Python list as stack directly
stack = []
stack.append(1)  # push
stack.append(2)  # push
top = stack[-1]   # peek
item = stack.pop()  # pop

# Example: Valid Parentheses
def is_valid(s):
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for char in s:
        if char in pairs:
            stack.append(char)
        elif not stack or pairs[stack.pop()] != char:
            return False
    
    return not stack`,
    relatedPuzzles: ['valid-parentheses'],
    furtherReading: [
      { title: 'Stack - Wikipedia', url: 'https://en.wikipedia.org/wiki/Stack_(abstract_data_type)' }
    ]
  }
];

/** Get concept by ID */
export function getConceptById(id: string): Concept | undefined {
  return LEARNING_CONCEPTS.find(c => c.id === id);
}

/** Get concepts by category */
export function getConceptsByCategory(category: string): Concept[] {
  return LEARNING_CONCEPTS.filter(c => c.category === category);
}

/** Get concepts by difficulty */
export function getConceptsByDifficulty(difficulty: string): Concept[] {
  return LEARNING_CONCEPTS.filter(c => c.difficulty === difficulty);
}

/** Get all categories */
export function getAllConceptCategories(): string[] {
  return Array.from(new Set(LEARNING_CONCEPTS.map(c => c.category)));
}
