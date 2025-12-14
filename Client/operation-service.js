class Operation {
    // generate summation of array of numbers passed as parameter
    calculateSum = (numbers) => numbers.reduce((sum, num) => sum + num, 0);
    // persist to db storage
    setNumbers = async (numbers) => {
        const response = await fetch(`https://localhost:5002/api/storage/numbers`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: JSON.stringify(numbers) })
        });
        
        return response.ok;
    };
    // retrieve from db storage
    getNumbers = async() => { 
        try {
            const response = await fetch('https://localhost:5002/api/storage/numbers', { method: 'GET' });
            
            if (!response.ok) {
                if (response.status === 404) {
                    return [];
                }
                throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            return JSON.parse(data.value || '[]');
        } catch (error) {
            console.error('Error fetching from storage:', error);
            return [];
        }
    }
    // remove from db storage
    removeNumbers = async () => {
        const response = await fetch('https://localhost:5002/api/storage/numbers', { method: 'DELETE' });
        return response.ok;
    }
}

export default Operation