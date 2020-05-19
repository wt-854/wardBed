import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WardBedSharedModule } from 'app/shared/shared.module';
import { BedComponent } from './bed.component';
import { BedDetailComponent } from './bed-detail.component';
import { BedUpdateComponent } from './bed-update.component';
import { BedDeleteDialogComponent } from './bed-delete-dialog.component';
import { bedRoute, addBedPopupRoute } from './bed.route';
import { BedAddDialogComponent, BedAddPopupComponent } from './bed-add-dialog.component';
import { JhiLanguageService } from 'ng-jhipster';


const ENTITY_STATES = [...bedRoute, ...addBedPopupRoute];

@NgModule({
  imports: [WardBedSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    BedComponent, 
    BedDetailComponent, 
    BedUpdateComponent, 
    BedDeleteDialogComponent, 
    BedAddDialogComponent,
    BedAddPopupComponent
  ],
  entryComponents: [
    BedComponent,
    BedUpdateComponent,
    BedDeleteDialogComponent, 
    BedAddDialogComponent, 
    BedAddPopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WardBedBedModule {

}
