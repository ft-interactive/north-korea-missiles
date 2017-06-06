const config = {
  KN08: {
    selectorId: '#kn-08',
    globeName: 'KN-08',
    minDistance: 48,
    maxDistance: 105,
  },
  Taepodong2: {
    selectorId: '#taeopodong-2',
    globeName: 'Taeopodong-2',
    minDistance: 40,
    maxDistance: 120,
  },
};

import * as d3 from 'd3';

function spinDatGlobe(config) {

  const width = 300;
  const height = 320;


  // Configuration for the spinning effect
  const time = Date.now();
  const rotate = [0, 0];
  const velocity = [.02, -0];
  const pyongyang = [125.7625, 39.0392];
  const cities = [
      {
          coordinates: [.1, 90],
          country: 'North_pole',
          label: 'North_pole',
          city: 'North_pole',
          yLocation: -5,
        },
      {
          coordinates: [-1.1278, 51.5074],
          country: 'United_Kingdom',
          label: 'London',
          city: 'London',
          yLocation: -5,
        },
        {
          coordinates: [-74.0059, 40.7128],
          country: 'United_States_of_America',
          label: 'New York City',
          city: 'New_York_City',
          yLocation: -5,
        },
        {
          coordinates: [-122.4194, 37.7749],
          country: 'United_States_of_America',
          label: 'San Francisco',
          city: 'San_Francisco',
          yLocation: 15,
        },
         {
          coordinates: [125.7625, 39.0392],
          country: 'North_Korea',
          label: 'Pyongyang',
          city: 'Pyongyang',
          yLocation: -5,
        },
        {
          coordinates: [151.2093, -33.8688],
          country: 'Australia',
          label: 'Sydney',
          city: 'Sydney',
          yLocation: -5,
        },
        {
          coordinates: [-46.6333, -23.5505],
          country: 'Brazil',
          label: 'Sao Paolo',
          city: 'Sao_Paolo',
          yLocation: -5,
        },
  ];

  let rotationFactor = 0.5;
  let isMouseDown = false;
  let originalProjection = false;

  // set projection type and paremetes
  const projection = d3.geoOrthographic()
     .scale(120)
     .translate([(width / 2), height / 2])
     .clipAngle(90)
     .precision(0.3);

  // create path variable, empty svg element and group container
  const path = d3.geoPath()
     .projection(projection);
  const circle = d3.geoCircle();

  document.querySelector(config.selectorId).innerHTML = '';

  const svg = d3.select(config.selectorId)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const g = svg.append("g");

  const t = d3.timer(function() {

      // get current time
      var dt = Date.now() - time;

      // get the new position from modified projection function
      projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);


      // // update cities position = redraw
      svg.selectAll("path.land").attr("d", path);
      svg.selectAll('path.city-labels').attr('d', function(r,i,d) { return path(circle.center(r.coordinates).radius(.5)()); })
      svg.selectAll('path.range').attr("d", function(r) { return path(circle.center(pyongyang).radius(r)()); });
      position_labels();
     }); 

   // t();

  // draw the sphere
  g.append("path")
     .datum({ type: "Sphere" })
     .attr("class", "sphere")
     .attr("d", path)
     .attr("fill", "#ffffff");

  g.append("text")
    .attr('x',5)
    .attr('y',25)
    .attr('class','missile-name-text')
    .text(config.globeName);

  d3.json('http://mbostock.github.io/d3/talk/20111018/world-countries.json', function (error, collection) {
        svg.selectAll('path')
            .data(collection.features)
            .enter().append('path')
            .attr('class', 'land')
            .attr('fill','#b2b2b2')
            .attr('id', function(d) { return d.properties.name.split(' ').join('_'); });

  svg.append("g")
      .attr("class", "missile-range")
    .selectAll("path")
      .data(d3.range(0, config.minDistance, config.minDistance-1))
    .enter().append("path")
      .attr("d", function(r) { return path(circle.center(pyongyang).radius(r)()); })
      .attr('class', 'range');

   svg.append("g")
      .attr("class", "missile-range")
    .selectAll("path")
      .data(d3.range(0, config.maxDistance, config.maxDistance-1))
    .enter().append("path")
      .attr("d", function(r) { return path(circle.center(pyongyang).radius(r)()); })
      .attr('class', 'range');

  svg.append('g')
    .attr('class', 'point')
    .selectAll('path')
      .data(cities)
    .enter().append('path')
      .attr('id', function(d,i) {return 'id-' + config.globeName + '-' + d.city})
      .attr('d', function(d,i) { 
        return path(circle.center(d.coordinates).radius(1)()); 
      })
      .attr('class', 'city-labels')


  var label = svg.selectAll("text")
    .data(cities)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr('y', function(d) {return d.yLocation})
    .text(function(d) { return d.label })
    .style("text-anchor","middle");

       svg.on('mousedown', function () {
              isMouseDown = d3.mouse(this);
              originalProjection = projection.rotate();
              t.stop()
              })
            .on('mouseup', function () {
                isMouseDown = false;
                originalProjection = false;
              })
            .on('mousemove', function () {
                if (isMouseDown) {
                  var p = d3.mouse(this);
                  var x = originalProjection[0] + rotationFactor * (p[0] - isMouseDown[0]);
                  var y = originalProjection[1] - rotationFactor * (p[1] - isMouseDown[1]);
                  projection.rotate([x, y]);
                  position_labels();
                  svg.selectAll('path.land').attr('d', path);
                  svg.selectAll('path.city-labels').attr('d', function(r,i,d) { return path(circle.center(r.coordinates).radius(.5)()); })
                  svg.selectAll('path.range').attr('d', function(r) { return path(circle.center(pyongyang).radius(r)()); })
                }
              });

  });


  function position_labels() {

        //select all the labels and transform them
        svg.selectAll(".label")
          .attr("text-anchor",function(d) {
            var x = projection(d.coordinates)[0];
            return x < width/2-20 ? "end" :
                   x < width/2+20 ? "middle" :
                   "start"
          })
          .attr("transform", function(d) {
            const loc = projection(d.coordinates),
              x = loc[0],
              y = loc[1];
            const offset = x < width/2 ? -5 : 5;
            return "translate(" + (x+offset) + "," + (y-2) + ")"
          })
          //make the city label disappear if the city point is on the back side of the globe
          .style("display",function(d) {
            if (d3.select(`#id-${config.globeName}-${d.city}`).node() && d3.select(d3.select(`#id-${config.globeName}-${d.city}`).node()).attr('d') !== null) {
              return 'inline';  
            } else {
              return 'none';
            }
          });

          
      };


};

function drawCharts() {
  spinDatGlobe(config.KN08);
  spinDatGlobe(config.Taepodong2);

}

drawCharts();
