const fetch = require("node-fetch");

const getCountriesData = async () => {
  try {
    const response = await fetch(
      "https://www.jsonkeeper.com/b/L23E"
    );
    const data = await response.json();
    return data.countries;
  } catch (error) {
    console.error("An error occurred while fetching country data:", error);
    return [];
  }
};

module.exports = {
    name: '$country',
    type: 'djs',
    author: "jollyjolli",
    version: ["6.4.0"],
    description: "To get information about a country",
    example: "$country[China;Capital: {capital_en}]",
    code: async (d) => {
    const data = d.util.aoiFunc(d);
    const [countryName, format] = data.inside.splits;

    const countries = await getCountriesData();

    const country = countries.find(
      (c) =>
        c.name_en.toLowerCase() === countryName.toLowerCase() ||
        c.name_es.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) {
      data.result = "Invalid country specified!";
      return { code: d.util.setCode(data) };
    }

    if (!format) {
      data.result = "No format specified!";
      return { code: d.util.setCode(data) };
    }

    const placeholders = {
      "{name_en}": country.name_en,
      "{name_es}": country.name_es,
      "{continent_en}": country.continent_en,
      "{continent_es}": country.continent_es,
      "{capital_en}": country.capital_en,
      "{capital_es}": country.capital_es,
      "{dial_code}": country.dial_code,
      "{code_2}": country.code_2,
      "{code_3}": country.code_3,
      "{tld}": country.tld,
      "{km2}": country.km2,
      "{flag}": `:flag_${country.code_2.toLowerCase()}:`,
      "{image}": `https://flagcdn.com/w2560/${country.code_2.toLowerCase()}.jpg`,
    };

    let result = format;
    for (const placeholder in placeholders) {
      result = result.replace(
        new RegExp(placeholder, "g"),
        placeholders[placeholder]
      );
    }

    data.result = result;

    return { code: d.util.setCode(data) };
  },
};
