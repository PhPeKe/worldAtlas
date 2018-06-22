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


  var names = ["iso","countries","gdp_pc","life_exp","arms_pers","arms_exp","arms_imp","mil_exp"];

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
        data[country.id].series = {};
      }
      data[country.id].series[series] = { "values" : {}};

      dataset.forEach(function(entry) {
        if(entry.numCode == country.id) {
          data[country.id].series[series]["series"] = entry.series;
          data[country.id].name = entry.name;

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

              if(entry[key] == "..") data[country.id].series[series]["values"][key] = NaN;
              else data[country.id].series[series]["values"][key] = +entry[key].replace(",",".");

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


function getDomain(data, selection) {
  // Workaround for the domainlist
  var domainList = [];
  for(key in data) {
    if (isNaN(data[key].series[selection.series].values[selection.year]) == false)domainList.push(data[key].series[selection.series].values[selection.year]);
  };

  var domain = d3.extent(domainList, function(d){return d; });//return d[selection.series][selection.year]});
  return domain;
}

function getStats(data) {
  var stats = {};
  var n = 0;

  for(series in data["004"].series) {
    // Initialize all statistics
    stats[series] = {};
    stats[series].mean = 0;
    stats[series].sd = 0;
    stats[series].total = 0;
    stats[series].n = 0;
    stats[series].min = Infinity;
    stats[series].max = 0;
    stats[series].var = 0;
    stats[series].sd = 0;
    stats[series].meanByYear = {};
    stats[series].varByYear = {};
  }


  // Get total per series
  for(country in data) {
    for(series in data[country].series) {

      // Also get mean per country
      data[country].series[series].total = 0;
      data[country].series[series].n = 0;

      // Calculate total per series and per country per series
      // Also set minimum and maximum
      for(year in data[country].series[series].values) {
        if(!(isNaN(data[country].series[series].values[year]))) {

          // Per series
          stats[series].n+=1;
          stats[series].total += data[country].series[series].values[year];

          // Per country per series
          data[country].series[series].n += 1;
          data[country].series[series].total += data[country].series[series].values[year];

          // Get minimum and maximum
          if(data[country].series[series].values[year] > stats[series].max) stats[series].max = data[country].series[series].values[year];
          if(data[country].series[series].values[year] < stats[series].min) stats[series].min = data[country].series[series].values[year];
        }
      }

      // Get mean per country per series
      data[country].series[series].mean = data[country].series[series].total/data[country].series[series].n;
    }
  }

  // Calculate mean per series
  for(series in data["004"].series) {
    stats[series].mean = stats[series].total / stats[series].n;

    // Reset counter
    stats[series].n = 0;
  }

  // Get variance and standart deviation per series
  for(country in data) {
    for(series in data[country].series) {
      n = 0;
      for(year in data[country].series[series].values) {
        var deviation = Math.abs(data[country].series[series].values[year] - stats[series].mean)
        if(!(isNaN(deviation))) {
          stats[series].var += deviation;
          // Get total variation
          if(!(data[country].series[series].var)) data[country].series[series].var = 0;
          data[country].series[series].var += deviation;
          n += 1;
          stats[series].n += 1;
        }
      }
      // Calculate variance and standart deviation per country per series
      data[country].series[series].var /= n;
      data[country].series[series].sd = Math.sqrt(data[country].series[series].var);
    }
  }

  // Calculate var and SD per series
  for(series in data["004"].series) {
    stats[series].var /= stats[series].n;
    stats[series].sd = Math.sqrt(stats[series].var);
  }

  // Get total per series per year
  n = {};
  for(country in data) {
    for(series in data[country].series) {
      for(year in data[country].series[series].values) {
        if(!(isNaN(data[country].series[series].values[year]))) {

          // Initialize counter variables
          if(!(n[series])) n[series] = {};
          if(!(n[series][year])) n[series][year] = 0;

          // Initialize meanByYear
          if(!(stats[series].meanByYear[year])) stats[series].meanByYear[year] = 0;
          n[series][year] += 1
          stats[series].meanByYear[year] += data[country].series[series].values[year];
        }
      }
    }
  }

  // Get mean per series per year
  for(series in stats) {
    for(year in stats[series].meanByYear) {
      stats[series].meanByYear[year] /= n[series][year];
    }
  }

  // Get total deviation per series per year
  n = {};
  for(country in data) {
    for(series in data[country].series) {
      for(year in data[country].series[series].values) {
        if(!(isNaN(data[country].series[series].values[year]))) {
          if(!(n[series])) n[series] = {};
          if(!(n[series][year])) n[series][year] = 0;
          if(!(stats[series].varByYear[year])) stats[series].varByYear[year] = 0;
          n[series][year] += 1
          stats[series].varByYear[year] += Math.abs(data[country].series[series].values[year] - stats[series].meanByYear[year]);
        }
      }
    }
  }

  // Get variance per series per year
  for(series in stats) {
    for(year in stats[series].varByYear) {
      stats[series].varByYear[year] /= n[series][year];
    }
  }


  // Get z-scores per country per series (z = (x – mean) / var)
  // Get z-scores per series (z = (x – μ) / σ)
  // What is a zascore? - http://www.statisticshowto.com/probability-and-statistics/z-score/
  for(country in data) {
    for(series in data[country].series) {
      for(year in data[country].series[series].values) {
        if(!(data[country].series[series].z)) {
          data[country].series[series].z = (data[country].series[series].mean - stats[series].mean)/stats[series].var;
        }
        if(!(data[country].series[series].zscores)) {
          data[country].series[series].zscores = {};
        }
        data[country].series[series].zscores[year] = (data[country].series[series].values[year] - stats[series].meanByYear[year])/stats[series].varByYear[year];
      }
    }
  }

  // Get z-scores for mean values
  for(series in stats) {
    var total = 0;
    var n = 0;
    for(year in stats[series].meanByYear) {
      if(!(stats[series].meanByYearZ)) stats[series].meanByYearZ = {};
      stats[series].meanByYearZ[year] = (stats[series].meanByYear[year] - stats[series].mean)/stats[series].var;
      total += stats[series].meanByYearZ[year];
      n += 1;
    }
    stats[series].meanZ = total/n;
  }

  return stats;
}

function update() {
  log("HI","HI");
}

function getLineData(data, stats, selection) {
  var lineData = {};

  console.log("data");
  console.log(data);
  console.log("stats");
  console.log(stats);

  // If nothing is selected the average of the whole world is given back
  if(selection.countries == "world") {
    lineData["world"] = [];
    for(key in stats[selection.series].meanByYear) {
      var object = {};
      object.year = +key;
      object.iso = "000";
      if(isNaN(stats[selection.series].meanByYearZ[key])) object.value = undefined;
      else object.value = stats[selection.series].meanByYearZ[key];
      object.seriesName = data["004"].series[selection.series].series;
      object.name = "world";
      lineData["world"].push(object);
    }
    return lineData;
  }

  var lineData = {};

  // If selection is made selected data is returned
  selection.countries.forEach(function(selectedCountry) {
    var otherObject = {};
    otherObject[selectedCountry] = [];
    for(year in data[selectedCountry].series[selection.series].zscores) {
      var object = {};
      object.year = +year;
      object.iso = selectedCountry;
      if(isNaN(data[selectedCountry].series[selection.series].zscores[year])) object.value = undefined;
      else object.value = data[selectedCountry].series[selection.series].zscores[year];
      object.seriesName = data[selectedCountry].series[selection.series].series;
      object.name = data[selectedCountry].name;
      otherObject[selectedCountry].push(object);
    }
    lineData[selectedCountry] = otherObject[selectedCountry];
  });
  return lineData;
}


function getMarimekkoData (data, stats, selection) {
  marimekkoData = [];

  if(selection.countries == ["world"]) {
    for(series in stats) {
      var name = world;
      var series = series;
      var seriesName = data["004"].series[series].series;
      var value = HIER
    }
  }

  for(country in selection.countries) {
    var name = data[country];
    for(series in data[country].series) {
      var seriesName = data[country].series[series].series;
      var series = series;

    }
  }
}
