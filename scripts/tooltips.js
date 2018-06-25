function makeTooltip(selection) {
  // Set tooltip
  var tip = d3.tip()
              .attr('class', 'd3-tip line')
              .offset([-10, 0])
              .html(function(d){ return selection.year
                                       + "<br>"
                                       + "Name: "
                                       + data[d.id].name
                                       + "<br>"
                                       + data[d.id].series[selection.series].series
                                       + ": <br>"
                                       + Math.round(data[d.id].series[selection.series].values[selection.year]*100)/100;
                                     });
  return tip;
}


function makeLineTooltip(selection) {
  // Set tooltip
  var tip = d3.tip()
              .attr('class', 'd3-tip line')
              .offset([-10, 0])
              .style("left",450)
              .style("top",450)
              .html(function(d){
                if(d[0].iso == "000") return d[0].seriesName
                                          +  "<br>"
                                          + "in: "
                                          + d[0].name;
                return d[0].seriesName
                    + "<br>"
                    + "in: "
                    + d[0].name;
              });
  return tip;
}
