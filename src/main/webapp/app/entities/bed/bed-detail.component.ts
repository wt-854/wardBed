import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBed } from 'app/shared/model/bed.model';
import { IWard } from 'app/shared/model/ward.model';
import { WardService } from 'app/entities/ward/ward.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';

@Component({
  selector: 'jhi-bed-detail',
  templateUrl: './bed-detail.component.html'
})
export class BedDetailComponent implements OnInit {
  bed: IBed | null = null;
  wardList : IWard[] = [];

  constructor(protected activatedRoute: ActivatedRoute, protected wardService: WardService, protected jhiAlertService: JhiAlertService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bed }) => (this.bed = bed));
    this.loadAllWards();
  }

  previousState(): void {
    window.history.back();
  }

  protected onError(errorMsg: string): void {
    this.jhiAlertService.error(errorMsg);
  }

  getWards(data: IWard[]): void {
    data.forEach(x => {
      this.wardList.push(x);
      if (x.id === this.bed?.wardId) {
        this.bed!.wardName = x.wardName;
        this.bed!.wardClassType = x.wardClassType;
      }
    });
  }

  loadAllWards(): void {
    this.wardService.query()
      .subscribe((res: HttpResponse<IWard[]>) => this.getWards(res.body || []), 
      (res: HttpErrorResponse) => this.onError(res.message)
      );
  }
}
