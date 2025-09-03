export interface GenerationHistory {
    id: string;
    prompt: string;
    style: string;
    imageUrl: string;
    createdAt: string;
    status: 'success' | 'error';
    message?: string;
}

class ResponseQueue {
    private items: GenerationHistory[] = [];
    private maxSize: number;
    private storageKey: string;

    constructor(maxSize: number = 5, storageKey: string = 'ai-studio-history') {
        this.maxSize = maxSize;
        this.storageKey = storageKey;
        // Only load from storage on client side
        if (typeof window !== 'undefined') {
            this.loadFromStorage();
        }
    }

    enqueue(item: GenerationHistory): void {
        this.items.push(item);

        if (this.items.length > this.maxSize) {
            this.items.shift();
        }
        this.saveToStorage();
    }

    getAll(): GenerationHistory[] {
        return [...this.items];
    }

    peek(): GenerationHistory | undefined {
        return this.items[0];
    }

    dequeue(): GenerationHistory | undefined {
        const item = this.items.shift();
        if (item) {
            this.saveToStorage();
        }
        return item;
    }

    removeOldest(): GenerationHistory | undefined {
        const item = this.items.pop();
        if (item) {
            this.saveToStorage();
        }
        return item;
    }

    findById(id: string): GenerationHistory | undefined {
        return this.items.find(item => item.id === id);
    }

    removeById(id: string): boolean {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Private methods for persistence
    private saveToStorage(): void {
        if (typeof window === 'undefined') return; // Server-side safety check
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        } catch (error) {
            console.error('Failed to save history to storage:', error);
        }
    }

    private loadFromStorage(): void {
        if (typeof window === 'undefined') return; // Server-side safety check
        
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.items = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load history from storage:', error);
            this.items = [];
        }
    }

    // Utility methods
    size(): number {
        return this.items.length;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    isFull(): boolean {
        return this.items.length === this.maxSize;
    }

    clear(): void {
        this.items = [];
        this.saveToStorage();
    }
}

// Single global instance
export const responseQueue = new ResponseQueue(5);

export { ResponseQueue };