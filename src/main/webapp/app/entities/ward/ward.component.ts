import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IWard } from 'app/shared/model/ward.model';

// import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { WardService } from './ward.service';
import { WardDeleteDialogComponent } from './ward-delete-dialog.component';

@Component({
  selector: 'jhi-ward',
  templateUrl: './ward.component.html'
})
export class WardComponent implements OnInit, OnDestroy {
  wards?: IWard[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = 5;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  searchCriteria: any;
  wardList?: IWard[];

  constructor(
    protected wardService: WardService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {
    this.searchCriteria = {
      searchWardName: ''
    };
  }

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page;

    if (this.searchCriteria.searchWardName === '' || 
      this.searchCriteria.searchWardName === null || 
      this.searchCriteria.searchWardName === 'undefined') {
        this.wardService
        .query({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe(
          (res: HttpResponse<IWard[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
          () => this.onError()
        );
      } else {
          this.wardService
            .search({
              searchWardName: this.searchCriteria.searchWardName,
              page: pageToLoad - 1,
              size: this.itemsPerPage,
              sort: this.sort()
            })
            .subscribe(
              (res: HttpResponse<IWard[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
              () => this.onError()
            );
      }
  }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(() => {
      this.wardService.query().subscribe((res: HttpResponse<IWard[]>) => (this.wardList = res.body || []));
    });
    this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.ascending = data.pagingParams.ascending;
      this.predicate = 'wardReferenceId';  // data.pagingParams.predicate;
      this.ngbPaginationPage = data.pagingParams.page;
      this.loadPage();
    });
    
    this.registerChangeInWards();
  }

  public search(): void {
    this.loadPage();
  }

  public clear(): void {
    this.searchCriteria = {
      searchWardName: ''
    };
    this.page = 1;
    this.router.navigate(['/ward', {
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

  trackId(index: number, item: IWard): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInWards(): void {
    this.eventSubscriber = this.eventManager.subscribe('wardListModification', () => this.loadPage());
  }

  delete(ward: IWard): void {
    const modalRef = this.modalService.open(WardDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ward = ward;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'wardReferenceId') {
      result.push('wardReferenceId');
    }
    return result;
  }

  protected onSuccess(data: IWard[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.router.navigate(['/ward'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
      }
    });
    this.wards = data || [];
  }

  public onSearchSuccess(data: IWard[] | null, headers: HttpHeaders, page: number, searchQuery: string): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.router.navigate(['/ward'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
      }
    });
    this.wards = []; // max is 10 anyway, doing this jus resets to 0

    // JUST REALISED FRONTEND SEARCH WAS BASED ON WHICH PAGE IM ON
    this.wardList?.forEach(x => {
      if (x.wardName!.toString().toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())) {
        this.wards?.push(x);
      }
    });

    // this is to set the pages after search
    this.totalItems = this.wards.length;

  }

  protected onError(): void {
    this.ngbPaginationPage = this.page;
  }
}
