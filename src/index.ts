import Line from './charts/Line';
import Scatter from './charts/Scatter'
import { Args } from './index.d';

export default class Chart {
  constructor(args: Args) {
    // 这里初始化对应 Chart
    switch (args.type) {
      case 'line': {
        return new Line(args);
      }
      case 'scatter': {
        return new Scatter(args);
      }
      default:
        return new Line(args);
    }
  }
}
