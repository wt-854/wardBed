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
import { BedService } from 'app/entities/bed/bed.service';
import { IBed } from 'app/shared/model/bed.model';

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
  bedList?: IBed[] = [];
  COUNTER = 0;

  constructor(
    protected wardService: WardService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected bedService: BedService
  ) {
    this.searchCriteria = {
      searchWardName: ''
    };
    
  }

  protected loadBeds(): void {
    this.bedService.query({})
      .subscribe((res: HttpResponse<IBed[]>) => this.getBeds(res.body!));
  }

  protected getBeds(data: IBed[]): void {
    data.forEach(x => {
     this.bedList?.push(x);
    });
  }

  getBedCount(data: IWard[]):void {
    data.forEach(x => {
      x.beds = [];
      x.noOfBeds = 0;
      
      this.bedList?.forEach(y => {
        if(y.wardId === x.id) {
          x.beds?.push(y);
        }
      });
      x.noOfBeds = x.beds.length;
    });
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
          (res: HttpResponse<IWard[]>) => {
            this.onSuccess(res.body, res.headers, pageToLoad);
          },
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
  
    this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.ascending = data.pagingParams.ascending;
      this.predicate = 'wardReferenceId';  // data.pagingParams.predicate;
      this.ngbPaginationPage = data.pagingParams.page;
      this.loadBeds();
      this.router.navigate(['/ward'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
        }
      });
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

    this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.ascending = data.pagingParams.ascending;
      this.predicate = 'wardReferenceId';  // data.pagingParams.predicate;
      this.ngbPaginationPage = data.pagingParams.page;

    });
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
    this.wards = data!;
    this.getBedCount(this.wards);
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.router.navigate(['/ward'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc')
      }
    });

  }

  protected onError(): void {
    this.ngbPaginationPage = this.page;
  }
}
