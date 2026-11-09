const API_URL = 'http://localhost:5262/storage';
const STORAGE_KEY = 'numbers';

// Replaces localStorage.getItem — returns [] when nothing has been stored yet (404).
async function loadNumbers() {
    const response = await fetch(`${API_URL}/${STORAGE_KEY}`, { method: 'GET' });
    if (response.status === 404) return [];
    if (!response.ok) throw new Error(`Failed to load numbers (${response.status})`);

    const data = await response.json();
    return JSON.parse(data.value);
}

// Replaces localStorage.setItem
async function saveNumbers(numbers) {
    const response = await fetch(`${API_URL}/${STORAGE_KEY}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: JSON.stringify(numbers) }),
    });
    if (!response.ok) throw new Error(`Failed to save numbers (${response.status})`);
}

// Replaces localStorage.removeItem
async function clearNumbers() {
    const response = await fetch(`${API_URL}/${STORAGE_KEY}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to clear numbers (${response.status})`);
    return { numbers: [], sum: 0 };
}

async function manageNumbers(newNumber) {
    const numbers = await loadNumbers();

    if (newNumber !== undefined) {
        numbers.push(newNumber);
        await saveNumbers(numbers);
    }

    const sum = numbers.reduce((acc, n) => acc + n, 0);
    return { numbers, sum };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { manageNumbers, clearNumbers, API_URL, STORAGE_KEY };
}
