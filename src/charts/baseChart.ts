/**
 * @file Base chart
 */
import { Args } from '../index.d';

class BaseChart {
  constructor(args: Args) {
    this.initContainer();
  }
  initContainer() {
    console.log('init BaseChart');
  }
}

export default BaseChart;
