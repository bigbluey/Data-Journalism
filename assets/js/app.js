// Data Journalism - D3

// Setup Chart Parameters/Dimensions
var svgWidth = 960;
var svgHeight = 500;

// Set SVG Margins
var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
  };

// Define Dimensions of the Chart Area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG Element/Wrapper - Select Body, Append SVG Area & Set the Dimensions
var svg = d3.select("#scatter")
  .select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append Group Element & Set Margins - Shift (Translate) by Left and Top Margins Using Transform
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data from the data.csv File
d3.csv("assets/data/data.csv", function(error, acsData) {
    if (error) throw error;

    // Format/Parse the Data (Cast as Numbers)
    acsData.forEach(function(data) {
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    });

    // Create Scale Functions for the Chart
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(acsData, d => d.income)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(acsData, d => d.healthcare)])
      .range([height, 0]);

    // Create Axis Functions for the Chart
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the Chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(acsData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    // Initialize Tool Tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Income: ${d.income}<br>Health Care: ${d.healthcare}`);
      });

    // Create Tooltip in the Chart
    chartGroup.call(toolTip);

    // Create Event Listeners to Display and Hide the Tooltip
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout Event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
    
    // Create Axes Labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Income");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Healthcare");
});