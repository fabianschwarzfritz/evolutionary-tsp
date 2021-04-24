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
const Graph = require("./Graph");
const { assert } = require("./testutil");
const args = require("./programargs");

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

/**
 * Generates a population from the sample,
 * iterates over them and returns the fittest individual
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
  return fittest;
}

/**
 * Sample set of cities we use for more data.
 */
function predefinedSample(evolutions, pool) {
  const predefined = JSON.parse(`[{"x":6,"y":10},{"x":11,"y":13},{"x":6,"y":13},{"x":4,"y":14},{"x":18,"y":6},{"x":15,"y":10},{"x":12,"y":16},{"x":11,"y":19},{"x":11,"y":0},{"x":16,"y":6}]`);

  const sample = [];
  for(let i = 0; i < predefined.length; i++) {
    const city = new City(predefined[i].x, predefined[i].y);
    sample.push(city);
  }

  return evolution(sample, evolutions, pool);
}

/**
 * Larger randomly generated set of cities.
 */
function generatedSample(evolutions, pool) {
  const gen = new CitiesGenerator();
  const sample = gen.randomCities({ numberOfCities: 80, maxCoordinate: 100 });

  return evolution(sample, evolutions, pool);
}

/**
 * ***************** Main program *****************
 */

console.log("\n==================== TSP solution using evolutionary algorithms ====================");
console.log("  * Read more on https://github.com/fabianschwarzfritz/evolutionary-tsp");
console.log("  * Development in progress. Contribute ! :)\n");

const options = args();
console.log("  * Program runs with options:");
console.log(options);
console.log("  * and this is the result:");

if(options.text) {
  test();
}
if(options.predefined) {
  console.log("predefined");
  const route = predefinedSample(options.evolutions, options.pool);
  console.log("checks for graph");
  if(options.graph) {
    console.log("Generates a graph");
    const graph = new Graph(options.graph, route);
    graph.generate();
  }
}
if(options.generated) {
  generatedSample(options.evolutions, options.pool);
}

