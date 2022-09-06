const searchParams = `fields=flags,altSpellings,capital,population,languages`;

export function fetchCountries (countryName) { 
    const url = `https://restcountries.com/v3.1/name/${countryName}?${searchParams}`;
    return fetch(url).then(
    response => {
        if (!response.ok) {
          if (response.status === 404) {
            return [];
          }
          throw new Error(response.status);
        }
        return response.json();
      });
}

