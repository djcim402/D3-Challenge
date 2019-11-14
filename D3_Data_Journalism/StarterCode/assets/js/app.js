// @TODO: YOUR CODE HERE!
// Set dimensions and margins of graph
var svgWidth = 960;
var svgHeight = 600;

// Set svg margins 
var margin = {
  top: 20,
  right: 60,
  bottom: 80,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";

// Function is called and passes csv data
d3.csv("./assets/data/data.csv").then(function(stateData, err) {
  if (err) throw err;

  // Parse Data
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // xLinearScale Function
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(stateData, d => d.poverty)])
    .range([0, width]);

  // yLinearScale Function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3. axisLeft(yLinearScale);

  // Append x Axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Append y Axis
  chartGroup.append("g")
    .call(leftAxis);

  // Append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10)
    .attr("fill", "green")
    .attr("opacity", ".5");

  // Add text to circles
  var circlesGroup = chartGroup.selectAll()
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("font-size", "10px")
    .attr("dx", -7)
    .attr("dy", 4)
    .attr('fill', 'white')
    .text(d => (d.abbr));

  // Create labels
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .attr("x", 0)
    .attr("y", 20)
    .text("In Poverty (%)");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2 + 60))
    .attr("dy", "1em")
    .text("Lacks Healthcare (%)");

  // Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%</strong>`);
    });

  // Create tool tip
  circlesGroup.call(toolTip);

  // Create event listeners to display tool tip
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });

});