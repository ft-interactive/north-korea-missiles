import * as d3 from 'd3';

const globes = {
  Hwasong12: {
    selectorId: '#hwasong-12',
    globeName: 'Hwasong-12',
    subhed: '(operational)',
    // minDistance: 4500,
    maxDistance: 4500,
  },
  Hwasong14: {
    selectorId: '#hwasong-14',
    globeName: 'Hwasong-14',
    subhed: '(in development)',
    // minDistance: 8000,
    maxDistance: 10000,
  },
};


const width = 290;
const height = 330;

// set projection type and paremetes
const projection = d3.geoOrthographic()
   .scale(120)
   .translate([(width / 2), (height / 2) + 20])
   .clipAngle(90)
   .precision(0.3);

// create path variable, empty svg element and group container
const path = d3.geoPath().projection(projection);
const circle = d3.geoCircle();

// Configuration for the spinning effect
const time = Date.now();
const rotate = [0, 0];
const velocity = [0.02, -0];
const pyongyang = [125.7625, 39.0392];
const cities = [
  {
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
    label: 'São Paulo',
    city: 'Sao_Paolo',
    yLocation: -5,
  },
];

function spinDatGlobe(config) {
  document.querySelector(config.selectorId).innerHTML = '';

  const svg = d3.select(config.selectorId)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'globe-svg');

  const g = svg.append('g');

  // draw the sphere
  g.append('path')
     .datum({ type: 'Sphere' })
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

  d3.json('world-countries.json', (error, collection) => {
    svg.selectAll('path')
            .data(collection.features)
            .enter().append('path')
            .attr('class', 'land')
            .attr('fill', '#b2b2b2')
            .attr('id', d => d.properties.name.split(' ').join('_'));

    // svg.append('g')
    //   .attr('class', 'missile-range')
    // .selectAll('path')
    //   .data(d3.range(
    //     0,
    //     ((config.minDistance / 6371) * (180 / Math.PI)),
    //     ((config.minDistance / 6371) * (180 / Math.PI)) - 1,
    // ))
    // .enter()
    // .append('path')
    //   .attr('d', r => path(circle.center(pyongyang).radius(r)()))
    //   .attr('class', 'range');

    svg.append('g')
      .attr('class', 'missile-range')
    .selectAll('path')
      .data(d3.range(
        0,
        ((config.maxDistance / 6371) * (180 / Math.PI)),
        ((config.maxDistance / 6371) * (180 / Math.PI)) - 1,
      ))
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
      .attr('d', d => path(circle.center(d.coordinates).radius(1)()))
      .attr('class', d => `city-${d.city} city-labels`);


    svg.selectAll('.point')
    .data(cities)
    .enter().append('text')
    .attr('class', 'label')
    .attr('y', d => d.yLocation)
    .text(d => d.label)
    .style('text-anchor', 'middle');
  });
}

// label function inspired by Derek Watkins' faux-3d shaded globe
// http://bl.ocks.org/dwtkns/4686432
function positionLabels() {
  // select all the labels and transform them
  d3.selectAll('.label')
    .attr('text-anchor', (d) => {
      const x = projection(d.coordinates)[0];
      return x < width / 2 - 20 ? 'end' :
             x < width / 2 + 20 ? 'middle' :
             'start';
    })
    .attr('transform', (d) => {
      const loc = projection(d.coordinates);
      const x = loc[0];
      const y = loc[1];
      const offset = x < width / 2 ? -5 : 5;
      return `translate(${x + offset},${y - 2})`;
    })
    // make the city label disappear if the city point is on the back side of the globe
    .style('display', (d) => {
      if (d3.select(`.city-${d.city}`).node() && d3.select(`.city-${d.city}`).attr('d') !== null) {
        return 'inline';
      }
      return 'none';
    });
}

function drawCharts() {
  spinDatGlobe(globes.Hwasong12);
  spinDatGlobe(globes.Hwasong14);

  const t = d3.timer(() => {

    // spinning function from Patrick Stotz's spinnning globe with glowing city markers
    // http://bl.ocks.org/PatrickStotz/1f19b3e4cb848100ffd7
    // get current time
    const dt = Date.now() - time;

    // get the new position from modified projection function
    projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);

    // update cities position = redraw
    d3.selectAll('path.land').attr('d', path);
    d3.selectAll('path.city-labels').attr('d', r => path(circle.center(r.coordinates).radius(0.5)()));
    d3.selectAll('path.range').attr('d', r => path(circle.center(pyongyang).radius(r)()));
    positionLabels();
  });

  let secondT;

  const startGlobeDrag = () => {
    t.stop();
    secondT.stop();
  };

  function onGlobeDrag() {
    const { dx, dy } = d3.event;
    const [x, y] = projection.rotate();
    projection.rotate([x + dx, y - dy]);
    positionLabels();
    d3.selectAll('.rotating-globes svg path.land').attr('d', path);
    d3.selectAll('.rotating-globes svg path.city-labels').attr('d', r => path(circle.center(r.coordinates).radius(0.5)()));
    d3.selectAll('.rotating-globes svg path.range').attr('d', r => path(circle.center(pyongyang).radius(r)()));
  }

  function startSpinningAgain() {
    secondT = d3.timer(() => {
      const dt = Date.now() - time;

      projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);

      d3.selectAll('path.land').attr('d', path);
      d3.selectAll('path.city-labels').attr('d', r => path(circle.center(r.coordinates).radius(0.5)()));
      d3.selectAll('path.range').attr('d', r => path(circle.center(pyongyang).radius(r)()));
      positionLabels();
    });
  }

  d3.select('.rotating-globes__drag-overlay')
    .call(d3.drag().on('start', startGlobeDrag).on('drag', onGlobeDrag).on('end', startSpinningAgain))
}

drawCharts();
