
function draw(data_points,data_paths) {

  "use strict";

  //Define the size of the visualization
  //It will be horizontal 2:1
  var margin = 75,
      width = 1200 - margin,
      height = 600 - margin;

  //We select the svg from the html and set the 
  //width and height. We add a class in case we
  //want to style it later.   
  d3.select("body")
    .select("svg")
    .attr("width", width + margin)
    .attr("height", height + margin)
    .attr('class','slope_chart');

  //We need a scale for the y-scale, running from 
  //0 to 100.
  var vert_scale = d3.scale.linear()
          .range([height, margin])
          .domain([0,100]);

  //To create the radius scale we need the max passengers
  var passengers_max = d3.max(data_points, function(d) {
                            return d['NumPassengers'];
                        });

  //We define the radius scale - using the square
  //root scale to ensure we don't increase the
  //lie factor of the visualization.
  var circ_rad_scale = d3.scale.sqrt()
                         .domain([0,passengers_max])
                         .range([2,6]);

  //We define the left hand axis using the vertical
  //scale defined above.
  var vert_l_axis = d3.svg.axis()
          .scale(vert_scale)
          .orient("left");

  //For all but the first axis, we only show the 0 and 
  //100 tick marks to reduce chart junk
  var vert_c_axis = d3.svg.axis()
          .scale(vert_scale)
          .orient("left")
          .tickValues([0,100]);                       

  //Add the axes and 300px intervals
  d3.select("svg")
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin + ",0)")
    .call(vert_l_axis);

  d3.select("svg")
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (margin+300) + ",0)")
    .call(vert_c_axis);

  d3.select("svg")
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (margin+600) + ",0)")
    .call(vert_c_axis);

  d3.select("svg")
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (margin+900) + ",0)")
    .call(vert_c_axis);

  //We define a line function to use for our paths. We
  //have to map the x values according to which point
  //we're plotting, and the y values according to the
  //vertical scale.
  var lineGen = d3.svg.line()
    .x(function(d,i) {
      return margin-3 + i*300;
    })
    .y(function(d,i) {
      return vert_scale(d);
    });

  //This code isn't very 'd3-like' however it appears the
  //easiest way to plot the lines (which are from a different
  //data source). We cycle through each path.
  data_paths.forEach(function(data_path){
    //Pull out the four values to be plotted.
    var line_array = [data_path['SurvRate_1'],data_path['SurvRate_2'],data_path['SurvRate_3'],data_path['SurvRate_4']];

    //We identify the two highlighted paths - for maximal and 
    //minimal survival rates. 
    if (data_path.Gender=='female' && data_path.Age == 'older'){
      var color = 'blue';
      var opacity = 1;
    } else if (data_path.Gender=='male' && data_path.Age == 'older' && data_path.SibSp == 'hassibsp'){
      var color = 'red';
      var opacity = 1;
    } else {
      var color = 'grey';
      var opacity = 0.25;
    }

    //We now add a path for every item in data_paths.
    d3.select("svg")
      .append('svg:path')
      .attr('d', lineGen(line_array)) //Where to plot line
      .attr('stroke', color)          //Including highlighting
      .attr('opacity', opacity)       //Including highlighting
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .on('mouseover',function(){
        //We want to highlight paths on mouseover
        d3.select(this).classed('highlight-path',true);
      })
      .on('mouseout',function(){
        //Don't forget to de-highlight on mouseout!
        d3.select(this).classed('highlight-path',false);
      });
  }); //end of for loop


// CURRENT COMMENTING POINT


    d3.select("svg")
      .selectAll("circle")
      .data(data_points)
      .enter()
      .append("circle")
      .attr('class','nofilter');


    d3.selectAll("circle")
      .attr("cx", function(d) {
          var axis = margin-3;

          if (d['Gender'] != 'all') {
            axis += 300;
          }
          if (d['Age'] != 'all') {
            axis += 300;
          }
          if (d['SibSp'] != 'all') {
            axis += 300;
          }
          
          return axis;
      })
      .attr("cy", function(d) {
          return vert_scale(d["SurvRate"]);
      })
      .attr("r", function(d) {
        return circ_rad_scale(d['NumPassengers']);
      })
      .style("fill", function(d){
        if (d["Gender"]=='all'){
          return 'purple';
        } else if (d["Gender"]=='female' && (d["Age"]=='all' || d["Age"] == 'older')){
          return 'blue';
        } else if(d["Gender"]=='male' && (d["Age"]=='all' || (d["Age"] == 'older' && (d["SibSp"]=='all' || d["SibSp"]=='hassibsp')))) {
          return 'red';
        } else {
          return 'grey';
        }
      })
      .classed("male", function(d){
        if (d["Gender"] == 'male') {
          return true;
        } else {
          return false;
        }
      })
      .classed("female", function(d){
        if (d["Gender"] == 'female') {
          return true;
        } else {
          return false;
        }
      })
      .classed("hassibsp", function(d){
        if (d["SibSp"] == 'hassibsp') {
          return true;
        } else {
          return false;
        }
      })
      .classed("nosibsp", function(d){
        if (d["SibSp"] == 'nosibsp') {
          return true;
        } else {
          return false;
        }
      })
      .text(function(d){
        return d['Age'];
      }).on("mouseover", function(d) {
        d3.select(this).classed('highlight',true);

        //Get this bar's x/y values, then augment for the tooltip
        var xPosition = parseFloat(d3.select(this).attr("cx")) + circ_rad_scale(d3.select(this).attr("NumPassengers"))/2;
        var yPosition = 40+parseFloat(d3.select(this).attr("cy")) + circ_rad_scale(d3.select(this).attr("NumPassengers"))/2;

        var gender_dict = {'male':'Male','female':'Female','all':'Both'}
        var age_dict = {'all':'All Ages','child':'0-18','young':'18-30', 'middle': '30-45', 'old': '45-60', 'older': '60+'};          
        var sibsp_dict = {'hassibsp':'1+','nosibsp':'0','all':'All'}

        //Update the tooltip position and value
        d3.select("#tooltip")
          .style("left", xPosition + "px")
          .style("top", yPosition + "px");
        d3.select("#tooltip")
          .select("#tooltip_percentage")
          .text(d['SurvRate'] + '% survived of ' + d['NumPassengers'] + ' passengers');
        d3.select("#tooltip")
          .select("#tooltip_gender")
          .text(gender_dict[d['Gender']]);
        d3.select("#tooltip")
          .select("#tooltip_age")
          .text(age_dict[d['Age']]);
        d3.select("#tooltip")
          .select("#tooltip_sibsp")
          .text(sibsp_dict[d['SibSp']]);

        //Show the tooltip
        d3.select("#tooltip").classed("hidden", false);

      })
      .on("mouseout", function() {

        d3.select(this).classed('highlight',false);

        //Hide the tooltip
        d3.select("#tooltip").classed("hidden", true);

      });





