function makeStackedBarchart(size) {
  var svg = d3.select("div.marimekko").append("svg")
      .attr("width", size.width)
      .attr("height", size.height)
    .append("g")
      .attr("transform", "translate(" + 2 * size.margin.left + "," + size.margin.top + ")");
}


function drawStackedBarchart(data, stats, selection, size) {

  var marimekko = makeStackedBarchart(size);

  var x = d3.scaleLinear()
      .range([0, size.width - 3 * size.margin]);

  var y = d3.scaleLinear()
      .range([0, size.height - 2 * size.margin]);

  var z = d3.scaleOrdinal(d3.schemeCategory10);

  var n = d3.format(",d"),
      p = d3.format("%")

  var barData = getBarData(data, stats, selection);

  console.log(barData);
}
