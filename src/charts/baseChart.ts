/**
 * @file Base chart
 */
import { Iargs } from '../index.d';

class BaseChart {
  constructor(args: Iargs) {
    this.initContainer();
  }
  initContainer() {
    console.log('init BaseChart');
  }
}

export { BaseChart };
