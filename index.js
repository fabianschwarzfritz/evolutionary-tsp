/**
 * Simple implementation of a Genetic Algorithm, solving
 * the Travelling Salesman Problem (TSP).
 *
 * It's implemented in JavaScript, running on NodeJS, without any
 * external dependencies. Pure focus on the algorithm.
 * The program a helper function for testing ('assert' function),
 * and a test that is always executed before the program is run.
 * I know it's not how it's supposed to be done, but it's for the
 * sake of simplicity and the focus on the actual problem.
 */

const City = require("./City");
const CitiesGenerator = require("./CitiesGenerator");
const Individual = require("./Individual");
const Population = require("./Population");
const { assert } = require("./testutil");

/**
 * ***************** Test coding *****************
 */

/**
 * Test coding to verify the basic calculations.
 */
function test() {
  const cities = [
    new City(0, 0),
    new City(5, 0),
    new City(5, 5),
    new City(0, 5)
  ];

  const actualDistance = cities[0].distance(cities[2]).toFixed(2) * 100;
  const expectedDistance = 707;
  assert(actualDistance, expectedDistance);

  const individual = new Individual(cities);
  individual.routeDistance();
  assert(individual.distance, 20);
  individual.routeFitness();
  assert(individual.fitness, 0.05);

  assert(individual.route.length, 4);
  individual.mutate();
  assert(individual.route.length, 4);
}

/**
 * ***************** sample data *****************
 */

function evolution(sample, evolutionsCount, poolSize) {
  const population = new Population();
  population.random(poolSize, sample);

  for(let i = 0; i < evolutionsCount; i++) {
    console.log(`\nEvolution number ${i}`);
    population.next();
  }
  const fittest = population.fittest();
  console.log(`Best route found: ${fittest.toString()}`);
  console.log(`JSON`);
  console.log(JSON.stringify(fittest));
  console.log(`JSON`);
}

/**
 * Sample set of cities we use for more data.
 */
function predefinedSample() {
  const predefined = JSON.parse(`[{"x":6,"y":10},{"x":11,"y":13},{"x":6,"y":13},{"x":4,"y":14},{"x":18,"y":6},{"x":15,"y":10},{"x":12,"y":16},{"x":11,"y":19},{"x":11,"y":0},{"x":16,"y":6}]`);

  const sample = [];
  for(let i = 0; i < predefined.length; i++) {
    const city = new City(predefined[i].x, predefined[i].y);
    sample.push(city);
  }
  const evolutionsCount = 1000;
  const poolSize = 10;

  evolution(sample, evolutionsCount, poolSize);
}

/**
 * Larger randomly generated set of cities.
 */
function generatedSample() {
  const gen = new CitiesGenerator();
  const sample = gen.randomCities({ numberOfCities: 100, maxCoordinate: 10000});
  const evolutionsCount = 100;
  const poolSize = 10;

  evolution(sample, evolutionsCount, poolSize);
}

/**
 * ***************** Main program *****************
 */
function main() {
  test();
  predefinedSample();
  generatedSample();
}
main();

