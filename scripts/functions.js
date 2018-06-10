function aggregateData(world, allData) {
  gdp = allData[0];
  le = allData[1];
  iso = allData[2];


  for(i = 0; i < gdp.length; i++) {
    for(j = 0; j < iso.length; j++) {
      if(gdp[i].code == iso[j].alpha3) gdp[i].numCode = iso[j].numeric;
      if(le[i].code == iso[j].alpha3) le[i].numCode = iso[j].numeric;
    }
  }
}

function selectData(data, selection) {
  return data[selection];
}
