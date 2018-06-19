window.onload = function() {

/*
    Prepare all variables
*/

  // Declare all necessary variables
  var margin = {top: -20, right: 0, bottom: 20, left: 50},
      width = 960,
      height = 600,
      format = d3.format(","),
      path = d3.geoPath(),
      selectedYear = "2010",
      selectedSeries = "life_exp";
      selectedCountries = ["004","840"];

  var tip = makeTooltip(selectedSeries, selectedYear);

  var world = prepareWorld(width, height, tip);

  var map = world[0],
      path = world[1];

  var linegraph = makeLinegraph(width, height, margin);

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
    if (error) {
      alert("Data failed to load");
      throw(error);
    }

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

    // Aggregate data
    var data = aggregateData(allData);

    var years = [];
    for (key in data["004"].series[selectedSeries].values) {
      years.push(new Date (key));
    }

    // Get statistics and z-scores for all entrys
    var stats = getStats(data);

    log(stats, "Stats: ");
    log(data, "data: ");

    var domain = getDomain(data, selectedSeries, selectedYear);

    // Set function that is returning color appropriate to value
    color = d3.scaleLinear()
      .domain(domain)
      .range(['#ff0000','#00ff00']);

    appendWorld(map, countries, path, tip, data, color, selectedSeries, selectedYear, selectedCountries);

    //Prepare x,y-scale and line
    var x = d3.scaleTime()
      .rangeRound([0, width]);
    var y = d3.scaleLinear()
      .rangeRound([height , 0]);
    var line = d3.line()
        .x(function(years) { return x(d);})
        .y(function(d) { return y(d);});

    //Set domains
    x.domain(d3.extent(years, function(d) {return d.year}));
    y.domain(domain);

    //Append x,y-axis
    linegraph.append("g")
        .attr("class","linegraph")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    linegraph.append("g").transition()
        .attr("class","linegraph")
        .call(d3.axisLeft(y));

    var lineData = getLineData(data, stats, selectedYear, selectedSeries, selectedCountries);
    log(lineData, "Linedata: ");
  }
}
