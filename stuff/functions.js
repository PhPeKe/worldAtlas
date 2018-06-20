function aggregateData(allData) {

  var iso = allData[0];
  var countries = allData[1];
  var gdp = allData[2];
  var le = allData[3];
  var arms_pers = allData[4];
  var arms_exp = allData[5];
  var arms_imp = allData[6];
  var mil_exp = allData[7];
  data = {};

  var datas = [gdp,le, mil_exp, arms_exp,arms_imp, arms_pers];

  var names = ["iso","countries","gdp_pc","life_exp","arms_pers","arms_exp","arms_imp","mil_exp"];
  log(allData,"Alldata spliced before");

  //Prepare data by giving the appropriate numeric iso-codes
  allData.slice(2).forEach(function(dataset) {
    dataset.forEach(function(entry) {
      iso.forEach(function(i) {
        if(entry.code == i.alpha3) entry.numCode = i.numeric;
      });
    });
  });

  // Iterate through all data and append the relevant information to datastructure
  allData.slice(2).forEach(function(dataset) { //datas oder allData
    var series = (" " + dataset[0]["series_code"]).slice(1);

    countries.forEach(function(country) {
      if(!(country.id in data)) {
        data[country.id] = {};
      }
      data[country.id][series] = { "values" : []};

      dataset.forEach(function(entry) {
        if(entry.numCode == country.id) {
          data[country.id][series]["series"] = entry.series;
          data[country.id]["name"] = entry.name;

          for(var key in entry) {
            if(key[0] == "1" || key[0] =="2") {
              // Save values in list
              /*
              var obj = {};
              obj["year"] = key;
              if(entry[key] == "..") obj["value"] = NaN;
              else {
                obj["value"] = +entry[key].replace(",",".");
              }
              data[country.id][series]["values"].push(obj);
              */
              // Save values in object

              if(entry[key] == "..") data[country.id][series]["values"][key] = NaN;
              else data[country.id][series]["values"][key] = +entry[key].replace(",",".");

            }
          }
        }
      });
    });
  });
  // Return aggregated data
  return data;
}


function log(object, message) {
  console.log(message);
  console.log(object);
}


function getDomain(data, selectedSeries, selectedYear) {
  // Workaround for the domainlist
  var domainList = [];
  for(key in data) {
    if (isNaN(data[key][selectedSeries]["values"][selectedYear]) == false)domainList.push(data[key][selectedSeries]["values"][selectedYear]);
  };

  var domain = d3.extent(domainList, function(d){return d; });//return d[selectedSeries][selectedYear]});
  return domain;
}


function prepareWorld(width, height, tip) {

    // Prepare map
    var map = d3.select("div.map")
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
                          map.attr("transform", d3.event.transform);
                        }));

    // Set projection for map
    var projection = d3.geoMercator()
                       .scale(130)
                       .translate( [width / 2, height / 1.5]);

    // Set path for map
    var path = d3.geoPath().projection(projection);

    map.call(tip);

    return [map,path];
}


function makeTooltip(selectedSeries, selectedYear) {
  // Set tooltip
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d){ return "Name: "
                                       + data[d.id].name
                                       + "<br>"
                                       + data[d.id][selectedSeries].series
                                       + ": <br>"
                                       + data[d.id][selectedSeries].values[selectedYear];
                                     });
  return tip;
}


function makeLinegraph(width, height, margin) {
  //Prepare Linegraph
  var linegraph = d3.select("div.linegraph")
          .append("svg")
            .attr("width", width)
            .attr("height", height)
          .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  return linegraph;
}


function getStats(data) {
  var stats = {};
  var n = 0;

  for(country in data) {
    stats[country] = {};

    for(series in data[country]) {
      stats[country][series] = {};
      stats[country][series].total = 0;
      n = 0;

      // Calculate mean
      for(year in data[country][series].values) {
        if(data[country][series].values[year] != NaN) {
          var entry = data[country][series].values[year];
          n+=1;
          stats[country][series].total += entry;
        }
      }
      stats[country][series].mean = stats[country][series].total/n;
      log(stats[country][series].mean, "mean: ");
      n = 0;
      var variance = 0;

      // Calculate variance
      for(year in data[country][series].values) {
        if(data[country][series].values[year] != NaN) {
          var entry = data[country][series].values[year];
          var mean = stats[country][series].mean;
          n+=1;
          variance += Math.abs(entry - mean);
        }
      }
      variance = variance/(n-1);

      // Calculate standart deviation
      stats[country][series].sd = Math.sqrt(variance);

      // Calculate z-score and append it to data object
      data[country][series].z = {};
      for(year in data[country][series].values) {
        if(data[country][series].values[year] != NaN) {
          var entry = data[country][series].values[year];
          var mean = stats[country][series].mean;
          var sd = stats[country][series].sd;

          data[country][series].z[year] = (entry - mean)/sd;

        }
      }
    }
  }

  return stats;
}
