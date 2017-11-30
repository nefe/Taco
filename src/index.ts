import { Line } from './charts/line';
import Bar from './charts/Bar';
import { Iargs } from './index.d';

export default class Chart {
  constructor(args: Iargs) {
    // 这里初始化对应 Chart
    switch (args.type) {
      case 'line': {
        return new Line(args);
      }
      case 'bar': {
      }  
      case 'pie': {
      }
      default:
        break;
    }
  }
}
