/**
 * @file Line chart
 */
import { AxisChart } from './AxisChart';
import { Iargs } from '../index.d';

class Line extends AxisChart {
  constructor(args: Iargs) {
    super(args);
    this.init();
  }
  init() {
    console.log('line');
  }
}

export { Line };
