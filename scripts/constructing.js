function drawWorld(map, stats, countries, path, tip, data, selectedSeries,selectedYear, selectedCountries) {
  var margin = {top: 20, right: 0, bottom: 20, left: 50},
      width = 960,
      height = 600;

  d3.selectAll(".countries").remove();

  var domain = getDomain(data, selectedSeries, selectedYear);

  // Set function that is returning color appropriate to value
  color = d3.scaleLinear()
    .domain(domain)
    .range(['#ff0000','#00ff00']);

  // Append countries to world-map svg
  map.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(countries)
    .enter().append("path")
      .attr("d", path)
      .attr("selected","false")
      .attr("class","country")
      .attr("id", function(d) { return d.id; })
      .style("fill", function(d) { return color(data[d.id].series[selectedSeries].values[selectedYear]); })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        })
        .on("click", function(d) {
          if(selectedCountries == "world") selectedCountries = [];
          if(d3.select(this).attr("id")) {
          var thisCode = d3.select(this).attr("id");
          //If country is not present in list append, else splice
          if(!selectedCountries.includes(thisCode)) {
            selectedCountries.push(thisCode);
          } else {
              var index = selectedCountries.indexOf(thisCode);
              selectedCountries.splice(index,1);
            }
            if(selectedCountries.length == 0) selectedCountries = ["world"];
            drawLinegraph(data, stats, selectedCountries, selectedSeries, width, height, margin);
          }

        });

  map.append("path")
      .datum(topojson.mesh(countries, function(a, b) { return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path)
}


function prepareWorld(width, height, tip) {

    // Prepare map
    var map = d3.select("div.map")
                .append("svg")
                  .attr("width", width)
                  .attr("height", height)
                .append('g')
                  .attr('class', 'map')
                .call(d3.zoom()
                      .scaleExtent([1,Infinity])
                      .translateExtent([[0,0],[width,height]])
                      .extent([[0,0],[width,height]])
                      .on("zoom",  function () {
                          map.attr("transform", d3.event.transform);
                        }));

    // Set projection for map
    var projection = d3.geoMercator()
                       .scale(130)
                       .translate( [width / 2, height / 1.5]);

    // Set path for map
    var path = d3.geoPath().projection(projection);

    map.call(tip);

    return [map,path];
}


function makeTooltip(selectedSeries, selectedYear) {
  // Set tooltip
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d){ return selectedYear
                                       + "<br>"
                                       + "Name: "
                                       + data[d.id].name
                                       + "<br>"
                                       + data[d.id].series[selectedSeries].series
                                       + ": <br>"
                                       + Math.round(data[d.id].series[selectedSeries].values[selectedYear]*100)/100;
                                     });
  return tip;
}


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

function drawLinegraph(data, stats, selectedCountries, selectedSeries, width, height, margin) {

  // Remove old elements before drawing
  d3.selectAll(".graph").remove();
  d3.selectAll(".path").remove();
  d3.selectAll(".axis").remove();

  var linegraph = makeLinegraph(width, height, margin);
  var linecolors = ["#1f78b4","#33a02c","#e31a1c","#ff7f00","#6a3d9a",
                    "#a6cee3","#b2df8a","#fb9a99","#fdbf6f","#cab2d6"];

  // Get data for drawing linegraph
  var lineData = getLineData(data, stats, selectedSeries, selectedCountries);

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
  console.log(lineData);

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
          console.log("Hi");
        });

    first = false;
    i+=1;
  }


}
