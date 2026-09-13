export async function postNumber(number) {
  try {
    const response = await fetch("http://localhost:5262/numbers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error:", error);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.error("Request failed:", err);
  }
}
