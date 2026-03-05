async function fetchJson(url) {
  const resp = await fetch(url);
  return resp.json();
}

async function getDashboardData(query) {
  const destinations = fetchJson(
    `http://localhost:3333/destinations?search=${query}`,
  );
  const weathers = fetchJson(`http://localhost:3333/weathers?search=${query}`);
  const airports = fetchJson(`http://localhost:3333/airports?search=${query}`);
  const promises = [destinations, weathers, airports];
  let result;

  try {
    result = await Promise.all(promises);
  } catch (error) {
    throw new Error("Impossibile caricare una delle API");
  }

  return result;
}

(async () => {
  const [destinations, weathers, airports] = await getDashboardData("london");
  const [destination] = destinations;
  const [weather] = weathers;
  const [airport] = airports;
  console.log(
    `${destination.name} is in ${destination.country}.\n` +
      `Today there are ${weather.temperature} degrees and the weather is ${weather.weather_description}.\n` +
      `The main airport is ${airport.name}.\n`,
  );
})();
