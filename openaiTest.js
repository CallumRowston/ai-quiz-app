const apiKey = process.env.OPENAI_API_KEY; // Or paste your key directly for testing

if (!apiKey) {
  console.error("No API key found. Set OPENAI_API_KEY in your environment.");
  process.exit(1);
}

async function testOpenAI() {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Say hello!" }
      ],
      max_tokens: 10,
    }),
  });

  const data = await response.json();
  console.log("OpenAI API response:", JSON.stringify(data, null, 2));
}

testOpenAI().catch(console.error);