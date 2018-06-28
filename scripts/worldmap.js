function prepareWorld(size, tip) {

  // Prepare map
  var map = d3.select("div.map")
  .append("svg")
  .attr("width", size.width + size.margin.left + size.margin.right)
  .attr("height", size.height + size.margin.bottom + size.margin.top)
  .append('g')
    .attr('class', 'map')
    //.attr("transform", "translate(" + (size.margin.left ) + "," + size.margin.top + ")")
  .call(d3.zoom()
    .scaleExtent([1,Infinity])
    .translateExtent([[0,0],[size.width, size.height]])
    .extent([[0,0],[size.width, size.height]])
  .on("zoom",  function () {
    map.attr("transform", d3.event.transform);
  }));
  console.log(size.height/size.width);

  // Set projection for map
  var projection = d3.geoMercator()
    .scale(90)//((size.width - size.margin.left - size.margin.right)/size.height)*50)
    .translate( [size.width / 1.7, size.height / 1.3]);

  // Set path for map
  var path = d3.geoPath().projection(projection);
  map.call(tip);
  return [map,path];
}


function drawWorld(stats, countries, data, selection, size) {

  d3.selectAll("div.map svg").remove();

  var domain = getDomain(data, selection);
  // Set function that is returning color appropriate to value
  var color = d3.scaleLinear()
    .domain(domain)
    .range(['#00ff00','#0000ff']);

  setCurrentSize(size);
  size.margin = {top: size.height / 20, right: size.width / 15, bottom: size.height / 20, left: size.width/20},
  size.width = ((size.width / 100) * 50) - size.margin.left - size.margin.right,
  size.height = ((size.height / 100) * 40) - size.margin.bottom - size.margin.top;

  var tip = makeTooltip(selection);
  var world = prepareWorld(size, tip);
  var map = world[0];
  var path = world[1];

  // Append countries to world-map svg
  var graph = map.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(countries)
    .enter().append("path")
      .attr("d", path)
      .attr("selected","false")
      .attr("class","country")
      .attr("id", function(d) { return d.id; })
      .style("fill", function(d) {
        return color(data[d.id].series[selection.series].values[selection.year]);
      })
      .style('stroke', 'white')
      .style('stroke-width', 0.3)
      .style("opacity",0.8);

      // Listeners
      graph.on('mouseover',function(d){
        tip.show(d);

        d3.select(this).transition().ease(d3.easeElastic)
          .style("opacity", 1)
          .style("stroke","white")
          .style("stroke-width",3);
      })
      .on('mouseout', function(d){
        tip.hide(d);

        d3.select(this).transition().ease(d3.easeElastic)
          .style("opacity", 0.8)
          .style("stroke","white")
          .style("stroke-width",0.3);
      })
      .on("click", function(d) {
        if(selection.countries == "world") selection.countries = [];

// Later: Change borders when selected
        if(d3.select(this).attr("selected") == "false") {
          d3.select(this).attr("selected", "true");
        }

        if(d3.select(this).attr("selected") == "true") {
          d3.select(this).attr("selected", "false");
        }

        if(d3.select(this).attr("id")) {
        var thisCode = d3.select(this).attr("id");
        //If country is not present in list append, else splice
        if(!selection.countries.includes(thisCode)) {
          selection.countries.push(thisCode);
        } else {
            var index = selection.countries.indexOf(thisCode);
            selection.countries.splice(index,1);
          }
          if(selection.countries.length == 0) selection.countries = ["world"];
          setCurrentSize(size);
          drawLinegraph(data, stats, selection, size, countries);
          drawStackedBarchart(data, stats, selection, size, countries);
        }
        });

  map.append("path")
      .datum(topojson.mesh(countries, function(a, b) { return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path)
}
