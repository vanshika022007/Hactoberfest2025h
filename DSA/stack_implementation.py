"""
Stack Implementation

Implementation of a Stack data structure with basic operations.
"""

class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        """Add item to the top of the stack"""
        self.items.append(item)
    
    def pop(self):
        """Remove and return the top item"""
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def peek(self):
        """Return the top item without removing it"""
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        """Check if the stack is empty"""
        return len(self.items) == 0
    
    def size(self):
        """Return the number of items in the stack"""
        return len(self.items)

# Test cases
if __name__ == "__main__":
    stack = Stack()
    
    print("Is empty?", stack.is_empty())  # True
    
    stack.push(1)
    stack.push(2)
    stack.push(3)
    
    print("Stack size:", stack.size())  # 3
    print("Top item:", stack.peek())  # 3
    
    print("Popped item:", stack.pop())  # 3
    print("New top item:", stack.peek())  # 2
    
    print("Stack size after pop:", stack.size())  # 2