export interface Iargs {
  type: 'line' | 'pie' | 'bar' | 'scatter' | 'percentage';
  parent: string | HTMLElement; // or a DOM element
  title?: string;
  subTitle?: string;
  data: any;
  height: number;
  colors: string[];
}
