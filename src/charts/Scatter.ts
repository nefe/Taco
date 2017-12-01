/**
 * @file Line chart
 */
import BaseChart from './baseChart';
import { Args } from '../index.d';

class Scatter extends BaseChart {
  constructor(args: Args) {
    super(args);
    this.init();
  }
  init() {
    console.log('Scatter');
  }
}

export default Scatter;
