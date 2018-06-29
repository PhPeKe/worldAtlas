
window.onload = function() {
  var frame = document.getElementById("frame");
  var svg = d3.select(frame).append("svg").attr("class","randomsvg").attr("height",0);
  d3.selectAll(".overlay").style("width", frame.offsetWidth + 10).style("height", frame.clientHeight + 10);
  d3.selectAll("#overlay").selectAll("rect").attr("width", frame.offsetWidth + 10).attr("height", frame.clientHeight + 10);
  // Declare all necessary variables
  var size = {};
      size.margin = {top: 20, right: 50, bottom: 20, left: 50},
      size.width = frame.offsetWidth ,
      size.height = frame.clientHeight;
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
    allData.push(life_exp);
    allData.push(arms_pers);
    allData.push(arms_exp);
    allData.push(arms_imp);
    allData.push(mil_exp);
    allData.push(gdp_pc);

    var otherData = [];
    otherData.push(iso);
    otherData.push(countries);
    otherData.push(cwar_intensity);
    otherData.push(battle_death);

    // Aggregate data
    var data = aggregateData(allData);
    mapData = aggregateData(otherData);

    // Get statistics and z-scores for all entrys
    var stats = getStats(data);
    console.log(stats);
    // Draw visualizations
    drawWorld(stats, countries, mapData, selection, size, data);
    drawLinegraph(data, stats, selection, size, countries, mapData);
    drawStackedBarchart(data, stats, selection, size, countries);


    var years = [];
    var formatYear = d3.timeFormat("%Y");
    for(year in data["004"].series["life_exp"].values) years.push(new Date(year));

/*
    var info = d3.select("#info");
    info.append("p").html("<strong>Name: </strong> Phillip Kersten");
    info.append("p").html("<strong>Studentnr: </strong> 10880682");
    info.append("p").html('<strong>Source: </strong> <a target="_blank" href="http://databank.worldbank.org/data/reports.aspx?source=global-bilateral-migration">Worldbank</a>');
*/
    // Set listener for selecting data on worldmap
    selectWorld.on('click', function() {
      selection.countries = [];
      selection.countries = ["world"];
      setCurrentSize(size);
      drawLinegraph(data, stats, selection, size, countries, mapData);
      drawStackedBarchart(data, stats, selection, size, countries);
    });

    appendText(size);
    d3.selectAll("span.slider.round").style("visibility", "visible");
    // Toggle input mode for linegraph
    var btn = d3.select("span.slider.round")
                .append("text")
                .attr("id","mapButton")
                .style("left","200");
    btn.text("Test");
    inputMode.on("click", function() {
      if(selection.map == "cwar_intensity") {
        selection.map = "battle_deaths";
        d3.selectAll(".lineButton").attr("type","checkbox");
      } else {
        selection.map = "cwar_intensity";
      }
      drawWorld(stats, countries, mapData, selection, size, data);
    });

    // Remove info-page when clicked
    d3.selectAll("#x").on("click", function() {
      d3.selectAll("div#overlay").remove();
    });

    // Redraw visualizations in appropriate size when window is resized
    window.onresize = function() {
      size.width = frame.clientWidth;
      size.height = frame.clientHeight;
      drawWorld(stats, countries, mapData, selection, size, data);
      drawLinegraph(data, stats, selection, size, countries, mapData);
      drawStackedBarchart(data, stats, selection, size, countries);
      d3.selectAll(".overlay").style("width", frame.offsetWidth + 10).style("height", frame.clientHeight + 10);
      d3.selectAll("#overlay").selectAll("rect").attr("width", frame.offsetWidth + 10).attr("height", frame.clientHeight + 10);
    }
  }
}
