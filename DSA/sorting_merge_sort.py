"""
Merge Sort Algorithm

Implementation of the Merge Sort algorithm, which uses a divide and conquer approach.
Time complexity: O(n log n)
"""

def merge_sort(arr):
    """
    Sort an array using the Merge Sort algorithm.
    
    Args:
        arr: List of elements to sort
        
    Returns:
        Sorted list
    """
    if len(arr) <= 1:
        return arr
    
    # Divide array into two halves
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]
    
    # Recursively sort both halves
    left = merge_sort(left)
    right = merge_sort(right)
    
    # Merge the sorted halves
    return merge(left, right)

def merge(left, right):
    """
    Merge two sorted arrays into one sorted array.
    
    Args:
        left: First sorted array
        right: Second sorted array
        
    Returns:
        Merged sorted array
    """
    result = []
    i = j = 0
    
    # Compare elements from both arrays and add smaller one to result
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    
    return result

# Test cases
if __name__ == "__main__":
    # Test case 1: Random array
    arr1 = [38, 27, 43, 3, 9, 82, 10]
    print(f"Original array: {arr1}")
    print(f"Sorted array: {merge_sort(arr1)}")
    
    # Test case 2: Already sorted array
    arr2 = [1, 2, 3, 4, 5]
    print(f"Original array: {arr2}")
    print(f"Sorted array: {merge_sort(arr2)}")
    
    # Test case 3: Reverse sorted array
    arr3 = [5, 4, 3, 2, 1]
    print(f"Original array: {arr3}")
    print(f"Sorted array: {merge_sort(arr3)}")