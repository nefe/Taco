import Chart from './index';
import BarChart from './charts/Bar';
import ScatterChart from './charts/Scatter';

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
      values: [25, 40, 30, 35, 8, 52, 17, -4]
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
  parent: 'line',
  title: 'My Chart',
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


const scatterData = {
  datasets: [
    {
      title: 'size',
      values: [10, 2, 3, 4, 3, 2, 8]
    },
    {
      title: 'year',
      values: [30, 300, 232.23, 422, 322, 423, 283]
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
