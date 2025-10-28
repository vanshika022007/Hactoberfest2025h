"""
Queue Implementation

Implementation of a Queue data structure with basic operations.
"""

class Queue:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        """Add item to the end of the queue"""
        self.items.append(item)
    
    def dequeue(self):
        """Remove and return the front item"""
        if not self.is_empty():
            return self.items.pop(0)
        return None
    
    def front(self):
        """Return the front item without removing it"""
        if not self.is_empty():
            return self.items[0]
        return None
    
    def is_empty(self):
        """Check if the queue is empty"""
        return len(self.items) == 0
    
    def size(self):
        """Return the number of items in the queue"""
        return len(self.items)

# Test cases
if __name__ == "__main__":
    queue = Queue()
    
    print("Is empty?", queue.is_empty())  # True
    
    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)
    
    print("Queue size:", queue.size())  # 3
    print("Front item:", queue.front())  # 1
    
    print("Dequeued item:", queue.dequeue())  # 1
    print("New front item:", queue.front())  # 2
    
    print("Queue size after dequeue:", queue.size())  # 2