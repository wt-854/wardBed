import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { DATE_FORMAT_DDMMYYYY } from 'app/shared/constants/input.constants';

export function dateNotBeforeTodayValidator(control: AbstractControl): { [key: string]: boolean } | null {
    
    const today = moment().format(DATE_FORMAT_DDMMYYYY);
    const compareDate = moment(control.get('wardAllocationDate')?.value).format(DATE_FORMAT_DDMMYYYY);
/* eslint-disable no-console */

    // let validDateFormat = moment();
    // if (control.get('wardAllocationDate')?.value === null) {
    //     validDateFormat = moment();
    // } else {
    //     validDateFormat = control.get('wardAllocationDate')?.value;
    //     if (!Date.parse(validDateFormat.toString())) {
    //         console.log('unable to parse date');
    //     } else {
    //         console.log('able to parse date');
    //     }
    // }

    return compareDate < today ? { dateMismatch: true } : null;
}

// export function dateFormatValidator(control: AbstractControl): { [key: string]: boolean } | null {
    
//     let validDateFormat = moment();
//     if (control.get('wardAllocationDate')?.value === null) {
//         validDateFormat = moment();
//     } else {
//         validDateFormat = control.get('wardAllocationDate')?.value;
//         if (!Date.parse(validDateFormat.toString())) {
//             console.log('unable to parse date');
//         } else {
//             console.log('able to parse date');
//         }
//     }
    
//     return null;
// }