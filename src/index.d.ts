export declare type ChartTypes = 'line' | 'pie' | 'bar' | 'scatter' | 'percentage';

export interface Args {
  type: ChartTypes;
  parent: String | HTMLElement; // or a DOM element
  title: string;
  data: any;
  height: number;
  colors: string[];
}