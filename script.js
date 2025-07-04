$(document).ready(function() {
var TITLE = 'Weekly Time Allocation';

  // `false` for vertical column chart, `true` for horizontal bar chart
  var HORIZONTAL = false;

	// `false` for individual bars, `true` for stacked bars
  var STACKED = false;  
  
  // Which column defines 'bucket' names?
  var LABELS = 'district';  

  // For each column representing a data series, define its name and color
  var SERIES = [  
    {
      column: 'nonlearner',
      name: 'Non-Learners',
      color: 'grey'
    },
    {
      column: 'learner',
      name: 'Learners',
      color: 'blue'
    }
  ];

  // x-axis label and label in tooltip
  var X_AXIS = 'Activities';

  // y-axis label, label in tooltip
  var Y_AXIS = 'Hours per Week';

  // `true` to show the grid, `false` to hide
  var SHOW_GRID = true; 

  // `true` to show the legend, `false` to hide
  var SHOW_LEGEND = true; 

  // Read data file with random string generated by current time
  // to bypass browser cache, and create chart
  $.get('./data.csv', {'_': $.now()}, function(csvString) {

    var rows = Papa.parse(csvString, {header: true}).data;

    var datasets = SERIES.map(function(el) {
      return {
        label: el.name,
        labelDirty: el.column,
        backgroundColor: el.color,
        data: []
      }
    });

    rows.map(function(row) {
      datasets.map(function(d) {
        d.data.push(row[d.labelDirty])
      })
    });

		var barChartData = {
      labels: rows.map(function(el) { return el[LABELS] }),
			datasets: datasets
    };

    var ctx = document.getElementById('container').getContext('2d');

    new Chart(ctx, {
      type: HORIZONTAL ? 'horizontalBar' : 'bar',
      data: barChartData,
      
      options: {
        title: {
          display: true,
          text: TITLE,
          fontSize: 14,
        },
        legend: {
          display: SHOW_LEGEND,
        },
        scales: {
          xAxes: [{
            stacked: STACKED,
            scaleLabel: {
              display: X_AXIS !== '',
              labelString: X_AXIS
            },
            gridLines: {
              display: SHOW_GRID,
            },
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                return value.toLocaleString();
              }
            }
          }],
          yAxes: [{
            stacked: STACKED,
            beginAtZero: true,
            scaleLabel: {
              display: Y_AXIS !== '',
              labelString: Y_AXIS
            },
            gridLines: {
              display: SHOW_GRID,
            },
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                return value.toLocaleString()
              }
            }
          }]
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            label: function(tooltipItem, all) {
              return all.datasets[tooltipItem.datasetIndex].label
                + ': ' + tooltipItem.yLabel.toLocaleString();
            }
          }
        }
      }
    });

  });

});
