/**
 * @file Base chart
 */
import { Iargs } from '../index.d';

interface Dataset {
  title:string,
  values:number[]
}
interface OptionData  {
  labels:string[],
  datasets:Dataset[],
  colors:string[],
}

export { OptionData };
