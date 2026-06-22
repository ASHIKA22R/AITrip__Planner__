document.getElementById("travelForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const destination = document.getElementById("destination").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("results").classList.add("hidden");

    try {
        const prompt = `Create a travel itinerary for ${destination} from ${startDate} to ${endDate}.

Format:
Day 1 | 9 AM | Activity
Day 1 | 2 PM | Activity
Day 2 | 10 AM | Activity`;

        const response = await fetch(
            "https://old-bonus-154c.rashika051.workers.dev/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        document.getElementById("loading").classList.add("hidden");

        const content =
            data.choices?.[0]?.message?.content || "";

        const itineraryBody =
            document.getElementById("itineraryBody");

        itineraryBody.innerHTML = "";

        content.split("\n").forEach(line => {
            const parts = line.split("|");

            if (parts.length === 3) {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${parts[0].trim()}</td>
                    <td>${parts[1].trim()}</td>
                    <td>${parts[2].trim()}</td>
                `;

                itineraryBody.appendChild(row);
            }
        });

        document.getElementById("results").classList.remove("hidden");

    } catch (error) {
        console.error(error);

        document.getElementById("loading").classList.add("hidden");

        alert("Error generating itinerary");
    }
});