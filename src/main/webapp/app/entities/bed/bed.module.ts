import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WardBedSharedModule } from 'app/shared/shared.module';
import { BedComponent } from './bed.component';
import { BedDetailComponent } from './bed-detail.component';
import { BedUpdateComponent } from './bed-update.component';
import { BedDeleteDialogComponent } from './bed-delete-dialog.component';
import { bedRoute } from './bed.route';
import { BedAddDialogComponent, BedAddPopupComponent } from './bed-add-dialog.component';

@NgModule({
  imports: [WardBedSharedModule, RouterModule.forChild(bedRoute)],
  declarations: [
    BedComponent, 
    BedDetailComponent, 
    BedUpdateComponent, 
    BedDeleteDialogComponent, 
    BedAddDialogComponent,
    BedAddPopupComponent
  ],
  entryComponents: [
    BedDeleteDialogComponent, 
    BedAddDialogComponent, 
    BedAddPopupComponent
  ]
})
export class WardBedBedModule {}
