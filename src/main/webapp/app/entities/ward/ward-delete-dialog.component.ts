import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { HttpResponse } from '@angular/common/http';
import { IWard } from 'app/shared/model/ward.model';
import { WardService } from './ward.service';
import { BedService } from '../bed/bed.service';
import { IBed } from 'app/shared/model/bed.model';
/* eslint-disable no-console */
@Component({
  templateUrl: './ward-delete-dialog.component.html'
})
export class WardDeleteDialogComponent implements OnInit {
  ward?: IWard;
  bedList: IBed[] = [];

  constructor(
    protected wardService: WardService, 
    public activeModal: NgbActiveModal, 
    protected eventManager: JhiEventManager,
    protected bedService: BedService  
  ) {}

  ngOnInit(): void {
    this.loadBeds();
  }

  protected loadBeds(): void {
    this.bedService.query({})
      .subscribe((res: HttpResponse<IBed[]>) => this.getBeds(res.body!));
  }

  protected getBeds(data: IBed[]): void {
    data.forEach(x => {
     this.bedList?.push(x);
     console.log(x);
    });
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  // get bedlist, then 
  // do check inside confirmDelete

  confirmDelete(id: number): void {
    console.log('inside delete');
    console.log(this.bedList);
    this.bedList.forEach(x => {
      console.log('inside bedlist foreach');
      if (x.wardId === id) {
        console.log('there is a match');
        this.bedService.delete(x.id!).subscribe(() => {
          this.eventManager.broadcast('bedListMonification');
        });
      }
    });

    this.wardService.delete(id).subscribe(() => {
      this.eventManager.broadcast('wardListModification');
      this.activeModal.close();
    });
  }
}
