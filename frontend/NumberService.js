export class NumberService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async addNumber(value) {
        if (!Number.isInteger(value)) {
            throw new Error("Value must be an integer.");
        }

        const body = {
            key: "number",  
            value: value
        };

        const res = await fetch(`${this.baseUrl}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return await res.json();
    }

    async getNumbers() {
        const res = await fetch(`${this.baseUrl}/items`);
        const items = await res.json();
        return items.map(x => x.value); 
    }

    async getSum() {
        const numbers = await this.getNumbers();
        return numbers.reduce((a, b) => a + b, 0);
    }
}
