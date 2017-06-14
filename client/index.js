import * as d3 from 'd3';

const configObjs = {
  KN08: {
    selectorId: '#kn-08',
    globeName: 'KN-08',
    subhed: '(in development)',
    minDistance: 5500,
    maxDistance: 11500,
  },
  Taepodong2: {
    selectorId: '#taeopodong-2',
    globeName: 'Taepodong-2',
    subhed: '(operational)',
    minDistance: 4000,
    maxDistance: 15000,
  },
};

function spinDatGlobe(config) {
  const width = 300;
  const height = 330;

  // Configuration for the spinning effect
  const time = Date.now();
  const rotate = [0, 0];
  const velocity = [0.02, -0];
  const pyongyang = [125.7625, 39.0392];
  const cities = [{
    coordinates: [-1.1278, 51.5074],
    country: '',
    label: '',
    city: '',
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
  }];

  const rotationFactor = 0.5;
  let isMouseDown = false;
  let originalProjection = false;

  // set projection type and paremetes
  const projection = d3.geoOrthographic()
    .scale(120)
    .translate([(width / 2), (height / 2) + 20])
    .clipAngle(90)
    .precision(0.3);

  // create path variable, empty svg element and group container
  const path = d3.geoPath()
    .projection(projection);

  const circle = d3.geoCircle();

  function positionLabels() {
    // select all the labels and transform them
    d3.selectAll('.globe-svg .label')
      .attr('text-anchor', (d) => {
        const x = projection(d.coordinates)[0];
        if (x < (width / 2) - 20) {
          return 'end';
        } else if (x < (width / 2) + 20) {
          return 'middle';
        }
        return 'start';
      })
      .attr('transform', (d) => {
        const loc = projection(d.coordinates);
        const x = loc[0];
        const y = loc[1];
        const offset = x < width / 2 ? -5 : 5;
        return `translate(${x + offset}, ${y - 2})`;
      })
      // make the city label disappear if the city point is on the back side of the globe
      .style('display', (d) => {
        if (d3.select(`#id-${config.globeName}-${d.city}`).node() && d3.select(d3.select(`#id-${config.globeName}-${d.city}`).node()).attr('d') !== null) {
          return 'inline';
        }
        return 'none';
      });
  }

  document.querySelector(config.selectorId).innerHTML = '';

  const svg = d3.select(config.selectorId)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'globe-svg')
    .attr('id', `globe-${config.globeName}`);

  const g = svg.append('g');

  const t = d3.timer(() => {
    // get current time
    const dt = Date.now() - time;

    // get the new position from modified projection function
    projection.rotate([rotate[0] + (velocity[0] * dt), rotate[1] + (velocity[1] * dt)]);

    // // update cities position = redraw
    svg.selectAll('path.land').attr('d', path);
    svg.selectAll('path.city-labels').attr('d', r => path(circle.center(r.coordinates).radius(0.5)()));
    svg.selectAll('path.range').attr('d', r => path(circle.center(pyongyang).radius(r)()));
    positionLabels();
  });

  // draw the sphere
  g.append('path')
    .datum({
      type: 'Sphere',
    })
    .attr('class', 'sphere')
    .attr('d', path)
    .attr('fill', '#ffffff');

  g.append('text')
    .attr('x', 5)
    .attr('y', 25)
    .attr('class', 'missile-name-text')
    .text(config.globeName);

  g.append('text')
    .attr('x', 5)
    .attr('y', 42)
    .attr('class', 'subhed-text')
    .text(config.subhed);

  d3.json('http://mbostock.github.io/d3/talk/20111018/world-countries.json', (error, collection) => {
    svg.selectAll('path')
      .data(collection.features)
      .enter().append('path')
      .attr('class', 'land')
      .attr('fill', '#b2b2b2')
      .attr('id', d => d.properties.name.split(' ').join('_'));

    svg.append('g')
      .attr('class', 'missile-range')
      .selectAll('path')
      .data(d3.range(0, ((config.minDistance / 6371) * (180 / Math.PI)),
        ((config.minDistance / 6371) * (180 / Math.PI)) - 1))
      .enter()
      .append('path')
      .attr('d', r => path(circle.center(pyongyang).radius(r)()))
      .attr('class', 'range');

    svg.append('g')
      .attr('class', 'missile-range')
      .selectAll('path')
      .data(d3.range(0, ((config.maxDistance / 6371) * (180 / Math.PI)),
        ((config.maxDistance / 6371) * (180 / Math.PI)) - 1))
      .enter()
      .append('path')
      .attr('d', r => path(circle.center(pyongyang).radius(r)()))
      .attr('class', 'range');

    svg.append('g')
      .attr('class', 'point')
      .selectAll('path')
      .data(cities)
      .enter()
      .append('path')
      .attr('id', d => `id-${config.globeName}-${d.city}`)
      .attr('d', d => path(circle.center(d.coordinates).radius(1)()))
      .attr('class', 'city-labels');

    svg.selectAll('.point')
      .data(cities)
      .enter().append('text')
      .attr('class', 'label')
      .attr('y', d => d.yLocation)
      .text(d => d.label)
      .style('text-anchor', 'middle');

    svg.on('mousedown', function () {
      isMouseDown = d3.mouse(this);
      originalProjection = projection.rotate();
      t.stop();
      console.log('mousedown', this, isMouseDown, originalProjection);
    })
    .on('mouseup', function() {
      console.log('mouseup', this);
      isMouseDown = false;
      originalProjection = false;
    })
    .on('mousemove', function () {
      if (isMouseDown) {
        console.log('mousemove', this);
        const p = d3.mouse(this);
        const x = originalProjection[0] + (rotationFactor * (p[0] - isMouseDown[0]));
        const y = originalProjection[1] - (rotationFactor * (p[1] - isMouseDown[1]));
        projection.rotate([x, y]);
        positionLabels();
        d3.selectAll('.globe-svg path.land').attr('d', path);
        d3.selectAll('.globe-svg path.city-labels').attr('d', r => path(circle.center(r.coordinates).radius(0.5)()));
        d3.selectAll('.globe-svg path.range').attr('d', r => path(circle.center(pyongyang).radius(r)()));
      }
    });
  });
}

function drawCharts() {
  spinDatGlobe(configObjs.KN08);
  spinDatGlobe(configObjs.Taepodong2);
}

drawCharts();
