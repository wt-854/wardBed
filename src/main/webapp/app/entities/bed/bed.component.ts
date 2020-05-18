import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBed } from 'app/shared/model/bed.model';
import { IWard } from 'app/shared/model/ward.model';
import { WardService } from '../ward/ward.service';
// import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { BedService } from './bed.service';
import { BedDeleteDialogComponent } from './bed-delete-dialog.component';

@Component({
  selector: 'jhi-bed',
  templateUrl: './bed.component.html'
})
export class BedComponent implements OnInit, OnDestroy {
  beds?: IBed[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = 10; // ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  searchCriteria: any;
  wardList: IWard[] = [];
  singleWard: IWard = {};

/* eslint-disable no-console */
  constructor(
    protected bedService: BedService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected wardService: WardService
  ) {
    this.searchCriteria = {
      searchBedName: ''
    };
    this.wardService
    .query({})
    .subscribe(
      (res: HttpResponse<IWard[]>) => this.wardList = (res.body || []),
      () => this.onError()
    );
  }

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page;

    // TEST SEARCH METHOD

    if (this.searchCriteria.searchBedName === '' || 
    this.searchCriteria.searchBedName === null || 
    this.searchCriteria.searchBedName === 'undefined') {
      this.bedService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<IBed[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
        () => this.onError()
      );
    } else {
      this.bedService
      .search({
        searchBedName: this.searchCriteria.searchBedName,
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<IBed[]>) => {
          this.onSearchSuccess(res.body, res.headers, pageToLoad);
            // console.log(res.body);
        },
        () => this.onError()
      );
    }
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.ascending = data.pagingParams.ascending;
      this.predicate = 'bedName'; // data.pagingParams.predicate;
      this.ngbPaginationPage = data.pagingParams.page;
      this.loadPage();
    });
    this.registerChangeInBeds();
  }

  public search(): void {
    this.loadPage();
  }

  public clear(): void {
    this.searchCriteria = {
      searchBedName: ''
    };
    this.page = 1;
    this.router.navigate(['/bed', {
        page: this.page,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
    }]);
    this.loadPage();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IBed): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInBeds(): void {
    this.eventSubscriber = this.eventManager.subscribe('bedListModification', () => this.loadPage());
  }

  delete(bed: IBed): void {
    const modalRef = this.modalService.open(BedDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bed = bed;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IBed[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.router.navigate(['/bed'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
      }
    });
    this.beds = data || [];
    this.beds.forEach(x => {
      this.wardList.forEach(y => {
        if (y.id === x.wardId) {
          x.wardName = y.wardName;
        }
      });
    });
  }

  protected onSearchSuccess(data: IBed[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.router.navigate(['/bed'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
      }
    });
    this.beds = data || [];
    this.beds.forEach(x => {

      // extract the ward details
      Object.assign(this.singleWard, x.ward);
      
      this.wardList.forEach(y => {
        if (y.id === this.singleWard.id) {
          x.wardId = this.singleWard.id;
          x.wardName = this.singleWard.wardName;
        }
      });
    });
    
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page;
  }
}
