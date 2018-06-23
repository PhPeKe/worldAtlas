function makeLinegraph(width, height, margin) {
  //Prepare Linegraph
  var linegraph = d3.select("div.linegraph")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "graph")
          .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  return linegraph;
}


function drawLinegraph(data, stats, selection, width, height, margin) {

  // Remove old elements before drawing
  d3.selectAll(".graph").remove();
  d3.selectAll(".path").remove();
  d3.selectAll(".axis").remove();

  var linegraph = makeLinegraph(width, height, margin);
  var linecolors = ["#1f78b4","#33a02c","#e31a1c","#ff7f00","#6a3d9a",
                    "#a6cee3","#b2df8a","#fb9a99","#fdbf6f","#cab2d6"];

  // Get data for drawing linegraph
  var lineData = getLineData(data, stats, selection);

  //Prepare x,y-scale and line
  var x = d3.scaleTime()
    .rangeRound([0, width]);
  var y = d3.scaleLinear()
    .rangeRound([height , 0]);
  var line = d3.line()
    .defined(function(d) { return d.value; })
    .x(function(d) { return x(d.year);})
    .y(function(d) { return y(d.value);});

  domainList = [];
  for(entry in lineData) {
    lineData[entry].forEach(function(d) {
      domainList.push(d);
    });
  }

  //Set domains
  x.domain(d3.extent(domainList, function(d) {return d.year}));
  y.domain(d3.extent(domainList, function(d) {return d.value}));

  var first = true;
  var i = 0;

  for(entry in lineData) {
    var b = lineData[entry];

    //Append x&y-axis
    if(first) linegraph.append("g")
        .attr("class","axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    if(first) linegraph.append("g").transition()
        .attr("class","axis")
        .call(d3.axisLeft(y));

    //Append path i times
    linegraph.append("path")
        .datum(b)
        .attr("class","path")
        //.attr("id", i)
        .attr("fill", "none")
        .style("cursor","pointer")
        .attr("stroke", linecolors[i])
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 6)
        .attr("d", line)
        .on("click", function(d) {
          if(selection.countries == "world") {
            return;
          }
          // Splice list
          selection.countries.splice(selection.countries.indexOf(d[0].iso),1);
          if(selection.countries.length == 0) selection.countries = ["world"];
          drawLinegraph(data, stats, selection, width, height, margin);
        })
        .on("dblclick", function(d) {
          console.log("One Click");
          //ToDo: Add country to marimekko chart
        });
//!!!!!!!!!!!!!!!! Compare worldwide on linechart and countrywise with marimekko chart
    first = false;
    i+=1;
  }
}