// var lines = circle_svg
//   .selectAll("line")
//   .data(data_points)
//   .enter()
//   .append("line")
//   .attr("x1", function(d,i) {return 100; })
//   .attr("y1", function(d,i) {return 100; })
//   .attr("x2", function(d,i,j) {return 400; })
//   .attr("y2", function(d,i,j) {return 400; })
// ;




// var line = d3.svg.line()
//     .x(function(d) {
//           var axis = margin-3;

//           if (d['Gender'] != 'all') {
//             axis += 300;
//           }
//           if (d['Age'] != 'all') {
//             axis += 300;
//           }
//           if (d['SibSp'] != 'all') {
//             axis += 300;
//           }
          
//           return axis;
//       })
//     .y(function(d) {
//           return vert_scale(d["SurvRate"]);
//       })
//     .interpolate("linear");  

// circle_svg.append("path")
//     .attr("d", function(d) { return line(data)})
//     .attr("transform", "translate(0,0)")
//     .style("stroke-width", 2)
//             .style("stroke", "steelblue")
//             .style("fill", "none");




// end of drawing lines
    // d3.selectAll("circle")
    //   .attr("cx", function(d,i) {
    //       return 10 + 20 * (i % num_per_row);
    //   })
    //   .attr("cy", function(d,i) {
    //       return 10 + 20 * Math.floor(i / num_per_row);
    //   })
    //   .attr("r", radius)
    //   .attr("class", function(d){
    //     if (d['Survived'] == 1) {
    //       return 'survived';
    //     } else if (d['Survived'] == 0) {
    //       return 'dead';
    //     }
    //   }).on("mouseover", function(d) {

    //     d3.select(this).style('opacity',1);

    //     //Get this bar's x/y values, then augment for the tooltip
    //     var xPosition = parseFloat(d3.select(this).attr("cx")) + radius/2;
    //     var yPosition = 220 + parseFloat(d3.select(this).attr("cy")) + radius/2;

    //     if (d['Survived'] == 1) {
    //       var survived_string = "Survived";
    //     } else {
    //       var survived_string = "Died";
    //     }

    //     if (d['Survived'] == 1) {
    //       var survived_class = "passenger_survived_survived";
    //       var survived_nonclass = "passenger_survived_dead";
    //     } else {
    //       var survived_class = "passenger_survived_dead";
    //       var survived_nonclass = "passenger_survived_survived";
    //     }

    //     if (d['Sex'] == 'male') {
    //       var gender_string = "Male";
    //     } else {
    //       var gender_string = "Female";
    //     }              

    //     //Update the tooltip position and value
    //     d3.select("#tooltip")
    //       .style("left", xPosition + "px")
    //       .style("top", yPosition + "px");
    //     d3.select("#tooltip")
    //       .select("#passenger_id")
    //       .text(d['PassengerId']);
    //     d3.select("#tooltip")
    //       .select("#passenger_survived")
    //       .text(survived_string)
    //       .classed(survived_class,true)
    //       .classed(survived_nonclass,false);
    //     d3.select("#tooltip")
    //       .select("#passenger_gender")
    //       .text(gender_string);
    //     d3.select("#tooltip")
    //       .select("#passenger_age")
    //       .text(d['Age']);
    //     d3.select("#tooltip")
    //       .select("#passenger_sibsp")
    //       .text(d['SibSp']);

    //     //Show the tooltip
    //     d3.select("#tooltip").classed("hidden", false);

    //   })
    //   .on("mouseout", function() {

    //     d3.select(this).style('opacity',0.6);

    //     //Hide the tooltip
    //     d3.select("#tooltip").classed("hidden", true);

    //   });



  };

//We need a hamming-distance function to compute when
//two filtered categories are joined by a line. This is
//precisely when their hamming distance is 1.  
function hamming(a,b) {
  if (a.length != b.length) {
    return -1;
  }

  var dist = 0;

  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) {
      dist++;
    }
  }

  return dist

};
