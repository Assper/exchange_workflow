import { Json } from '../types';

export interface Serializable {
  toJson(): Json;
}
