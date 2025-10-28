"""
Min Heap Implementation

This file implements a min heap data structure with the following operations:
- insert: Add an element to the heap
- extract_min: Remove and return the minimum element
- peek: Return the minimum element without removing it
- heapify: Convert an array into a valid heap
"""

class MinHeap:
    def __init__(self):
        """Initialize an empty min heap."""
        self.heap = []
        self.size = 0
    
    def parent(self, i):
        """Return the parent index of node i."""
        return (i - 1) // 2
    
    def left_child(self, i):
        """Return the left child index of node i."""
        return 2 * i + 1
    
    def right_child(self, i):
        """Return the right child index of node i."""
        return 2 * i + 2
    
    def swap(self, i, j):
        """Swap elements at indices i and j."""
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]
    
    def insert(self, key):
        """
        Insert a new key into the min heap.
        
        Args:
            key: The key to insert
        """
        self.heap.append(key)
        self.size += 1
        self._sift_up(self.size - 1)
    
    def _sift_up(self, i):
        """
        Move the element at index i up to its correct position.
        
        Args:
            i: Index of the element to sift up
        """
        parent_idx = self.parent(i)
        if i > 0 and self.heap[i] < self.heap[parent_idx]:
            self.swap(i, parent_idx)
            self._sift_up(parent_idx)
    
    def extract_min(self):
        """
        Extract and return the minimum element from the heap.
        
        Returns:
            The minimum element, or None if heap is empty
        """
        if self.size <= 0:
            return None
        
        min_val = self.heap[0]
        
        # Replace root with last element and then heapify
        self.heap[0] = self.heap[self.size - 1]
        self.size -= 1
        self.heap.pop()
        self._sift_down(0)
        
        return min_val
    
    def _sift_down(self, i):
        """
        Move the element at index i down to its correct position.
        
        Args:
            i: Index of the element to sift down
        """
        smallest = i
        left = self.left_child(i)
        right = self.right_child(i)
        
        # Check if left child exists and is smaller than root
        if left < self.size and self.heap[left] < self.heap[smallest]:
            smallest = left
        
        # Check if right child exists and is smaller than current smallest
        if right < self.size and self.heap[right] < self.heap[smallest]:
            smallest = right
        
        # If smallest is not the root
        if smallest != i:
            self.swap(i, smallest)
            self._sift_down(smallest)
    
    def peek(self):
        """
        Return the minimum element without removing it.
        
        Returns:
            The minimum element, or None if heap is empty
        """
        if self.size <= 0:
            return None
        return self.heap[0]
    
    def heapify(self, arr):
        """
        Convert an array into a min heap.
        
        Args:
            arr: The array to heapify
        """
        self.heap = arr.copy()
        self.size = len(arr)
        
        # Start from the last non-leaf node and heapify each node
        for i in range(self.size // 2 - 1, -1, -1):
            self._sift_down(i)

# Test cases
if __name__ == "__main__":
    # Create a min heap
    min_heap = MinHeap()
    
    # Insert elements
    elements = [4, 8, 2, 9, 5, 1, 6]
    print("Inserting elements:", elements)
    for element in elements:
        min_heap.insert(element)
    
    print("Heap after insertions:", min_heap.heap)
    
    # Extract minimum elements
    print("\nExtracting minimum elements:")
    for _ in range(len(elements)):
        print(min_heap.extract_min(), end=" ")
    print()
    
    # Test heapify
    print("\nTesting heapify:")
    arr = [7, 10, 3, 15, 2, 12, 8]
    print("Original array:", arr)
    
    min_heap = MinHeap()
    min_heap.heapify(arr)
    print("After heapify:", min_heap.heap)
    
    # Extract minimum elements after heapify
    print("\nExtracting minimum elements after heapify:")
    while min_heap.size > 0:
        print(min_heap.extract_min(), end=" ")
    print()