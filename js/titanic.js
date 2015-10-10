     function draw(data) {

          "use strict";
          var margin = 75,
              width = 1400 - margin,
              height = 600 - margin;

          var radius = 10;
          var num_per_row = 30;

          var surv_color = "blue";
          var dead_color = "red";
          d3.select("body")
            .append("h2")
            .text("Would you have survived on the Titanic? ")

          var svg = d3.select("body")
            .append("svg")
              .attr("width", width + margin)
              .attr("height", height + margin)
            .append('g')
                .attr('class','chart');

          d3.select("body")
            .append('div')
            .attr('class','survival_rate')
            .text('What was your chance of survival?')

          d3.select("body")
            .append('div')
            .attr('class','survival_rate')
            .text('Let\'s find out!')

          d3.select("svg")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle");

          

          // Create x-axis scale mapping dates -> pixels
          var x_scale = d3.time.scale()
            .range([margin, width])
            .domain([0,400]);

          


          d3.selectAll("circle")
            .attr("cx", function(d,i) {
                return 10 + 20 * (i % num_per_row);
            })
            .attr("cy", function(d,i) {
                return 10 + 20 * Math.floor(i / num_per_row);
            })
            .attr("r", radius)
            .attr("class", function(d){
              if (d['Survived'] == 1) {
                return 'survived';
              } else if (d['Survived'] == 0) {
                return 'dead';
              }
            });


          var surv_data = d3.nest()
                            .key(function(d) {
                              return d['Survived'];
                            })
                            .rollup(function(leaves){
                              return leaves.length;
                            })
                            .entries(data);
          d3.selectAll('.survival_rate')
            .data(surv_data)
            .text(function(d){
              if (d['key'] == '0') {
                return d['values'] + " passengers died.";
              } else {
                return d['values'] + " passengers survived.";
              }
            });
        };
