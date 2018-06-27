function makeStackedBarchart(size) {

  d3.selectAll(".barchart").remove();
  var svg = d3.select("#barchart").append("svg")
      .attr("class","barchart")
      .attr("width", size.width + size.margin.left + size.margin.right)
      .attr("height", size.height + size.margin.bottom + size.margin.top);
    //.append("g")
    //  .attr("transform", "translate(" + size.margin.left + "," + size.margin.top + ")");
  return svg;
}


function drawStackedBarchart(data, stats, selection, size) {

  setCurrentSize(size);
  size.margin = {top: 0, right: size.width / 10, bottom: size.height / 20, left: size.width/10},
  size.width = (size.width/100)*35 - size.margin.left - size.margin.right,
  size.height = (size.height/100)*40 - size.margin.bottom - size.margin.top;

  var barLabelTip = d3.tip()
              .attr('class', 'd3-tip barText')
              .offset([-10, 0])
              .html(function(d) {
                if(d in data["004"].series) return data["004"].series[d].series;
                else return d;
              });

  var barchart = makeStackedBarchart(size);
  var barData = getBarData(data, stats, selection);
  var g = barchart.append("g").attr("transform", "translate(" + size.margin.left + "," + size.margin.top + ")");

  var series = []

  for(seriesName in stats) {
    series.push(seriesName);
  }

  var y = d3.scaleLinear()
      .rangeRound([size.height, 0])
  		.nice();

  var x = d3.scaleBand()
      .rangeRound([0, size.width])
      .paddingInner(0.05)
      .align(0.1);

  var z = d3.scaleOrdinal()
      .range(["#1f78b4","#33a02c","#e31a1c","#ff7f00","#6a3d9a",
                        "#a6cee3","#b2df8a","#fb9a99","#fdbf6f","#cab2d6"]);

  var stack = d3.stack()
      .offset(d3.stackOffsetExpand);

  x.domain(barData.map(function(d) {return d.series}));
  z.domain(selection.countries);
  barData.sort(function(a, b) { return b[series[0]] / b.total - a[series[0]] / a.total; });

  var series = g.selectAll("series")
    .data(stack.keys(selection.countries)(barData))
    .enter().append("g")
    .attr("class","series")
    .attr("fill", function(d) { return z(d.key);});

  series.selectAll("rect")
    .data(function(d) { return d;})
    .enter().append("rect")
      .attr("id", function(d) { return d.data.series; })
      .attr("x", function(d) { return x(d.data.series); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + size.height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"));

  var legend = series.append("g")
      .attr("class", "legend")
      .attr("transform", function(d) {
        var d = d[d.length - 1];
        return "translate(" + (x(d.data.series)
                            + x.bandwidth())
                            + ","
                            + ((y(d[0])
                            + y(d[1])) / 2)
                            + ")";
                          });

  legend.append("line")
      .attr("x1", -6)
      .attr("x2", 6)
      .attr("stroke", "#000");

  legend.append("text")
      .attr("x", 9)
      .attr("class","barText")
      .attr("dy", "0.35em")
      .attr("fill", "#000")
      .style("font", "10px sans-serif")
      .text(function(d) { if(d.key == "world") {return "world";} else { return data[d.key].name;}});

  d3.selectAll("#barchart svg g g g text")
      .on("mouseover", function(d) { barLabelTip.show(d); })
      .on("mouseout", function(d) {barLabelTip.hide(d); });

  setCurrentSize(size);
  legend.call(barLabelTip);
}
