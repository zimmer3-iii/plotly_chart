function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("js/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("js/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("js/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var allSample = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = allSample.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels.slice(0,10).reverse();
    var sampleValues = result.sample_values.slice(0,10).reverse();

    // 7. Create the yticks for the bar chart.
    var yticks = otuIds.map(sampleObj => "OTU" + sampleObj).slice(0,10).reverse();


    //Part 1 - Bar Chart
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otuLabels
      
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 OTUs (Bacterial Species)"
    };
    // 10. Use Plotly to plot the data with the layout. 
    // Plotly.newPlot("bar",barData, barLayout)


    // Part 2 -Bubble charts
    var bubbleLabels = result.otu_labels;
    var bubbleValues = result.sample_values;
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: bubbleValues,
      text:bubbleLabels,
      mode:'markers',
      marker: {size:bubbleValues,
              color:otuIds,
              colorscale: 'Jet'
            }
        }
      ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "OTU Samples",
      xaxis:{title: "ID"},
      automarign: true,
      hovermode:'closet'
      
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble',bubbleData,bubbleLayout); 


    //Part 3 -Gauge Chart

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var sampleArray = metadata.filter(metaObj => metaObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeResult = sampleArray[0];
    
    // 3. Create a variable that holds the washing frequency.
   var washingFreq = gaugeResult.wfreq;
        
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washingFreq,
      type: 'indicator',
      mode: 'gauge+number',
      title: {text:"<b> Belly Button Washing Frequency</b>"},
      gauge: {
        axis:{range:[null,10], tickwidth: 1, tickcolor: "black"},
        bar:{color: "black"},
        steps:[
          {range:[0,2], color: "lightgreen"},
          {range:[2,4], color: "lightblue"},
          {range:[4,6], color: "yellow"},
          {range:[6,8], color: "orange"},
          {range:[8,10], color: "red"}
        ]
      }

     
  }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      automargin: true
         };
    // 6. Use Plotly to plot the gauge data and layout.
    // Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });   
}


    
