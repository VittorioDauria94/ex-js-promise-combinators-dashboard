async function fetchJson(url) {
  const resp = await fetch(url);
  return resp.json();
}

async function getDashboardData(query) {
  try {
    const destinationsData = fetchJson(
      `http://localhost:3333/destinations?search=${query}`,
    );
    const weathersData = fetchJson(
      `http://localhost:3333/weathers?search=${query}`,
    );
    const airportsData = fetchJson(
      `http://localhost:3333/airports?search=${query}`,
    );
    const promises = [destinationsData, weathersData, airportsData];
    const [destinationsSettled, weathersSettled, airportsSettled] =
      await Promise.allSettled(promises);

    const data = {
      city: null,
      country: null,
      temperature: null,
      weather: null,
      airport: null,
    };

    // Destinations controll

    if (destinationsSettled.status === "rejected") {
      console.error(
        "Errore nel caricamento di destinations:",
        destinationsSettled.reason,
      );
    } else {
      const destinations = destinationsSettled.value;
      data.city = destinations[0]?.name ?? null;
      data.country = destinations[0]?.country ?? null;
    }

    // weathers controll

    if (weathersSettled.status === "rejected") {
      console.error(
        "Errore nel caricamento di weathers:",
        weathersSettled.reason,
      );
    } else {
      const weathers = weathersSettled.value;
      data.temperature = weathers[0]?.temperature ?? null;
      data.weather = weathers[0]?.weather_description ?? null;
    }

    // airports controll

    if (airportsSettled.status === "rejected") {
      console.error(
        "Errore nel caricamento di airports:",
        airportsSettled.reason,
      );
    } else {
      const airports = airportsSettled.value;
      data.airport = airports[0]?.name ?? null;
    }

    return data;
  } catch (error) {
    throw new Error(`Errore nel caricamento di una delle API: ${error}`);
  }
}

(async () => {
  try {
    const data = await getDashboardData("vienna");
    console.log(`Dashboard data:`, data);
    let message = ``;
    if (data.city != null && data.country != null) {
      message += `${data.city} is in ${data.country}.\n`;
    }
    if (data.temperature != null && data.weather != null) {
      message += `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`;
    }
    if (data.airport != null) {
      message += `The main airport is ${data.airport}.\n`;
    }
    console.log(message);
  } catch (error) {
    console.error(error);
  }
})();
