/*stackedBar.js

  Phillip Kersten 10880682
  Prepare and draw stacked barchart

*/
function makeStackedBarchart(size) {
  // Append svg
  d3.selectAll(".barchart").remove();
  var svg = d3.select("#barchart")
    .append("svg")
      .attr("class","barchart")
      .attr("width", size.width + size.margin.left + size.margin.right)
      .attr("height", size.height + size.margin.bottom + size.margin.top);

  return svg;
}

/*drawStackedBarchart.js

  Prepare and draw stacke barchart

*/
function drawStackedBarchart(data, stats, selection, size, countries) {

  // 9.1. Remove old elements
  d3.selectAll(".d3-tip.bartext").remove();
  d3.selectAll(".d3-tip.bartext.n").remove();
  d3.selectAll("d3-tip barText").remove();

  // 9.2. Set current size
  setCurrentSize(size);
  size.margin = {top: size.height / 20, right: size.width / 20, bottom: size.height / 20, left: size.width/20},
  size.width = ((size.width/100)*45) - size.margin.left - size.margin.right,
  size.height = ((size.height/100)*45) - size.margin.bottom - size.margin.top;

  // Prepare tooltip
  var barLabelTip = d3.tip()
              .attr('class', 'd3-tip barText')
              .offset([-10, 0])
              .html(function(d) {
                if(d in data["004"].series) return data["004"].series[d].series;
                else return "";
              });

  // 9.3. Prepare barchart get data
  var barchart = makeStackedBarchart(size);
  var barData = getBarData(data, stats, selection);
  var g = barchart.append("g").attr("class", "barchart").attr("transform", "translate(" + size.margin.left + "," + size.margin.top + ")");

  // Get all series in a list
  var series = []
  for(seriesName in stats) {
    series.push(seriesName);
  }

  // Prepare x,y axis
  var y = d3.scaleLinear()
      .rangeRound([size.height, 0])
  		.nice();
  var x = d3.scaleBand()
      .rangeRound([0, size.width])
      .paddingInner(0.05)
      .align(0.1);

  // Set color scheme
  var z = d3.scaleOrdinal()
      .range(["#1f78b4","#33a02c","#e31a1c","#ff7f00","#6a3d9a",
              "#a6cee3","#b2df8a","#fb9a99","#fdbf6f","#cab2d6"]);

  // Initialie stack
  var stack = d3.stack()
      .offset(d3.stackOffsetExpand);

  // 9.4. Set domain
  x.domain(barData.map(function(d) {return d.series}));
  z.domain(selection.countries);

  // Aggregate bardata
  barData.sort(function(a, b) { return b[series[0]] / b.total - a[series[0]] / a.total; });

  // Append dataseries
  var series = g.selectAll("series")
    .data(stack.keys(selection.countries)(barData))
    .enter().append("g")
    .attr("class","barchart")
    .attr("fill", function(d) { return z(d.key);});

  // 9.5. Append rect Append rect for each country per series
  series.selectAll("rect")
    .data(function(d) { return d;})
    .enter().append("rect")
      .attr("class", "barchart")
      .attr("selected", function(d) {
        if(d.data.series == selection.series) return "true";
        else return "false";
      })
      .attr("id", function(d) { return d.data.series; })
      .attr("x", function(d) { return x(d.data.series); })
      .attr("y", function(d) {
        // Handle NaN
        if(!(isNaN(y(d[1])))) return y(d[1]);
        else {
          return 0;
        }
      })
      .attr("height", function(d) {
        // Handle NaN
        if(!(isNaN(y(d[1])))) return y(d[0]) - y(d[1]);
        else return 0;
      })
      .attr("width", x.bandwidth())
      .style("opacity", function(d) {
        if(d.data.series == selection.series) return 1;
        else return 0.8;
      })
      .on("mouseover", function(d) {
        d3.select(this).transition()
          .style("opacity", 1);
      })
      .on("mouseout", function() {
        if(d3.select(this).attr("selected") == "false")d3.select(this).transition()
          .style("opacity", 0.8);
      });

  g.append("g")
      .attr("class", "barchart")
      .attr("transform", "translate(0," + size.height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "barchart")
      .call(d3.axisLeft(y).ticks(10, "%"));

  // 9.5. Append legend
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
      .on("mouseout", function(d) { barLabelTip.hide(d); });

  // Call tooltip
  legend.call(barLabelTip);

  // Remove overlay when loading is done
  d3.selectAll("div#overlay").remove();
  var rect = d3.selectAll("#barchart svg g g rect");
  rect.on("click", function(d) {
    selection.series = d3.select(this).attr("id");

    d3.selectAll("#barchart svg g g rect")
      .attr("selected", "false").transition()
      .style("opacity", 0.8)

    d3.select(this).transition()
      .style("opacity", 1)
      .attr("selected", "true");

    // 9.6. Set size and redraw with current selection GUIDE: go back to main.js line 98
    setCurrentSize(size);
    drawWorld(stats, countries, selection, size, data);
    drawLinegraph(data, stats, selection, size, countries);
    drawStackedBarchart(data, stats, selection, size, countries);
  });
}
