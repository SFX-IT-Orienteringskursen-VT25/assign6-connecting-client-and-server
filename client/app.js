class NumberCalculator {
    constructor() {
        this.API_BASE_URL = 'http://localhost:3001/api';
        this.numbers = [];
        this.total = 0;
        this.count = 0;
        
        // DOM Elements
        this.numberInput = document.getElementById('numberInput');
        this.addBtn = document.getElementById('addBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.totalSum = document.getElementById('totalSum');
        this.numberCount = document.getElementById('numberCount');
        this.historyList = document.getElementById('historyList');
        this.status = document.getElementById('status');
        
        // Event Listeners
        this.addBtn.addEventListener('click', () => this.addNumber());
        this.clearBtn.addEventListener('click', () => this.clearNumbers());
        this.numberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addNumber();
        });
        
        // Load initial data
        this.loadNumbers();
    }
    
    async loadNumbers() {
        try {
            this.showStatus('Loading numbers...', 'info');
            const response = await fetch(`${this.API_BASE_URL}/numbers`);
            
            if (!response.ok) {
                throw new Error(`Failed to load numbers (${response.status})`);
            }
            
            const data = await response.json();
            this.numbers = data.numbers || [];
            this.total = data.total || 0;
            this.count = data.count || 0;
            
            this.updateDisplay();
            this.hideStatus();
        } catch (error) {
            console.error('Error loading numbers:', error);
            this.showStatus(`Error: ${error.message}`, 'error');
        }
    }
    
    async addNumber() {
        const value = this.numberInput.value.trim();
        
        if (!value || isNaN(value)) {
            this.showStatus('Please enter a valid number', 'error');
            return;
        }
        
        try {
            this.showStatus('Adding number...', 'info');
            const response = await fetch(`${this.API_BASE_URL}/numbers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ number: value })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to add number (${response.status})`);
            }
            
            const data = await response.json();
            
            // Update local state
            this.numbers = data.numbers;
            this.total = data.total;
            this.count = data.count;
            
            // Update display
            this.updateDisplay();
            this.numberInput.value = '';
            this.numberInput.focus();
            this.showStatus(`Added number: ${value}`, 'success');
            
        } catch (error) {
            console.error('Error adding number:', error);
            this.showStatus(`Error: ${error.message}`, 'error');
        }
    }
    
    async clearNumbers() {
        if (!confirm('Are you sure you want to clear all numbers?')) {
            return;
        }
        
        try {
            this.showStatus('Clearing numbers...', 'info');
            const response = await fetch(`${this.API_BASE_URL}/numbers`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to clear numbers (${response.status})`);
            }
            
            const data = await response.json();
            
            // Clear local state
            this.numbers = data.numbers;
            this.total = data.total;
            this.count = data.count;
            
            this.updateDisplay();
            this.showStatus('All numbers cleared', 'success');
            
        } catch (error) {
            console.error('Error clearing numbers:', error);
            this.showStatus(`Error: ${error.message}`, 'error');
        }
    }
    
    updateDisplay() {
        // Update total and count
        this.totalSum.textContent = this.total.toFixed(2);
        this.numberCount.textContent = this.count;
        
        // Update history list
        this.historyList.innerHTML = '';
        
        if (this.numbers.length === 0) {
            this.historyList.innerHTML = `
                <div class="empty-history">
                    No numbers added yet. Start by entering a number above!
                </div>
            `;
            return;
        }
        
        this.numbers.forEach(num => {
            const item = document.createElement('div');
            item.className = 'number-item';
            
            const date = new Date(num.created_at);
            const timeString = date.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            item.innerHTML = `
                <div class="value">${parseFloat(num.value).toFixed(2)}</div>
                <div class="time">${timeString}</div>
            `;
            
            this.historyList.appendChild(item);
        });
    }
    
    showStatus(message, type = 'info') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
    }
    
    hideStatus() {
        this.status.className = 'status';
        this.status.textContent = '';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NumberCalculator();
});