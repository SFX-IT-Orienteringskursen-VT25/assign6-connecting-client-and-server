export async function getNumbers() {
  try {
    const response = await fetch("http://localhost:5262/numbers");

    if (!response.ok) {
      const error = await response.json();
      console.error("Error:", error);
      return;
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Request failed:", err);
  }
}
