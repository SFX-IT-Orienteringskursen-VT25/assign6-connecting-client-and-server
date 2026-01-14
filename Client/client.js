const API_URL = 'http://localhost:5262'; // Standard port for the Server (check launchSettings.json if diff)

async function getNumbers() {
    try {
        const response = await fetch(`${API_URL}/storage/enteredNumbers`);
        if (!response.ok) {
            console.warn('Initial fetch failed, maybe first run?', response.status);
            return [];
        }
        const data = await response.json();
        return data.numbers || [];
    } catch (error) {
        console.error('Error fetching numbers:', error);
        return [];
    }
}

async function saveNumbers(numbers) {
    try {
        const response = await fetch(`${API_URL}/storage/enteredNumbers`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ numbers: numbers })
        });
        
        if (!response.ok) throw new Error('Failed to save numbers');
        return true;
    } catch (error) {
        console.error('Error saving numbers:', error);
        alert('Failed to save number. Is the server running?');
        return false;
    }
}

function updateUI(numbers) {
    const list = document.getElementById('historyList');
    const totalDisplay = document.getElementById('totalDisplay');
    
    list.innerHTML = '';
    let sum = 0;
    
    numbers.forEach(num => {
        sum += num;
        const li = document.createElement('li');
        li.textContent = num;
        list.appendChild(li);
    });
    
    totalDisplay.textContent = sum;
}

async function addNumber() {
    const input = document.getElementById('numberInput');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }
    
    // 1. Get current state (to ensure we append to latest)
    let currentNumbers = await getNumbers();
    
    // 2. Add new number
    currentNumbers.push(value);
    
    // 3. Save new state
    const success = await saveNumbers(currentNumbers);
    
    if (success) {
        updateUI(currentNumbers);
        input.value = '';
        input.focus();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
    const numbers = await getNumbers();
    updateUI(numbers);
});
