function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var sampleURL = `/metadata/${sample}`;
  
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(sampleURL).then(function(sample){    
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_md = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_md.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      var row = sample_md.append("p");
      row.text(`${key}: ${value}`);

    });
    // BONUS: Build the Gauge Chart
    //buildGauge(data.WFREQ);    
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var plotsURL = `/samples/${sample}`;
  d3.json(plotsURL).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    console.log(data.otu_ids);
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        color: data.otu_ids,
        size: data.sample_values
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: "Bubble Plot",
      xaxis: { title: "OTU ID"},
      // Updated height and width to fit screen for most samples
      height: 600,
      width: 1500
    };
    
    Plotly.newPlot('bubble', data, layout);
  });
  
  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  console.log(sample);
  d3.json(plotsURL).then(function(data) {  
    // Sort the data in descending order first before slicing
    // Sort descending using arrow Function
    data.sample_values.sort((first, second) => second - first);

    var pieValues = data.sample_values.slice(0,10);
    var pieLabels = data.otu_ids.slice(0,10);
    var pieHover = data.otu_labels.slice(0,10);
  
    // Grab values from the data json object to build the plots
    var trace1 = {
      values: pieValues,
      labels: pieLabels,
      hovertext: pieHover,
      hoverinfo: 'hovertext',
      type: 'pie'
    };

    var data = [trace1];
  
    var layout = {
      title: `Pie Chart`,
    };
    //var PIE = document.getElementById('pie');
    Plotly.newPlot("pie", data, layout);
  });  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();