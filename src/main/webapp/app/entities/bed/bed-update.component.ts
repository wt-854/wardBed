import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { IBed, Bed } from 'app/shared/model/bed.model';
import { BedService } from './bed.service';
import { IWard } from 'app/shared/model/ward.model';
import { WardService } from 'app/entities/ward/ward.service';
import { JhiAlertService } from 'ng-jhipster';
// import { dateNotBeforeTodayValidator } from './bed-date-validation';
import * as moment from 'moment';
import { DATE_FORMAT_DDMMYYYY } from 'app/shared/constants/input.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-bed-update',
  templateUrl: './bed-update.component.html'
})
export class BedUpdateComponent implements OnInit {
  isSaving = false;
  wardszxc: IWard[] = [];
  wardAllocationDateDp: any;
  bedList: IBed[] = [];
  sortedWards: IWard[] = [];
  bedCopy: IBed[] = [];
  initialForm: any;
  initialBed: IBed = {};

  editForm = this.fb.group({
    id: [],
    bedReferenceId: [
      null,
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^BED_(0[1-9]|10)$'),
        this.uniqueBedRefIdValidator()
      ]
    ],
    bedName: [null, [Validators.maxLength(17), this.uniqueBedNameValidator()]],
    wardAllocationDate: [null, [Validators.required, this.dateValidator()]],
    wardId: []
  } // , { validator: dateNotBeforeTodayValidator}
  );

  constructor(
    protected bedService: BedService,
    protected wardService: WardService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected jhiAlertService: JhiAlertService,
    protected router: Router,
    protected modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bed }) => {
      this.updateForm(bed);
      this.wardService.query().subscribe((res: HttpResponse<IWard[]>) => (this.wardszxc = res.body || []));
    });
    this.loadSortedWards();
    this.loadBeds();
    this.initialForm = this.createFromForm();
  }

  getSortedWards(data: IWard[]): void {
    data.forEach(x => {
      this.sortedWards.push(x);
    });
    this.sortedWards = this.sortedWards.sort((a: any, b: any) => a.wardName.localeCompare(b.wardName));
  }

  loadSortedWards(): void {
    this.wardService.query({}).subscribe(
      (res: HttpResponse<IWard[]>) => this.getSortedWards(res.body || []),
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  updateForm(bed: IBed): void {
    this.editForm.patchValue({
      id: bed.id,
      bedReferenceId: bed.bedReferenceId,
      bedName: bed.bedName,
      wardAllocationDate: bed.wardAllocationDate,
      wardId: bed.wardId
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bed = this.createFromForm();
    const bWid = this.editForm.get(['wardId'])!.value;
    let wName = '';
    this.sortedWards.forEach(x => {
      if (x.id === bWid) {
        wName = x.wardName!;
      }
    });
    const emptyName = wName + '_' + this.editForm.get(['bedReferenceId'])!.value;
    const finalBed = this.finalForm(emptyName); 

    if (bed.id !== undefined) {
      if (bed.bedName === '' || bed.bedName === null) {
        this.subscribeToSaveResponse(this.bedService.update(finalBed));
      } else {
        this.subscribeToSaveResponse(this.bedService.update(bed));
      }
    } else {
      if (bed.bedName === '' || bed.bedName === null) {
        this.subscribeToSaveResponse(this.bedService.create(finalBed));
      } else {
        this.subscribeToSaveResponse(this.bedService.create(bed));
      }
      this.createAgain();
    }
  }

  private createAgain(): void {
    this.router.navigate(['/bed/new']);
  }

  private finalForm(emptyName: string): IBed {
    return {
      ...new Bed(),
      id: this.editForm.get(['id'])!.value,
      bedReferenceId: this.editForm.get(['bedReferenceId'])!.value,
      bedName: emptyName,
      wardAllocationDate: this.editForm.get(['wardAllocationDate'])!.value,
      wardId: this.editForm.get(['wardId'])!.value
    };
  }

  private createFromForm(): IBed {
    return {
      ...new Bed(),
      id: this.editForm.get(['id'])!.value,
      bedReferenceId: this.editForm.get(['bedReferenceId'])!.value,
      bedName: this.editForm.get(['bedName'])!.value,
      wardAllocationDate: this.editForm.get(['wardAllocationDate'])!.value,
      wardId: this.editForm.get(['wardId'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBed>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IWard): any {
    // return item.wardName;
    return item.id;
  }

  trackRandom(index: number, item: IBed): any {
    return item.bedName;
  }

  protected onError(errorMsg: string): void {
    this.jhiAlertService.error(errorMsg);
  }

  protected loadBeds(): void {
    this.bedService.query().subscribe(
      (res: HttpResponse<IBed[]>) => this.getBeds(res.body || []),
      (res: HttpErrorResponse) => this.onError(res.message)
    );

    this.bedService.query().subscribe(
      (res: HttpResponse<IBed[]>) => (this.bedList = res.body || []),
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    // this.bedService.query({})
    //   .subscribe((res: HttpResponse<IBed[]>) => this.getBeds(res.body),
    //     (res: HttpErrorResponse) => this.onError(res.message)
    //   );
  }

  protected getBeds(data: IBed[]): void {
    this.bedCopy = [];
    data.forEach(x => {
      this.bedCopy.push(x);
    });
  }

  uniqueBedRefIdValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const len = this.bedList.length;
      this.initialBed =  this.initialForm;
      let oldBedRefId = '';
      for (let j = 0; j < len; j++) {
        if (this.bedList[j].bedReferenceId === control.value) {
          if (typeof this.initialBed === 'undefined') {
            oldBedRefId = '';
          } else {
            oldBedRefId = this.initialBed.bedReferenceId!;
            if (oldBedRefId === control.value) {
              return null;
            }
          }
          return { bedRefIdMismatch: true };
          
        }
      }
      return null;
    };
  }

  uniqueBedNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const len = this.bedList.length;
      this.initialBed = this.initialForm;
      let oldBedName = '';
      for (let j = 0; j < len; j++) {
        if (this.bedList[j].bedName === control.value) {
          if (typeof this.initialBed === 'undefined') {
            oldBedName = '';
          } else {
            oldBedName = this.initialBed.bedName!;
            if (oldBedName === control.value) {
              return null;
            }
          }
          return { bedNameMismatch: true };
        }
      }
      return null;
    };
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const today = moment().format(DATE_FORMAT_DDMMYYYY);
      const compareDate = moment(control.value).format(DATE_FORMAT_DDMMYYYY);
      this.initialBed =  this.initialForm;
      let oldDate = ''; 
      if (typeof this.initialBed === 'undefined') {
        oldDate = '';
      } else {
        oldDate = moment(this.initialBed.wardAllocationDate).format(DATE_FORMAT_DDMMYYYY);
        if (compareDate === oldDate) {
          return null;
        }
      }
      return compareDate < today ? { dateMismatch: true } : null;
    }
  }

}
