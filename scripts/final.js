window.onload = function() {

/*
    Prepare all variables
*/

  // Declare all necessary variables
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      selection = 2010,
      format = d3.format(","),
      path = d3.geoPath();

  // Set tooltip
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d){ return "HI";});

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
                        map.attr("transform", d3.event.transform);
                      }));

  // Set projection for map
  var projection = d3.geoMercator()
                     .scale(130)
                     .translate( [width / 2, height / 1.5]);

  // Set path for map
  var path = d3.geoPath().projection(projection);

  map.call(tip);

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
    .defer(d3.json, "data/iso.json")
    .defer(d3.csv, "data/gdp_pc.csv")
    .defer(d3.csv, "data/life_ex.csv")
    .defer(d3.csv, "data/mil_exp.csv")
    .defer(d3.csv, "data/arms_exp.csv")
    .defer(d3.csv, "data/arms_imp.csv")
    .defer(d3.csv, "data/arms_pers.csv")
    .await(ready);

  // Wait until data is loaded and then proceed with drawing the map and other
  // objects
  function ready(error, world, iso, gdp_pc, life_exp, mil_exp, arms_exp, arms_imp, arms_pers) {

    log(error,"error");
    log(world,"world");

    // Make countries readable for worldmap
    var countries = topojson.feature(world, world.objects.countries).features;

    // Save all data in list to pass it to aggregateData
    allData = [];
    allData.push(iso);
    allData.push(countries);
    allData.push(gdp_pc);
    allData.push(life_exp);
    allData.push(arms_pers);
    allData.push(arms_exp);
    allData.push(arms_imp);
    allData.push(mil_exp);

    data = aggregateData(allData);

    log(data, "Aggregated data");

    var domain = d3.extent(data, function(d){ log (d,"d"); return d.gdp_pc.values["2010"];});

    log(domain,"domain: ");

    // Set function that is returning color appropriate to value
    var color = d3.scaleLinear()
      .domain(domain)
      .range(['#ff0000','#00ff00']);


    selectData(data["056"]["gdp_pc"]["values"], selection)

    // Append countries to world-map svg
    map.append("g")
        .attr("class", "countries")
      .selectAll("path")
        .data(countries)
      .enter().append("path")
        .attr("d", path)
        .attr("selected","false")
        .attr("class","country")
        .style("fill", function(d) { return color(data[d.id]["gdp_pc"]["values"]["2010"]); })
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
