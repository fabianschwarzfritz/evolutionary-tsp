const City = require("./City");

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

module.exports = Individual;

