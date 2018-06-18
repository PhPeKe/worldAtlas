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
