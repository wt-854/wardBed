import { Moment } from 'moment';

export interface IBed {
  id?: number;
  bedReferenceId?: string;
  bedName?: string;
  wardAllocationDate?: Moment;
  wardId?: number;
  wardName?: string;
  wardClassType?: string;
}

export class Bed implements IBed {
  constructor(
    public id?: number,
    public bedReferenceId?: string,
    public bedName?: string,
    public wardAllocationDate?: Moment,
    public wardId?: number,
    public wardName?: string,
    public wardClassType?: string
  ) {}
}
