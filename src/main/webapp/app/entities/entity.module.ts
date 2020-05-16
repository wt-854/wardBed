import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'ward',
        loadChildren: () => import('./ward/ward.module').then(m => m.WardBedWardModule)
      },
      {
        path: 'bed',
        loadChildren: () => import('./bed/bed.module').then(m => m.WardBedBedModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class WardBedEntityModule {}
