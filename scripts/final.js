window.onload = function() {

  // Declare all necessary variables
  var margin = {top: 20, right: 0, bottom: 20, left: 50},
      width = 960,
      height = 600,
      format = d3.format(","),
      path = d3.geoPath(),
      selection = {};
      selection.year = "2010",
      selection.series = "life_exp",
      selection.countries = ["world"],
      selectWorld = d3.select("svg g rect"),
      input = d3.selectAll("input"),
      parseTime = d3.timeParse("%Y"),
      tip = makeTooltip(selection),
      world = prepareWorld(width, height, tip),
      map = world[0],
      path = world[1];

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
    var allData = [];
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
    for (key in data["004"].series[selection.series].values) {
      years.push(new Date (key));
    }

    // Get statistics and z-scores for all entrys
    var stats = getStats(data);

    drawWorld(map, stats, countries, path, tip, data, selection);
    drawLinegraph(data, stats, selection, width, height, margin);
    // Set listener for selectig the world
    selectWorld.on('click', function() {
      selection.countries = [];
      selection.countries = ["world"];
      drawLinegraph(data, stats, selection, width, height, margin);
    });

    input.on("click", function() {
      selection.series = d3.select(this).attr("id");
      drawWorld(map, stats, countries, path, tip, data, selection);
      drawLinegraph(data, stats, selection, width, height, margin);
    });
  }
}
