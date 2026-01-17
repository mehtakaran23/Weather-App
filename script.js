async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const errorBox = document.getElementById("error");

    errorBox.textContent = "";

    if (!city) {
        errorBox.textContent = "Please enter a city name";
        return;
    }

    const API_KEY = "f165001292a6425da81131947261601";
    const url =
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found or API error");
        }

        const data = await response.json();

        // Location & time
        document.getElementById("city").textContent =
            `${data.location.name},${data.location.region} ,${data.location.country}`;

        document.getElementById("localTime").textContent =
            "Local time: " + data.location.localtime;

        document.getElementById("LastUpdated").textContent =
            "Updated: " + data.current.last_updated;


        // Main weather
        document.getElementById("icon").src =
            "https:" + data.current.condition.icon;

        document.getElementById("temp").textContent =
            data.current.temp_c + "°C";

        document.getElementById("condition").textContent =
            data.current.condition.text;

        // Extra parameters (#5)
        document.getElementById("humidity").textContent =
            data.current.humidity;

        document.getElementById("cloud").textContent =
            data.current.cloud;

        document.getElementById("rain").textContent =
            data.current.precip_mm;

        document.getElementById("wind").textContent =
            data.current.wind_kph + " km/h (" + data.current.wind_dir + ")";

        // day night theme
        // Day / Night theme
        document.body.classList.remove("day", "night");

        if (data.current.is_day === 1) {
            document.body.classList.add("day");
        } else {
            document.body.classList.add("night");
        }

        // WOW insight (#4)
        document.getElementById("insight").textContent =
            getInsight(data);


    } catch (err) {
        errorBox.textContent = err.message;
    }
}

function getInsight(data) {
    if (data.current.precip_mm > 0)
        return "🌧 Carry an umbrella today";

    if (data.current.uv >= 7)
        return "☀ High UV – wear sunglasses";

    if (data.current.temp_c < 10)
        return "🧥 Cold weather – wear warm clothes";

    if (data.current.temp_c > 30)
        return "🥵 Hot weather – stay hydrated";

    return "✅ Pleasant weather today";
}

// Clear UI on page refresh
window.addEventListener("load", () => {
    // Clear input
    document.getElementById("cityInput").value = "";

    // Clear text fields
    const idsToClear = [
        "city",
        "localTime",
        "LastUpdated",
        "temp",
        "condition",
        "humidity",
        "cloud",
        "rain",
        "wind",
        "insight",
        "error"
    ];

    idsToClear.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });

    // Clear icon
    const icon = document.getElementById("icon");
    if (icon) icon.src = "";
});

document
    .getElementById("cityInput")
    .addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            getWeather();
        }
    });



if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registered"))
        .catch(err => console.error("SW failed", err));
}
