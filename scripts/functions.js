function aggregateData(world, allData) {
  gdp = allData[0];
  le = allData[1];
  iso = allData[2];
  countries = allData[3];

  for(i = 0; i < gdp.length; i++) {
    for(j = 0; j < iso.length; j++) {
      // Append numeric country codes to data
      if(gdp[i].code == iso[j].alpha3) gdp[i].numCode = iso[j].numeric;
      if(le[i].code == iso[j].alpha3) le[i].numCode = iso[j].numeric;
    }
  }
  countries.forEach(function(d) {
    le.forEach(function(c) {
      if(d.id == c.numCode) {
        d["values"] = c;
      }
    });
  });

  console.log(countries);

}

function selectData(data, selection) {
  console.log(data[selection]);
  return data[selection];
}

function color(data) {

}
