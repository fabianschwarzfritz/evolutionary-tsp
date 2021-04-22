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

module.exports = Population;

