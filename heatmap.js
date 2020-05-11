let width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const maxMonthWidth = 55;
let monthWidth = Math.min(width / 20, maxMonthWidth);

const svg = d3.select("svg");

svg.attr("width", 200 + 0.6 * width).attr("height", data.length * 150);

const colorScale = d3
  .scaleLinear()
  .domain([-10, 0, 7, 14, 21, 24])
  .range(["#814ee7", "#3f24ec", "#79e87C", "#fbe157", "#ff9737", "#fe3b3b"]);

const boxScale = d3
  .scaleLinear()
  .domain([-20, 45])
  .range([150, 0]);

const unitScale = d3
  .scaleLinear()
  .domain([0, 100])
  .rangeRound([32, 212]);

const lineGenerator = d3
  .line()
  .curve(d3.curveBasis)
  .x((d, i) => 200 + monthWidth / 2 + monthWidth * i)
  .y((d, i) => boxScale(d));

const dataPoints = svg
  .selectAll("g.data-point")
  .data(data)
  .enter()
  .append("g")
  .attr("class", "data-point")
  .attr("transform", (d, i) => `translate(0, ${i * 150})`);

dataPoints
  .append("text")
  .attr("x", 175)
  .attr("y", 70)
  .attr("class", "city")
  .text((d, i) => d.city);

dataPoints
  .append("text")
  .attr("x", 175)
  .attr("y", 100)
  .attr("class", "country")
  .text((d, i) => d.country);

const months = dataPoints
  .append("g")
  .attr("class", "months")
  .attr("transform", "translate(200, 0)");

const monthGroups = months
  .selectAll("g.month")
  .data((d, i) => d.months)
  .enter()
  .append("g")
  .attr("class", "month")
  .attr("transform", (d, i) => `translate(${i * monthWidth}, 0)`);

const monthRects = monthGroups
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", monthWidth)
  .attr("height", 140)
  .style("fill", (d, i) => colorScale(d));

const monthCircs = monthGroups
  .append("circle")
  .attr("cx", monthWidth / 2)
  .attr("cy", (d, i) => boxScale(d))
  .attr("r", Math.min(15, monthWidth / 2));

const temperatures = monthGroups
  .append("text")
  .attr("class", "temp")
  .attr("x", monthWidth / 2)
  .attr("y", (d, i) => boxScale(d) + 2)
  .text((d, i) => d)
  .style("fill", (d, i) => colorScale(d));

const lineGraph = dataPoints
  .append("path")
  .datum((d, i) => d.months)
  .attr("d", (d, i) => lineGenerator(d));

const selectTag = document.querySelector("select");

selectTag.addEventListener("input", function() {
  if (this.value === "c") {
    temperatures.text((d, i) => d);
  } else {
    temperatures.text((d, i) => unitScale(d));
  }
});

const bodyTag = document.querySelector("body");

bodyTag.onresize = () => {
  width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  svg.attr("width", 200 + 0.6 * width).attr("height", data.length * 150);
  monthWidth = Math.min(width / 20, maxMonthWidth);

  monthGroups.attr("transform", (d, i) => `translate(${i * monthWidth}, 0)`);
  monthRects.attr("width", monthWidth);
  monthCircs.attr("cx", monthWidth / 2);
  monthCircs.attr("r", Math.min(15, monthWidth / 2));
  temperatures.attr("x", monthWidth / 2);
  lineGraph.attr("d", (d, i) => lineGenerator(d));
};
