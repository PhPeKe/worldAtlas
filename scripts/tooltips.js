function makeTooltip(selection) {
  d3.selectAll(".d3-tip.line").remove();
  // Set tooltip
  var tip = d3.tip()
              .attr('class', 'd3-tip world')
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
}
