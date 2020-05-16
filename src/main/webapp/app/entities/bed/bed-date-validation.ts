import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { DATE_FORMAT_DDMMYYYY } from 'app/shared/constants/input.constants';

export function dateNotBeforeTodayValidator(control: AbstractControl): { [key: string]: boolean } | null {
    
    const today = moment().format(DATE_FORMAT_DDMMYYYY);
    const compareDate = moment(control.get('wardAllocationDate')?.value).format(DATE_FORMAT_DDMMYYYY);

    return compareDate < today ? { dateMismatch: true } : null;
}