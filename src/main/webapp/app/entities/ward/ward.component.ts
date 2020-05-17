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
/* eslint-disable no-console */
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
            console.log('inside loadpage');
            console.log(this.wards);
            console.log(this.bedList);
            // refactor later on
            // got bug with this. might double load 
            for (let i = 0; i < this.wards!.length; i++) {
              this.wards![i].noOfBeds = 0;
              for (let j = 0; j < this.bedList!.length; j++) {
                if (this.wards![i].id === this.bedList![j].wardId) {
                  this.wards![i].beds?.push(this.bedList![j]); 
                  this.wards![i].noOfBeds = this.wards![i].noOfBeds! + 1;
                }
              }
            }
            console.log(this.wards);
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

  // private setBedcount(wardCopy: IWard[], bedCopy: IBed[]): void {
    
  //   for (let i = 0; i < this.wards!.length; i++) {
  //     this.wards![i].noOfBeds = 0;
  //     for (let j = 0; j < this.bedList!.length; j++) {
  //       if (this.wards![i].id === this.bedList![j].wardId) {
  //         this.wards![i].beds?.push(this.bedList![j]); 
  //         this.wards![i].noOfBeds = this.wards![i].noOfBeds! + 1;
  //       }
  //     }
  //   }
  // }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(() => {
      this.wardService.query().subscribe((res: HttpResponse<IWard[]>) => {
        (this.wardList = res.body || []);
      });
    });
    
    this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.ascending = data.pagingParams.ascending;
      this.predicate = 'wardReferenceId';  // data.pagingParams.predicate;
      this.ngbPaginationPage = data.pagingParams.page;
      this.loadBeds();
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

    this.bedList

    let i = 0;
    this.wards.forEach(() => {
      this.wards![i].noOfBeds = this.wards![i].beds?.length;
      i++;
    });
    // console.log(this.wards);
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
