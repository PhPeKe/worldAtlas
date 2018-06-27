
window.onload = function() {
  var frame = document.getElementById("frame");
  var svg = d3.select(frame).append("svg");
  console.log(frame.offsetWidth, frame.clientHeight);
  // Declare all necessary variables
  var size = {};
      size.margin = {top: 20, right: 50, bottom: 20, left: 50},
      size.width = frame.offsetWidth ,
      size.height = frame.clientHeight;
  var selection = {};
      selection.year = "2010";
      selection.series = "life_exp";
      selection.countries = ["world"];
      selection.mode = "countries";
  var format = d3.format(",");
  var selectWorld = d3.select("svg g rect");
  var input = d3.selectAll("input.lineButton");
  var inputMode = d3.selectAll("input.mode");
  var parseTime = d3.timeParse("%Y");
  var tip = makeTooltip(selection);
  var lineTip = makeLineTooltip(selection);



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

    drawWorld(stats, countries, tip, data, selection, size);
    drawLinegraph(data, stats, selection, size);
    drawStackedBarchart(data, stats, selection, size);

    var years = [];
    var formatYear = d3.timeFormat("%Y");
    for(year in data["004"].series["life_exp"].values) years.push(new Date(year));

    var slider = d3.sliderHorizontal()
      .min(years[0]) //Magic number to prevent that domain[0] is reached at the end of the scale
      .max(years[years.length-1])
      .step(1000 * 60 * 60 * 24 * 365)
      .width(450)
      .default(new Date(selection.year))
      .tickFormat(d3.timeFormat("%Y"))
      .on('onchange', function(d) {
        console.log(formatYear(d));
        selection.year = formatYear(d);
        drawWorld(stats, countries, tip, data, selection, size);
      });

    var g = d3.select("div#slider").append("svg")
      .attr("width", 500)
      .attr("height", 100)
      .append("g")
      .attr("transform", "translate(30,30)");

    g.call(slider);

    window.onresize = function() {
      size.width = frame.clientWidth;
      size.height = frame.clientHeight;
      drawWorld(stats, countries, tip, data, selection, size);
      drawLinegraph(data, stats, selection, size);
      drawStackedBarchart(data, stats, selection, size);

      console.log(frame.offsetWidth, frame.clientHeight);
    }


    // Set listener for selectig the world
    selectWorld.on('click', function() {
      selection.countries = [];
      selection.countries = ["world"];
      drawLinegraph(data, stats, selection, size);
      drawStackedBarchart(data, stats, selection, size);
    });

    input.on("click", function() {
      selection.series = d3.select(this).attr("id");
      drawWorld(stats, countries, tip, data, selection, size);
      drawLinegraph(data, stats, selection, size);
    });

    inputMode.on("click", function() {
      if(selection.mode == "countries") {
        selection.mode = "series";
        d3.selectAll(".lineButton").attr("type","checkbox");
      } else {
        selection.mode = "countries";
        d3.selectAll(".lineButton").attr("type","radio");
      }
      console.log(selection.mode);
    });
  }
}
