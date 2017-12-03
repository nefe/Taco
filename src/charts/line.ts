/**
 * @file Line chart
 */
import { BaseChart } from './BaseChart';
import { Iargs } from '../index.d';

class Line extends BaseChart {
  constructor(args: Iargs) {
    super(args);
    this.init();
  }
  init() {
    console.log('line');
  }
}

export { Line };
