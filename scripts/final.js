window.onload = function() {

/*
    Prepare all variables
*/

  // Declare all necessary variables
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      selection = 1960,
      format = d3.format(","),
      path = d3.geoPath();

  // Set function that is returning color appropriate to value
  var color = d3.scaleThreshold()
    .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
    .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

  // Set tooltip
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d){});

/*
    Prepare world-map
*/

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
                        svg.attr("transform", d3.event.transform);
                      }));

  // Set projection for map
  var projection = d3.geoMercator()
                     .scale(130)
                     .translate( [width / 2, height / 1.5]);

  // Set path for map
  var path = d3.geoPath().projection(projection);

  //Prepare Linegraph
  var linegraph = d3.select("div.linegraph")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Load in data
  queue()
    .defer(d3.json, "data/world.json")
    .defer(d3.csv, "data/gdp_pc.csv")
    .defer(d3.csv, "data/life_expectancy.csv")
    .defer(d3.json, "data/iso.json")
    .await(ready);

  // Wait until data is loaded and then proceed with drawing the map and other
  // objects
  function ready(error, data, gdp_pc, life_expectancy, iso) {
    console.log(data)
    console.log(gdp_pc);
    console.log(life_expectancy);

    // Make countries readable for worldmap
    countries = topojson.feature(data, data.objects.countries).features;

    // Save all data in list to pass it to aggregateData
    allData = [];
    allData.push(gdp_pc);
    allData.push(life_expectancy);
    allData.push(iso);
    allData.push(countries);

    aggregateData(data, allData);

    selectData(life_expectancy[0], selection)

    // Append countries to world-map svg
    map.append("g")
        .attr("class", "countries")
      .selectAll("path")
        .data(countries)
      .enter().append("path")
        .attr("d", path)
        .attr("selected","false")
        .attr("class","country")
        //.style("fill", function(d) { return color(populationById[d.id]); })
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
          });

    map.append("path")
        .datum(topojson.mesh(countries, function(a, b) { return a.id !== b.id; }))
         // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
        .attr("class", "names")
        .attr("d", path);
  }
}
