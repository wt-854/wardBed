import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { IWard } from 'app/shared/model/ward.model';
import { BedService } from 'app/entities/bed/bed.service';
import { IBed } from 'app/shared/model/bed.model';

@Component({
  selector: 'jhi-ward-detail',
  templateUrl: './ward-detail.component.html'
})
export class WardDetailComponent implements OnInit {
  ward: IWard | null = null;
  bedList: IBed[] = [];
/* eslint-disable no-console */
  constructor(protected activatedRoute: ActivatedRoute, protected bedService: BedService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ward }) => (this.ward = ward));
    this.loadBeds();
    console.log(this.ward);
  }

  getBedList(data: IBed[]): void {
    this.ward!.noOfBeds = 0;
    this.ward!.beds = [];
    data.forEach(x => {
      if (x.wardId === this.ward?.id) {
        this.ward?.beds?.push(x);
        this.ward!.noOfBeds = this.ward?.beds?.length;
      }
    });
  }

  loadBeds(): void {
    this.bedService.query({})
    .subscribe((res: HttpResponse<IBed[]>) => this.getBedList(res.body!));
  }

  previousState(): void {
    window.history.back();
  }
}
