const { manageNumbers, clearNumbers, API_URL, STORAGE_KEY } = require('./numbers');

const URL = `${API_URL}/${STORAGE_KEY}`;

// In-memory fake of the server's /storage/{key} endpoints.
let stored;

beforeEach(() => {
    stored = undefined;
    global.fetch = jest.fn(async (url, { method, body }) => {
        expect(url).toBe(URL);
        if (method === 'GET') {
            if (stored === undefined) return { ok: false, status: 404 };
            return { ok: true, status: 200, json: async () => ({ value: stored }) };
        }
        if (method === 'PUT') {
            stored = JSON.parse(body).value;
            return { ok: true, status: 204 };
        }
        if (method === 'DELETE') {
            stored = undefined;
            return { ok: true, status: 204 };
        }
        throw new Error(`Unexpected method ${method}`);
    });
});

test('returns empty list and zero sum when no numbers stored', async () => {
    const result = await manageNumbers();
    expect(result.numbers).toEqual([]);
    expect(result.sum).toBe(0);
});

test('adds a number and returns updated list and sum', async () => {
    const result = await manageNumbers(5);
    expect(result.numbers).toEqual([5]);
    expect(result.sum).toBe(5);
});

test('accumulates multiple numbers across calls', async () => {
    await manageNumbers(3);
    await manageNumbers(7);
    const result = await manageNumbers(10);
    expect(result.numbers).toEqual([3, 7, 10]);
    expect(result.sum).toBe(20);
});

test('saves numbers to the server with PUT', async () => {
    await manageNumbers(4);
    expect(fetch).toHaveBeenCalledWith(URL, expect.objectContaining({ method: 'PUT' }));
    expect(stored).toBe('[4]');
});

test('handles negative numbers', async () => {
    await manageNumbers(10);
    const result = await manageNumbers(-3);
    expect(result.numbers).toEqual([10, -3]);
    expect(result.sum).toBe(7);
});

test('does not save when called without argument', async () => {
    await manageNumbers();
    expect(fetch).not.toHaveBeenCalledWith(URL, expect.objectContaining({ method: 'PUT' }));
});

test('clearNumbers deletes the stored numbers', async () => {
    await manageNumbers(1);
    const cleared = await clearNumbers();
    expect(cleared).toEqual({ numbers: [], sum: 0 });
    expect((await manageNumbers()).numbers).toEqual([]);
});

test('throws when the server returns an error', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(manageNumbers()).rejects.toThrow('500');
});
