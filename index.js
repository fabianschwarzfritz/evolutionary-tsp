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


/**
 * Represents one city that the traveller visits
 */
class City {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  from(json) {
    return Object.assign(new City(), json);
  }

  random(max) {
    this.x = Math.floor(Math.random() * max);
    this.y = Math.floor(Math.random() * max);
  }

  distance(to) {
    const xDis = Math.abs(this.x - to.x);
    const yDis = Math.abs(this.y - to.y);
    const xPow = Math.pow(xDis, 2);
    const yPow = Math.pow(yDis, 2);
    const sum = xPow + yPow;
    const distance = Math.sqrt(sum);
    return distance;
  }

  toString() {
    return `(${this.x},${this.y})`;
  }
}

/**
 * Helper class to generate a number of random cities.
 */
class CitiesGenerator {
  randomCities(count, max) {
    const result = [];
    for(let i = 0; i < count; i++) {
      const city = new City();
      city.random(max);
      result.push(city);
    }
    return result;
  }
}


/**
 * Can calculate distance and fitness of a selected route
 * the salesman takes. The order in the array containing
 * the cities determines the order in which the salesman
 * visits all cities (in addition to going back to the first
 * city after visiting the last one).
 */
class Individual {
  constructor(route) {
    this.route = route;
    this.distance = undefined;
    this.fitness = undefined;
  }

  static from(json){
    const result = Object.assign(new Individual(), json);
    for(let i = 0; i < result.route.length; i++) {
      result.route[i] = Object.assign(new City(result.route[i].x, result.route[i].y));
    }
    return result;
  }

  /**
   * Calulated the distance the salesman has to take
   * for this individual.
   */
  routeDistance() {
    let distance = 0;
    this.route.forEach(function(from, i, route) {
      // Either next city or back to be first city
      const to = route[i+1] || route[0]
      distance += from.distance(to);
    });
    this.distance = distance;
  }

  /**
   * Calculates the distance for this route
   * and also calculates the fitness for
   * this individual.
   */
  routeFitness() {
    this.routeDistance();
    this.fitness = 1 / this.distance;
  }

  /**
   * Returns a boolean indicating whether this
   * individual is ranked or not.
   */
  isRanked() {
    return this.distance !== undefined
      && this.fitness !== undefined;
  }

  /**
   * Mutates a single individual.
   * In the TSP problem, the mutation is a substring reverse, essentially
   * removing "crossings" of the salesman
   */
  mutate() {
    let start = Math.floor(Math.random() * this.route.length);
    let end = Math.floor(Math.random() * this.route.length);
    if(start > end) {
      const tmp = start;
      start = end;
      end = tmp;
    }

    const partial = this.route.slice(start, end);
    partial.reverse();
    const partialSize = partial.length
    this.route.splice(start, partialSize, ...partial);
    this.routeFitness();
  }

  /**
   * Returns a nice string with information about the individual
   */
  toString() {
    const text = this.route.join("/");
    return `{ fitness: ${this.fitness.toFixed(3)}, ${text}}`;
  }
}

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
    console.log(`Average population fitness: ${sum / this.population.length}, best: ${best.toFixed(4)}, worst: ${worst.toFixed(4)}}`);
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
test();

/**
 * ***************** Main program *****************
 */

/**
 * Sample set of cities we use for more data.
 */
function sample() {
  const predefined = JSON.parse(`[{"x":6,"y":10},{"x":11,"y":13},{"x":6,"y":13},{"x":4,"y":14},{"x":18,"y":6},{"x":15,"y":10},{"x":12,"y":16},{"x":11,"y":19},{"x":11,"y":0},{"x":16,"y":6}]`);
  const sample = [];
  for(let i = 0; i < predefined.length; i++) {
    const city = new City(predefined[i].x, predefined[i].y);
    sample.push(city);
  }

  const population = new Population();
  population.random(10, sample);

  const times = 1000;
  for(let i = 0; i < times; i++) {
    console.log(`\nPopulation number ${i}`);
    population.next();
  }
  console.log(`Best route found: ${population.fittest().toString()}`);
}
sample();

