     function draw(data) {

          "use strict";
          var margin = 75,
              width = 600 - margin,
              height = 600 - margin;

          var radius = 10;
          var num_per_row = 30;

          var surv_color = "blue";
          var dead_color = "red";
          d3.select("body")
            .append("h2")
            .attr('class','visualization-title')
            .text("Would you have survived on the Titanic? ");

          var demographics = d3.select("body")
                               .append('div')
                               .attr('class','demographics');

          var gender = demographics.append('div').attr('class','gender').text("Gender: All")
          var age = demographics.append('div').attr('class','age').text("Age: All")
          var sibsp = demographics.append('div').attr('class','sibsp').text("Sibling/Spouse: All")

          var selectors = d3.select("body").append('div').attr('class','selectors')

          selectors.append('span').text("Gender: ")
          var gender_select = selectors.append('select').attr('class','genderselect')
          gender_select.append('option').attr('value','all').text('All')
          gender_select.append('option').attr('value','male').text('Male')
          gender_select.append('option').attr('value','female').text('Female')

          selectors.append('span').text("Age: ")
          var age_select = selectors.append('select').attr('class','ageselect')
          age_select.append('option').attr('value','all').text('All')
          age_select.append('option').attr('value','kid').text('Under 18')
          age_select.append('option').attr('value','young').text('18-30')
          age_select.append('option').attr('value','mid').text('30-45')
          age_select.append('option').attr('value','old').text('45-60')
          age_select.append('option').attr('value','oldest').text('Over 60')

          selectors.append('span').text("Sibling or Spouse: ")
          var sibsp_select = selectors.append('select').attr('class','sibspselect')
          sibsp_select.append('option').attr('value','all').text('All')
          sibsp_select.append('option').attr('value','true').text('True')
          sibsp_select.append('option').attr('value','false').text('False')

          var circle_svg = d3.select("body")
            .append("svg")
              .attr("width", width + margin)
              .attr("height", height + margin)
              .attr('class','circlesvg')
            .append('g')
                .attr('class','chart');

          var bar_svg = d3.select("body")
            .append("svg")
              .attr("width", width/5 + margin)
              .attr("height", height + margin)
              .attr('class','barsvg')
            .append('g')
              .attr('class','chart')

          d3.select("body")
            .append('div')
            .attr('class','survival_rate')
            .text('What was your chance of survival?')

          d3.select("body")
            .append('div')
            .attr('class','survival_rate')
            .text('Let\'s find out!')

          d3.select(".circlesvg")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle");

        


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
            }).on("mouseover", function(d) {

              //Get this bar's x/y values, then augment for the tooltip
              var xPosition = parseFloat(d3.select(this).attr("cx")) + radius/2;
              var yPosition = 220 + parseFloat(d3.select(this).attr("cy")) + radius/2;

              if (d['Survived'] == 1) {
                var survived_string = "Survived";
              } else {
                var survived_string = "Died";
              }

              if (d['Survived'] == 1) {
                var survived_class = "passenger_survived_survived";
                var survived_nonclass = "passenger_survived_dead";
              } else {
                var survived_class = "passenger_survived_dead";
                var survived_nonclass = "passenger_survived_survived";
              }

              if (d['Sex'] == 'male') {
                var gender_string = "Male";
              } else {
                var gender_string = "Female";
              }              

              //Update the tooltip position and value
              d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px");
              d3.select("#tooltip")
                .select("#passenger_id")
                .text(d['PassengerId']);
              d3.select("#tooltip")
                .select("#passenger_survived")
                .text(survived_string)
                .classed(survived_class,true)
                .classed(survived_nonclass,false);
              d3.select("#tooltip")
                .select("#passenger_gender")
                .text(gender_string);
              d3.select("#tooltip")
                .select("#passenger_age")
                .text(d['Age']);
              d3.select("#tooltip")
                .select("#passenger_sibsp")
                .text(d['SibSp']);

              //Show the tooltip
              d3.select("#tooltip").classed("hidden", false);

            })
            .on("mouseout", function() {

              //Hide the tooltip
              d3.select("#tooltip").classed("hidden", true);

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

          gender.text("Updated Gender");
          age.text("Updated Age");
          sibsp.text("Updated SibSP");




        };
