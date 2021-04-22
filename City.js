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

module.exports = City;

