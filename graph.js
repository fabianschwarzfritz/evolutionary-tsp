const fs = require("fs");

const output = process.argv[2] || "generated.svg";

const route = JSON.parse(`
{"route":[{"x":29,"y":90},{"x":24,"y":82},{"x":34,"y":83},{"x":55,"y":79},{"x":44,"y":86},{"x":34,"y":70},{"x":52,"y":83},{"x":55,"y":83},{"x":54,"y":86},{"x":23,"y":53},{"x":39,"y":47},{"x":30,"y":41},{"x":33,"y":23},{"x":31,"y":28},{"x":22,"y":19},{"x":21,"y":19},{"x":8,"y":1},{"x":5,"y":7},{"x":14,"y":5},{"x":39,"y":17},{"x":45,"y":17},{"x":1,"y":16},{"x":24,"y":21},{"x":18,"y":43},{"x":41,"y":24},{"x":56,"y":27},{"x":55,"y":12},{"x":71,"y":19},{"x":99,"y":6},{"x":69,"y":38},{"x":76,"y":32},{"x":68,"y":50},{"x":85,"y":50},{"x":91,"y":73},{"x":82,"y":85},{"x":81,"y":81},{"x":77,"y":92},{"x":77,"y":95},{"x":75,"y":80},{"x":70,"y":63},{"x":64,"y":48},{"x":55,"y":38},{"x":55,"y":63},{"x":41,"y":88},{"x":35,"y":72},{"x":27,"y":77},{"x":26,"y":70},{"x":39,"y":54},{"x":68,"y":64},{"x":57,"y":61},{"x":86,"y":55},{"x":78,"y":69},{"x":99,"y":72},{"x":87,"y":71},{"x":88,"y":84},{"x":95,"y":91},{"x":98,"y":79},{"x":67,"y":99},{"x":68,"y":97},{"x":95,"y":37},{"x":84,"y":33},{"x":91,"y":33},{"x":93,"y":41},{"x":44,"y":7},{"x":50,"y":16},{"x":67,"y":25},{"x":66,"y":45},{"x":62,"y":56},{"x":46,"y":49},{"x":11,"y":71},{"x":5,"y":68},{"x":0,"y":30},{"x":10,"y":93},{"x":10,"y":92},{"x":1,"y":89},{"x":2,"y":92},{"x":4,"y":99},{"x":23,"y":75},{"x":26,"y":76},{"x":45,"y":96}],"distance":1476.7701819552462,"fitness":0.0006771534340407647}
`).route;
console.log(route);

// Generates the route
const factor = 1;
let svgpoints = "";
for(let point of route) {
  console.log(route);
  svgpoints += point.x * factor + "," + point.y * factor + " ";
}
// Route goes back to the beginning
svgpoints += route[0].x * factor + "," + route[0].y * factor;
console.log(svgpoints);

const template = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 250 400">
  <polyline points='${svgpoints}'
   style='fill:none;stroke:black;stroke-width:3' />
</svg>
`;

fs.writeFileSync(output, template);

