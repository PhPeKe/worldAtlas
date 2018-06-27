function prepareWorld(size, tip) {


  // Prepare map
  var map = d3.select("div.map")
  .append("svg")
    .attr("class", "mapsvg")
    .attr("width", size.width)
    .attr("height", size.height)
  .append('g')
    .attr('class', 'map')
  .call(d3.zoom()
    .scaleExtent([1,Infinity])
    .translateExtent([[0,0],[size.width, size.height]])
    .extent([[0,0],[size.width, size.height]])
    .on("zoom",  function () {
      map.attr("transform", d3.event.transform);
  }));


  map.call(tip);

  return map;
}


function drawWorld(stats, countries, tip, data, selection, size) {
  d3.selectAll(".countries").remove();
  d3.selectAll(".path").remove();
  d3.selectAll(".mapsvg").remove();
  var temp = size;
  var size = {};
      size.margin = {top: 0, right: 0, bottom: 0, left: 0},
      size.width = temp.width / 2,
      size.height = temp.height/10*6;
  var projection = d3.geoMercator()
  .translate( [size.width / 2, size.height / 1.5]);
  var path = d3.geoPath().projection(projection);
  var domain = getDomain(data, selection);
  var map = prepareWorld(size, tip);
  // Set function that is returning color appropriate to value
  var color = d3.scaleLinear()
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
        if(selection.countries == "world") selection.countries = [];

// Later: Change borders when selected
// tooltips
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
          size = temp;
          drawLinegraph(data, stats, selection, size);
          drawStackedBarchart(data, stats, selection, size);
        }})
        .style("fill", function(d) { return color(data[d.id].series[selection.series].values[selection.year]); })
        .style('stroke', 'white')
        .style('stroke-width', 0.3)
        .style("opacity",0.8);

  map.append("path")
      .datum(topojson.mesh(countries, function(a, b) { return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path)
}
