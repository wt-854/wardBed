import { IBed } from 'app/shared/model/bed.model';
import { ClassType } from 'app/shared/model/enumerations/class-type.model';
import { Location } from 'app/shared/model/enumerations/location.model';

export interface IWard {
  id?: number;
  wardReferenceId?: string;
  wardName?: string;
  wardClassType?: ClassType;
  wardLocation?: Location;
  beds?: IBed[];
  noOfBeds?: number;
}

export class Ward implements IWard {
  constructor(
    public id?: number,
    public wardReferenceId?: string,
    public wardName?: string,
    public wardClassType?: ClassType,
    public wardLocation?: Location,
    public beds?: IBed[],
    public noOfBeds?: number
  ) {}
}
