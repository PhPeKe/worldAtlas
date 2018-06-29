/*main.js
  Phillip Kersten 10880682
  Main control-flow for the project
*/
window.onload = function() {

  // Append overlay to get absolute size of the window
  var frame = document.getElementById("frame");
  var svg = d3.select(frame).append("svg").attr("class","randomsvg").attr("height",0);
  d3.selectAll(".overlay").style("width", frame.offsetWidth + 10).style("height", frame.clientHeight + 10);
  d3.selectAll("#overlay").selectAll("rect").attr("width", frame.offsetWidth + 10).attr("height", frame.clientHeight + 10);

  // 1. Declare all necessary variables
  var size = {};
      size.margin = {top: 20, right: 50, bottom: 20, left: 50},
      size.width = frame.offsetWidth ,
      size.height = frame.clientHeight;
  // 2. Set standart-selection
  var selection = {};
      selection.year = "1960";
      selection.series = "gdp_pc";
      selection.lineSeries = ["gdp_pc","life_exp","mil_exp"];
      selection.countries = ["world"];
      selection.map = "cwar_intensity";
      selection.linegraph = "series"
  var format = d3.format(",");
  var selectWorld = d3.select("svg g rect");
  var input = d3.selectAll("input.lineButton");
  var inputMode = d3.selectAll("input.mode");
  var parseTime = d3.timeParse("%Y");
  var tip = makeTooltip(selection);
  var years = [];
  var formatYear = d3.timeFormat("%Y");



  // 3. Load in data
  queue()
    .defer(d3.json, "data/world.json")
    .defer(d3.json, "data/iso.json")
    .defer(d3.csv, "data/gdp_pc.csv")
    .defer(d3.csv, "data/life_ex.csv")
    .defer(d3.csv, "data/mil_exp.csv")
    .defer(d3.csv, "data/arms_exp.csv")
    .defer(d3.csv, "data/arms_imp.csv")
    .defer(d3.csv, "data/arms_pers.csv")
    .defer(d3.csv, "data/cwar_intensity.csv")
    .defer(d3.csv, "data/battle_death.csv")
    .await(ready);


  // Wait until data is loaded and then proceed with drawing the map and other
  // objects
  function ready(error, world, iso, gdp_pc, life_exp, mil_exp, arms_exp, arms_imp, arms_pers, cwar_intensity, battle_death) {
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
    allData.push(arms_pers);
    allData.push(arms_exp);
    allData.push(arms_imp);
    allData.push(mil_exp);
    allData.push(gdp_pc);
    allData.push(cwar_intensity);
    allData.push(battle_death);
    allData.push(life_exp);

    // 4. Aggregate data GUIDE: go to data.js line 1
    var data = aggregateData(allData);

    // 5. Get statistics and z-scores for all entrys GUIDE: go to data.js line
    var stats = getStats(data);

    // 6. Draw visualizations GUIDE: go to worldmap.js line 38
    drawWorld(stats, countries, selection, size, data);
    // 8. Draw Linegraph GUIDE: go to linegraph.js line 21
    drawLinegraph(data, stats, selection, size, countries);
    // 9. DrawBarchart
    drawStackedBarchart(data, stats, selection, size, countries);
    // Append text when everything is ready
    appendText(size);
    d3.select("div#valuesLine").style('visibility', 'visible');
    d3.selectAll("h1").style('visibility', 'visible');

    // Set listener for selecting data on worldmap
    selectWorld.on('click', function() {
      selection.countries = [];
      selection.countries = ["world"];
      setCurrentSize(size);
      drawLinegraph(data, stats, selection, size, countries);
      drawStackedBarchart(data, stats, selection, size, countries);
    });

    // Remove info-page when clicked
    d3.selectAll("#x").on("click", function() {
      d3.selectAll("div#overlay").remove();
    });

    // Redraw visualizations in appropriate size when window is resized
    window.onresize = function() {
      size.width = frame.clientWidth;
      size.height = frame.clientHeight;
      drawWorld(stats, countries, selection, size, data);
      drawLinegraph(data, stats, selection, size, countries);
      drawStackedBarchart(data, stats, selection, size, countries);
      d3.selectAll(".overlay").style("width", frame.offsetWidth + 10).style("height", frame.clientHeight + 10);
      d3.selectAll("#overlay").selectAll("rect").attr("width", frame.offsetWidth + 10).attr("height", frame.clientHeight + 10);
    }
  }
}
