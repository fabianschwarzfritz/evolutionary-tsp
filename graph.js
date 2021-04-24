const fs = require("fs");

class Graph {
  constructor(file, result) {
    this.file = file;
    this.route = result.route;
  }

  generate() {
    // TODO calculate factor
    const factor = 1;
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
       style='fill:none;stroke:black;stroke-width:3' />
    </svg>
    `;

    fs.writeFileSync(this.file, template);
  }
}

module.exports = Graph;

