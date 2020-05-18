import { Moment } from 'moment';
import { IWard } from 'app/shared/model/ward.model';

export interface IBed {
  id?: number;
  bedReferenceId?: string;
  bedName?: string;
  wardAllocationDate?: Moment;
  wardId?: number;
  wardName?: string;
  wardClassType?: string;
  ward?: IWard[];

}

export class Bed implements IBed {
  constructor(
    public id?: number,
    public bedReferenceId?: string,
    public bedName?: string,
    public wardAllocationDate?: Moment,
    public wardId?: number,
    public wardName?: string,
    public wardClassType?: string,
    public ward?: IWard[]
  ) {}
}
