
  var format = d3.format(",");

  // Set tooltip
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d){
                //Add tooltip text here
              });

  //Declare all variables
  var margin = {top: 20, right: 150, bottom: 30, left: 70},
    width = 960,
    height = 550,
    files = ["data/1960.json","data/1970.json","data/1980.json",
                    "data/1990.json","data/2000.json"],
    path = d3.geoPath(),
    colors = ["#3d9f36","#816633","#d91d2f","#0d1a28"],

    //10 Different color categories from colorbrewer for the line
    linecolors = ["#1f78b4","#33a02c","#e31a1c","#ff7f00","#6a3d9a",
                      "#a6cee3","#b2df8a","#fb9a99","#fdbf6f","#cab2d6"],
    data = [],
    selection = "60",
    selection_data = "pop",
    domain = [],
    selectedCountries = [],
    mapLabels = ["High","Medium","Low","NA"],
    sliderState = 0,
    countries = [],
    parseTime = d3.timeParse("%Y");

  //Set handler for appending map
  var svg = d3.select("div.map")
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

  d3.select(".title").append("h1")
      .html("Bilateral Migration and population across the globe <br>-<br> 1960-2000");

  svg.append("rect")
        .attr("class","background")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#4492ec");

  var x = d3.scaleTime()
    .rangeRound([0, width]);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  var size = 30;

  //Prepare Worldmap
  var projection = d3.geoPatterson()//.geoMercator()
                     .scale(150)
                    .translate( [width / 2, height / 1.5]);

  var path = d3.geoPath().projection(projection);
  svg.call(tip);

  function draw(){
    d3.selectAll(".mapLabels").moveToFront();
    var color = d3.scaleLinear()
         .domain(domain)
         .range(['#ff0000','#00ff00']);
    svg.selectAll(".countries").remove();
    svg.append("g")
        .attr("class", "countries")
      .selectAll("path")
        .data(countries)
      .enter().append("path")
        .attr("d", path)
        .attr("selected","false")
        .attr("class","country")
        .attr("id", function(d) { return d.name; })
        .attr("iso", function(d) { return d.id; })
        .style("fill", function(d) { return color(selectData(d)); })
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity",0.8)
        // tooltips
          .style("stroke","white")
          .style('stroke-width', 0.3)
          .on("mouseover",function(d) {
            tip.show(d);

    d3.select(this)
          .style("opacity", 1)
          .style("stroke","black")
          .style("stroke-width",1);
      })
      .on("mouseout", function(d) {
        tip.hide(d);

        d3.select(this)
          .style("opacity", 0.8)
          .style("stroke","white")
          .style("stroke-width",0.3);
      })
      .on("click", function(d) {
        // Makes a list of countries selected, deselecting by clicking
        // on the same country again
        //If condition to not draw the graph when a country without data is selected
        if (d3.select(this).attr("id")) {
        var thisCode = d3.select(this).attr("iso");
        console.log(d3.select(this))
        //If country is not present in list append, else splice
        if (!selectedCountries.includes(thisCode)) {
          selectedCountries.push(thisCode);
        } else {
            var index = selectedCountries.indexOf(thisCode);
            selectedCountries.splice(index,1);
        }
        d3.selectAll(".mapLabels").moveToFront();
        d3.selectAll(".linegraphdata").remove();
        updateLinegraph(countries);
      }
      });


      svg.append("path")
          .datum(topojson.mesh(countries, function(a, b) { return a.id !== b.id; }))
           // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
          .attr("class", "names")
          .attr("d", path);
  }
