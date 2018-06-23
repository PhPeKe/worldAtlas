function makeMarimekko(size) {
  var svg = d3.select("div.marimekko").append("svg")
      .attr("width", size.width)
      .attr("height", size.height)
    .append("g")
      .attr("transform", "translate(" + 2 * size.margin.left + "," + size.margin.top + ")");
}


function drawMarimekko (data, stats, selection, size) {
  var x = d3.scale.linear()
      .range([0, width - 3 * margin]);

  var y = d3.scale.linear()
      .range([0, height - 2 * margin]);

  var z = d3.scale.category10();

  var n = d3.format(",d"),
      p = d3.format("%")

  var marimekkoData = getMarimekkoData(data, stats, selection);
}
