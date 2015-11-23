//This is our function to draw the D3 graphic.
function draw(data_points,data_paths){

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
                            return d.NumPassengers;
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
          .orient("left")
          .tickValues([0,25,50,75,100]);

  //For all but the first axis, we only show the 0 and 
  //100 tick marks to reduce chart junk
  var vert_c_axis = d3.svg.axis()
          .scale(vert_scale)
          .orient("left")
          .tickValues([]);                       

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
    var line_array = [data_path.SurvRate_1,data_path.SurvRate_2,data_path.SurvRate_3,data_path.SurvRate_4];

    //We identify the two highlighted paths - for maximal and 
    //minimal survival rates. We first set the default values.
    var color = 'grey';
    var opacity = 0.25;

    //We now select the paths.
    if (data_path.Gender=='female' && data_path.Age == 'older'){
      color = 'blue';
      opacity = 1;
    } else if (data_path.Gender=='male' && data_path.Age == 'older' && data_path.SibSp == 'hassibsp'){
      color = 'red';
      opacity = 1;
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

  //We now add all the circles for the data points. We use
  //enter as we have not got any data pre-loaded.
  d3.select("svg")
    .selectAll("circle")
    .data(data_points)
    .enter()
    .append("circle")
    .attr('class','nofilter');

  //For each circle we now set the position, size, fill,
  //classes, mouseover behaviour etc 
  d3.selectAll("circle")
    .attr("cx", function(d) {
        var axis = margin-3;
        if (d.Gender != 'all') {
          axis += 300; //If it has Gender then not first column
        }
        if (d.Age != 'all') {
          axis += 300; //If it has Age then not second column
        }
        if (d.SibSp != 'all') {
          axis += 300; //If it has SibSp then not third column
        }
        return axis;
    })
    .attr("cy", function(d) {
      //We convert the survival rate to the vertical scale (0-100%)
      return vert_scale(d.SurvRate);
    })
    .attr("r", function(d) {
      //We convert the NumPassengers to the radius circle (recall this
      //is a squareroot scale)
      return circ_rad_scale(d.NumPassengers);
    })
    .style("fill", function(d){
      //We set the fill according to if it is a highlighted path or not
      if (d.Gender == 'all'){
        //We choose purple because it is red+blue :)
        return 'purple';
      } else if (d.Gender == 'female' && (d.Age == 'all' || d.Age  ==  'older')){
        //This logic is ugly - but it defines if the circle is in the
        //female-older highlighted path.
        return 'blue';
      } else if(d.Gender == 'male' && (d.Age == 'all' || (d.Age  ==  'older' && (d.SibSp == 'all' || d.SibSp == 'hassibsp')))) {
        //This logic is even uglier! It selects circles in the male-
        //older-hassibsp highlighted path.
        return 'red';
      } else {
        //Everything else we set to just be grey.
        return 'grey';
      }
    })
    .style("stroke",'black') //Border all circles
    .on("mouseover", function(d) {
      //We introduce interaction through mouseover tooltips and highlights.

      //The highlight changes the color of the circle
      d3.select(this).classed('highlight',true);

      //Get the circle's coordinates, to position the tooltip appropriately
      var xPosition = parseFloat(d3.select(this).attr("cx")) + circ_rad_scale(d3.select(this).attr("NumPassengers"))/2;
      var yPosition = 40+parseFloat(d3.select(this).attr("cy")) + circ_rad_scale(d3.select(this).attr("NumPassengers"))/2;

      //The following are used to decide what text to show in the tooltip
      var gender_dict = {'male':'Male','female':'Female','all':'Both'};
      var age_dict = {'all':'All Ages','child':'0-18','young':'18-30', 'middle': '30-45', 'old': '45-60', 'older': '60+'};          
      var sibsp_dict = {'hassibsp':'1+','nosibsp':'0','all':'All'};

      //Update the tooltip position
      d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px");
      //Update all the text on the tooltip according to the data.
      d3.select("#tooltip")
        .select("#tooltip_percentage")
        .text(d.SurvRate + '% survived (' + d.NumPassengers + ' passengers)');
      d3.select("#tooltip")
        .select("#tooltip_gender")
        .text(gender_dict[d.Gender]);
      d3.select("#tooltip")
        .select("#tooltip_age")
        .text(age_dict[d.Age]);
      d3.select("#tooltip")
        .select("#tooltip_sibsp")
        .text(sibsp_dict[d.SibSp]);

      //Make sure to show the tooltip!
      d3.select("#tooltip").classed("hidden", false);

    })
    .on("mouseout", function() {
      //When we leave the circle we turn off the highlight.
      d3.select(this).classed('highlight',false);

      //We also hide the tooltip
      d3.select("#tooltip").classed("hidden", true);

    });

  //We add in the labels to the axes (manually).
  d3.select('svg')
    .append('text')
    .text('Survival Rate')
    .attr('x',30)
    .attr('y',560)
    .classed('axis-label',true);
  d3.select('svg')
    .append('text')
    .text('Gender')
    .attr('x',350)
    .attr('y',560)
    .classed('axis-label',true);
  d3.select('svg')
    .append('text')
    .text('Age')
    .attr('x',660)
    .attr('y',560)
    .classed('axis-label',true);
  d3.select('svg')
    .append('text')
    .text('Sibling/Spouse')
    .attr('x',920)
    .attr('y',560)
    .classed('axis-label',true);

  //We also add labels to the highlighted paths.
  d3.select('svg')
    .append('text')
    .text('Female, 60+, No Sibling/Spouse - 100%')
    .attr('x',700)
    .attr('y',65)
    .classed('best-class',true);
  d3.select('svg')
    .append('text')
    .text('Male, 60+, With Sibling/Spouse - 0%')
    .attr('x',790)
    .attr('y',385)
    .attr('transform','rotate(9)')
    .classed('worst-class',true);

};

