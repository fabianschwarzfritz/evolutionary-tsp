const City = require("./City");

/**
 * Helper class to generate a number of random cities.
 */
class CitiesGenerator {
  randomCities(options) {
    const count = options.numberOfCities || 10;
    const max = options.maxCoordinate || 100;

    const result = [];
    for(let i = 0; i < count; i++) {
      const city = new City();
      city.random(max);
      result.push(city);
    }
    return result;
  }
}

module.exports = CitiesGenerator;

