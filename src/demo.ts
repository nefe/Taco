import Chart from './index';
import BarChart from './charts/Bar';
import ScatterChart from './charts/Scatter';
import { Pie } from 'src/charts/Pie';
import { SankeyChart } from './charts/Sankey';

import './scss/normalize.scss';
import './scss/charts.scss';

const data = {
  labels: [
    '12am-3am',
    '3am-6pm',
    '6am-9am',
    '9am-12am',
    '12pm-3pm',
    '3pm-6pm',
    '6pm-9pm',
    '9am-12am'
  ],
  datasets: [
    {
      title: 'Some Data',
      values: [12, 40, 30, 35, 8, 52, 17, -4]
    },
    {
      title: 'Another Set',
      values: [25, 50, -10, 15, 18, 32, 27, 14]
    },
    {
      title: "Yet Another",
      values: [15, 20, -3, -15, 58, 12, -17, 37]
    }
  ]
};

const lineChart = new Chart({
  parent: '#line-chart',
  title: 'Line Chart',
  data: data,
  type: 'line', // or 'line', 'scatter', 'pie', 'percentage'
  height: 250,
  colors: ['#7cd6fd', 'violet', 'blue']
});

const chart = new BarChart({
  parent: document.getElementById('barchart'),
  height: 300,
  colors: ['#7cd6fd', '#743ee2', '#5e64ff'],
  data,
});

const canvasChart = new BarChart({
  parent: document.getElementById('barchart-canvas'),
  height: 300,
  colors: ['#7cd6fd', '#743ee2', '#5e64ff'],
  data,
  type: 'canvas',
});

function rnd(start = -100, end = 100){
  return Math.floor(Math.random() * (end - start) + start);
}

function getRandomValues() {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => {
    return rnd();
  });
}

const newData = {
  labels: [
    '12am-3am',
    '3am-6pm',
    '6am-9am',
    '9am-12am',
    '12pm-3pm',
    '3pm-6pm',
    '6pm-9pm',
    '9am-12am',
    '14am-16am'
  ],
  datasets: [
    {
      title: 'Some Data',
      values: getRandomValues(),
    },
    {
      title: 'Another Set',
      values: getRandomValues(),
    },
    {
      title: "Yet Another",
      values: getRandomValues(),
    }
  ]
};

setTimeout(() => {
  chart.update(newData);
  canvasChart.update(newData);
}, 3000);

const scatterData = {
  datasets: [
    {
      title: 'size',
      values: [10, 9, 1, 4, 5, 6, 8]
    },
    {
      title: 'year',
      values: [300, 100, 30, 422, 322, 423, 283]
    },
    {
      title: "price",
      values: [1000, 5000, 2000, 3000, 3230, 4829, 3990]
    }
  ]
}

new ScatterChart({
  parent: document.getElementById('scatter-chart'),
  height: 250,
  pattern: ['size', 'year', 'price'],
  data: scatterData,
});


new Pie({
  parent: document.getElementById('pie-chart'),
  title: 'My Pie Chart',
  data: data,
  type: 'pie',
  height: 250,
  colors: ['#7cd6fd', '#743ee2', 'red', 'blue', 'pink', 'grey', 'yellow']
});

new SankeyChart({
  parent: document.getElementById('sankey-chart'),
  type: 'sankey',
  height: 400,
  colors: ['#7cd6fd', '#743ee2', '#5e64ff', 'yellow', 'red', 'blue', 'pink', 'grey' ],
  nodes:[
    [{"node":0,"name":"node0", "value": 4},
    {"node":1,"name":"node1", "value": 4}],
    [{"node":2,"name":"node2", "value": 4}],
    [{"node":3,"name":"node3", "value": 4}],
    [{"node":4,"name":"node4", "value": 8}]
  ],
  links:[
    {"source":0,"target":2,"value":2},
    {"source":1,"target":2,"value":2},
    {"source":1,"target":3,"value":2},
    {"source":0,"target":4,"value":2},
    {"source":2,"target":3,"value":2},
    {"source":2,"target":4,"value":2},
    {"source":3,"target":4,"value":4}
  ]
})