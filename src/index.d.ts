export interface Iargs {
  type: 'line' | 'pie' | 'bar' | 'scatter' | 'percentage';
  parent: String | HTMLElement; // or a DOM element
  title: string;
  data: any;
  height: number;
  colors: string[];
}
