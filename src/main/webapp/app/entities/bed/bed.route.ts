import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IBed, Bed } from 'app/shared/model/bed.model';
import { BedService } from './bed.service';
import { BedComponent } from './bed.component';
import { BedDetailComponent } from './bed-detail.component';
import { BedUpdateComponent } from './bed-update.component';
import { BedAddPopupComponent } from './bed-add-dialog.component';

@Injectable({ providedIn: 'root' })
export class BedResolve implements Resolve<IBed> {
  constructor(private service: BedService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBed> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((bed: HttpResponse<Bed>) => {
          if (bed.body) {
            return of(bed.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Bed());
  }
}

export const bedRoute: Routes = [
  {
    path: '',
    component: BedComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'wardBedApp.bed.home.manageLabel'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: BedDetailComponent,
    resolve: {
      bed: BedResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'wardBedApp.bed.home.viewLabel'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: BedUpdateComponent,
    resolve: {
      bed: BedResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'wardBedApp.bed.home.addLabel'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: BedUpdateComponent,
    resolve: {
      bed: BedResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'wardBedApp.bed.home.editLabel'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const addBedPopupRoute: Routes = [
  {
    path: 'addAgain',
    component: BedAddPopupComponent,
    resolve: {
      bed: BedResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'wardBedApp.bed.home.addLabel'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];