/*linegraph.js
  Phillip Kersten
  Crosshair adapted from: https://bl.ocks.org/alandunning/cfb7dcd7951826b9eacd54f0647f48d3
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

  setCurrentSize(size);
  size.margin = {top: size.height / 20, right: size.width / 20, bottom: size.height / 20, left: size.width/20},
  size.width = ((size.width/ 100) * 45) - size.margin.left - size.margin.right,
  size.height = ((size.height/100)* 45) - size.margin.bottom - size.margin.top;

  d3.selectAll("div.d3-tip.line").remove();
  d3.selectAll("div.d3-tip.line.n").remove();
  var lineTip = d3.tip()
                .attr('class', 'd3-tip line')
                .offset([0, 0])
                .html(function(d){
                  return d[0].seriesName
                        +"<br>"
                        +"in: "
                        +d[0].name;
                      });


  // Remove old elements before drawing
  d3.selectAll(".graph").remove();
  d3.selectAll(".path").remove();
  d3.selectAll(".axis").remove();

  var linecolors = ["#1f78b4","#33a02c","#e31a1c","#ff7f00","#6a3d9a",
                    "#a6cee3","#b2df8a","#fb9a99","#fdbf6f","#cab2d6"];

  let temp = makeLinegraph(size);
  var linegraph = temp[1];
  var svg = temp[0];
  var bisectDate = d3.bisector(function(d) { return d.year; }).left;
  // Get data for drawing linegraph
  var lineData = getLineData(data, stats, selection);
  console.log(lineData);
  //Prepare x,y-scale and line
  var x = d3.scaleTime()
    .rangeRound([0, size.width]);
  var y = d3.scaleLinear()
    .rangeRound([size.height , 0]);
  var line = d3.line().curve(d3.curveLinear) //https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529
    .defined(function(d) { return d.value; })
    .x(function(d) { return x(d.year);})
    .y(function(d) { return y(d.value);});

  domainList = [];

  d3.select(".lineList").remove();
  var list = d3.select("body").append("ul").attr("class","lineList");
  console.log(selection.countries);
  var entries = [];
  for(country in selection.countries) {
    if(selection.countries[country] == "world") {
      entries.push("world");
    } else {
      entries.push(data[selection.countries[country]].name);
    }
  }


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


    console.log(list);


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
  var focus = [];

  for(entry in lineData) {
    var b = lineData[entry];
    //Append path i times
    linegraph.append("path")
      .datum(b)
        .attr("class","linepath")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")))
        //.attr("id", i)
        .attr("fill", "none")
        .attr("id", function(d) { return d.iso;})
        .style("cursor","pointer")
        .attr("stroke", linecolors[i])
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 4)
        .attr("d", line)
        .on("click", function(d) {
          lineTip.hide(d);
          if(selection.countries == "world") {
            return;
          }
          // Splice list
          selection.countries.splice(selection.countries.indexOf(d[0].iso),1);
          if(selection.countries.length == 0) selection.countries = ["world"];
          setCurrentSize(size);
          drawLinegraph(data, stats, selection, size, countries, mapData);
          drawStackedBarchart(data, stats, selection, size, countries);
        })
        .on("mouseover", function(d) {
          let xPos = d3.mouse(this)[0];
          let yPos = d3.mouse(this)[1];
// ToDo: Tooltip just works with one line
          xPos = xPos - 480;
          lineTip.offset([yPos - 15, xPos]);
          lineTip.show(d);
        })
        .on("mouseout",  function(d) {
          lineTip.hide(d);
        })
        .on("mousemove", function(d) {
        });
        linegraph.append("text")
          .attr("class","linegraph")
          .attr("id", "linegraph" + String(i))
          .attr("y", function(b) { return 0; })
          .attr("x", x(b[b.length - 1].year)+5)
          .attr("text-anchor", "start")
          .attr("dy", ".7em").append("a")
          .style("fill", linecolors[i])
          .attr("target","_blank")
          //Append link to wikipedia page of country
          .attr("href", "http://en.wikipedia.org/wiki/"+b.name)
          .html(b.name)
          .attr("class","linelabels");

        var thisFocus = linegraph.append("g")
        .attr("class", "focus")
        .attr("id",i)
        .style("display", "none");

        thisFocus.append("circle")
          .attr("r", 7.5);

        thisFocus.append("text")
          .attr("x", 15)
          .attr("dy", ".31em");

        focus.push(thisFocus);
        linegraph.call(lineTip);
//!!!!!!!!!!!!!!!! Compare worldwide on linechart and countrywise with stacked barchart
    first = false;
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
  console.log(lineData);
  function mousemove() {
    var list = [];
    var count = 0;
    for(country in lineData) {
      var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(lineData[country], x0, 1),
      d0 = lineData[country][i - 1],
      d1 = lineData[country][i],
      d = x0 - d0.year > d1.year - x0 ? d1 : d0;
      if(!(isNaN(y(d.value)))) {
        focus[count].style("display",null);
        focus[count].attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
        focus[count].select("text").text(function() { return d.name + ": " + Math.round(d.value*100)/100; });
        focus[count].select("text").style("color", function(count) { return linecolors[count]; });
      } else {
        focus[count].style("display","none");
      }
      selection.year = d.year;
      d3.select("#yearDisplay").html("Year: " + d.year);
      drawWorld(stats, countries, mapData, selection, size, data)
      count += 1;
    }
  }
}
