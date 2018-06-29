/*linegraph.js
  Phillip Kersten 10880682

  makeLinegraph:
  - Prepare linegraph
*/

function makeLinegraph(size) {
  //Prepare Linegraph
  var svg = d3.select("div.linegraph")
    .append("svg")
      .attr("width", size.width + size.margin.left + size.margin.right)
      .attr("height", size.height + size.margin.top + size.margin.bottom)
      .attr("class", "graph");
  var g = svg.append('g')
      .attr("transform", "translate(" + size.margin.left + "," + size.margin.top + ")");
  return [svg,g];
}


function drawLinegraph(data, stats, selection, size, countries, mapData) {

  // 8.1. Reset and adjust size before drawing
  setCurrentSize(size);
  size.margin = {top: size.height / 50, right: size.width / 20, bottom: size.height / 20, left: size.width/20},
  size.width = ((size.width/ 100) * 45) - size.margin.left - size.margin.right,
  size.height = ((size.height/100)* 40) - size.margin.bottom - size.margin.top;

  // 8.2. Remove old elements before drawing
  d3.selectAll("div.d3-tip.line").remove();
  d3.selectAll("div.d3-tip.line.n").remove();
  d3.selectAll(".graph").remove();
  d3.selectAll(".path").remove();
  d3.selectAll(".axis").remove();

  // 8.3. Set variables
  var linecolors = ["#1b9e77","#7570b3","#e6ab02"];
  var lineText = {};
  // Linetext and suffix for static tooltip
  lineText.names = {"gdp_pc": "GDP per capita",
                    "mil_exp" : "Military expenditure",
                    "life_exp" : "Life expectancy"};
  lineText.suffix = {"gdp_pc": " US$",
                     "mil_exp" : " % of GDP",
                     "life_exp" : " years"};
  let temp = makeLinegraph(size);
  var linegraph = temp[1];
  var svg = temp[0];
  var bisectDate = d3.bisector(function(d) { return d.year; }).left;

  // 8.4. Get data for drawing linegraph
  var lineData = getLineData(data, stats, selection);

  // 8.5. Prepare x,y-scale and line
  var x = d3.scaleTime()
    .rangeRound([0, size.width]);
  var y = d3.scaleLinear()
    .rangeRound([size.height , 0]);
  var line = d3.line().curve(d3.curveLinear)
    .defined(function(d) { return d.value; })
    .x(function(d) { return x(d.year);})
    .y(function(d) { return y(d.value);});

  var domainList = [];

  // Remove old list
  d3.select(".lineList").remove();


  var entries = [];
  for(country in selection.countries) {
    if(selection.countries[country] == "world") {
      entries.push("world");
    } else {
      entries.push(data[selection.countries[country]].name);
    }
  }

  // 8.6. Append list of generated links to wikipedia
  var list = d3.selectAll("div#list")
    .style("width","0")
    .append("ul")
    .attr("class","lineList");

  list.selectAll('li')
    .data(entries)
      .enter()
    .append('li')
    .append("a")
      .attr("class", "listText")
      .attr("target","_blank")
      //Append link to wikipedia page of country
      .attr("href", function(d) {
        return "http://en.wikipedia.org/wiki/" + d;
      })
      .html(String)
      .attr("class","linelabels");

  // Make list of all data to get domain
  for(entry in lineData) {
    lineData[entry].forEach(function(d) {
      domainList.push(d);
    });
  }

  //Set domains
  x.domain(d3.extent(domainList, function(d) { return new Date(d.year); }));
  y.domain(d3.extent(domainList, function(d) { return d.value; }));

  // 8.7. Counter, draw countries
  var i = 0;
  var focus = [];
  for(entry in lineData) {
    var b = lineData[entry];
    //Append path i times
    linegraph.append("path")
      .datum(b)
        .attr("class","linepath")
        //.attr("id", i)
        .attr("fill", "none")
        .attr("id", function(d) { return d.iso;})
        .style("cursor","pointer")
        .attr("stroke", linecolors[i])
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 4)
        .attr("d", line);

        // Append focus for tooltip
        var thisFocus = linegraph.append("g")
        .attr("class", "focus")
        .attr("id",i)
        .style("display", "none");

        // Append circles
        thisFocus.append("circle")
          .attr("r", 7.5);

        thisFocus.append("text")
          .attr("x", 15)
          .attr("dy", ".31em");

        focus.push(thisFocus);
    i+=1;
  }

  //Append x&y-axis
  linegraph.append("g")
      .attr("class","axis")
      .attr("transform", "translate(0," + size.height + ")")
    .call(d3.axisBottom(x));

  linegraph.append("g").transition()
      .attr("class","axis")
    .call(d3.axisLeft(y));

  // Crosshair
  svg.append("rect")
    .attr("transform", "translate(" + size.margin.left + "," + size.margin.top + ")")
    .attr("class", "lineOverlay")
    .attr("width", size.width)
    .attr("height", size.height)
    .on("mouseover", function() {
      focus.forEach(function(d) {
        d.style("display", null); })
      })
    .on("mouseout", function() {
      focus.forEach(function(d) {
        d.style("display", "none"); })
      })
    .on("mousemove", mousemove);

  function mousemove() {
    var list = [];
    var count = 0;
    for(series in lineData) {
      var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(lineData[series], x0, 1),
      d0 = lineData[series][i - 1],
      d1 = lineData[series][i],
      d = x0 - d0.year > d1.year - x0 ? d1 : d0;
      if(!(isNaN(y(d.value)))) {
        focus[count].style("display",null);
        focus[count].attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
        focus[count].select("text").text(function() { return d.series;});
        focus[count].select("text").style("color", function(count) { return linecolors[count]; });
      } else {
        focus[count].style("display","none");
      }
      d3.select("li#"+series).html(function(){
        if(selection.countries == "world") return lineText.names[series]
                                          + " in World (" + d.year + "): "
                                          + Math.round(stats[series].meanByYear[d.year]*100)/100
                                          + lineText.suffix[series];
        else return lineText.names[series]
                  + " in "
                  + data[selection.countries[selection.countries.length-1]].name
                  + " (" + d.year + "): "
                  + Math.round(data[selection.countries[selection.countries.length-1]].series[series].values[d.year]*100)/100
                  + lineText.suffix[series];
      });
      selection.year = d.year;
      d3.select("#yearDisplay").html("Year: " + d.year);
      drawWorld(stats, countries, selection, size, data)
      count += 1;
    }
  }
}
