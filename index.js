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

/**
 * Represents a population of routes the salesman takes.
 * Each individual in the population is an array of cities
 * the salesman visits.
 */
class Population {
  constructor() {
    this.population = [];
  }

  /**
   * Adds multiple random ordered variants of the given input *cities*
   * to the population.
   * *size* specifies how many rnadom orders are added to the population
   */
  random(size, cities) {
    for(let i = 0; i < size; i++) {
      const random = [...cities].sort(() => Math.random() - 0.5);
      const individual = new Individual(random)
      this.population.push(individual);
    }
  }

  /**
   * Ranks the population consisting of the individuals.
   * Only individuals that don't have a fitness value yet,
   * are re-calculated.
   * Returns an array sorted by the fitness.
   */
  rankPopulation() {
    for(const individual of this.population) {
      if(!individual.isRanked()) {
        individual.routeFitness();
      }
    }
    const sorted = this.population.sort((a, b) => b.fitness - a.fitness);
    return sorted;
  }

  /**
   * For now we only use the "Fitness proportionate selection"
   * 
   * We assign a relative probability for selection for each
   * individual representing the probability of selection.
   */
  next() {
    this.printDebug();

    const elite = 0.2;
    const mutateProbability = 0.1;

    const size = this.population.length;
    const ranked = this.rankPopulation();
    const eliteCount = Math.floor(size * elite);
    const eliteCopy = this.copy(ranked);
    const elitePopulation = eliteCopy.slice(0, eliteCount);

    const poolCopy = this.copy(ranked);
    let pool = this.createMatingPool(poolCopy);
    this.mutatePool(pool, mutateProbability);
    pool.sort((a, b) => b.fitness - a.fitness);
    pool = pool.slice(0, size - eliteCount);

    const oldPopulationCopy = this.copy(this.population);
    const nextGeneration = []
      .concat(elitePopulation)
      .concat(pool)
      .concat(oldPopulationCopy);
    nextGeneration.sort((a, b) => b.fitness - a.fitness);
    this.population = nextGeneration.slice(0, size);
  }

  /**
   * Helper function to create a deep copy of the current population
   */
  copy() {
    const result = [];
    const data = JSON.parse(JSON.stringify(this.population));
    for(let d of data) {
      const individual = Individual.from(d);
      result.push(individual);
    }
    return result;
  }

  /**
   * Mutate each individual of *pool*.
   * Probability of mutation passed in *rate*.
   */
  mutatePool(pool, rate) {
    for(let i = 0; i < pool.length; i++) {
      if(Math.random() < rate) {
        pool[i].mutate();
      }
    }
  }

  /**
   * The mutating pool helps us to make it more probabe to
   * select fitter individual.
   * Returns an array where the *individuals* appear more often
   * the fitter they are.
   */
  createMatingPool(individuals) {
    const result = [];
    individuals.forEach((individual) => {
      const times = Math.floor(individual.fitness * 100) || 1;
      for (let i = 0; i < times; i++) {
        result.push(individual);
      }
    });
    return result;
  }

  /**
   * Returns the best individual of this population
   * The function does not modify the population array.
   */
  fittest() {
    let fittest = { fitness: 0 };
    for(let individual of this.population) {
      if (individual.fitness > fittest.fitness) {
        fittest = individual;
      }
    }
    return fittest;
  }

  /**
   * Helper function printing debug information about
   * the current stat of the population.
   */
  printDebug() {
    console.log(`\nPopulation:`);
    let sum = 0;
    for(let i of this.population) {
      const distance = i.distance || 0;
      sum += distance;
    }
    const best = this.population[0].distance|| 0;
    const worst = this.population[this.population.length - 1].distance || 0;
    console.log(`Average population fitness: ${sum / this.population.length}, best: ${best.toFixed(4)}, worst: ${worst.toFixed(4)}`);
  }
}

/**
 * ***************** Test coding *****************
 */

/**
 * Helper test function so that we can assert statement
 * write test coding to verify certain behavior.
 */
function assert(actual, expected, message) {
    if (actual === expected) {
      console.log(`test ok`);
    } else {
        throw new Error(message || `Assertion failed.\n Actual: ${actual}\nExpected: ${expected}`);
    }
}


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
  console.log(`Best route found: ${population.fittest().toString()}`);
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

