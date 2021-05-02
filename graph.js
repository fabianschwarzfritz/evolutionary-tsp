const fs = require("fs");

class Graph {
  constructor(file, result) {
    this.file = file;
    this.route = result.route;
  }

  generate() {
    const xmax = Math.max(...this.route.map((c) => c.x));
    const ymax = Math.max(...this.route.map((c) => c.y));
    const factor = Math.max(xmax, ymax);

    let svgpoints = "";
    for(let point of this.route) {
      console.log(this.route);
      svgpoints += point.x * factor + "," + point.y * factor + " ";
    }
    // Route goes back to the beginning
    svgpoints += this.route[0].x * factor + "," + this.route[0].y * factor;
    console.log(svgpoints);

    const template = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 250 400">
      <polyline points='${svgpoints}'
       style='fill:none;stroke:black;stroke-width:1' />
    </svg>
    `;

    fs.writeFileSync(this.file, template);
  }
}

module.exports = Graph;

