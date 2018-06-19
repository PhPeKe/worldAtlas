function appendWorld(map, countries, path, tip, data, color, selectedSeries,selectedYear, selectedCountries) {
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
          }
          if(!(selectedCountries[0])) selectedCountries = "world";
          drawLinegraph(selectedCountries);
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
            .attr("width", width)
            .attr("height", height)
          .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  return linegraph;
}

function drawLinegraph(selectedCountries) {
  log(selectedCountries, "Drawing Linegraph with");
}
