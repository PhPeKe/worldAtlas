function appendText(size) {

  var text = d3.tsv("data/text.txt", function(data) {
    var text = data.columns[0];

    d3.select("div#text")
      .style("border","1px solid black")
      .style("overflow","auto")
      .html(text);
  });
}
