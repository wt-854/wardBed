import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IBed, Bed } from 'app/shared/model/bed.model';
import { BedService } from './bed.service';
import { IWard } from 'app/shared/model/ward.model';
import { WardService } from 'app/entities/ward/ward.service';
import { JhiAlertService } from 'ng-jhipster';

@Component({
  selector: 'jhi-bed-update',
  templateUrl: './bed-update.component.html'
})
export class BedUpdateComponent implements OnInit {
  isSaving = false;
  wards: IWard[] = [];
  wardAllocationDateDp: any;
  bedList: IBed[] = [];

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
    bedName: [
      null, 
      [
        Validators.required, 
        Validators.maxLength(17),
        this.uniqueBedNameValidator()
      ]
    ],
    wardAllocationDate: [null, [Validators.required]],
    wardId: []
  });

  constructor(
    protected bedService: BedService,
    protected wardService: WardService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected jhiAlertService: JhiAlertService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bed }) => {
      this.updateForm(bed);

      this.wardService.query().subscribe((res: HttpResponse<IWard[]>) => (this.wards = res.body || []));
    });
    this.loadBeds();
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
    if (bed.id !== undefined) {
      this.subscribeToSaveResponse(this.bedService.update(bed));
    } else {
      this.subscribeToSaveResponse(this.bedService.create(bed));
    }
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
    return item.id;
  }

  protected onError(errorMsg: string): void {
    this.jhiAlertService.error(errorMsg);
  }

  protected getBeds(data: IBed[] | null): void {
    if (data !== null) {
      data.forEach(x => {
        this.bedList.push(x);
      });
    } 
  }

  protected loadBeds(): void {
    this.bedService.query({})
      .subscribe((res: HttpResponse<IBed[]>) => this.getBeds(res.body), 
      (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  uniqueBedRefIdValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const len = this.bedList.length;
      for (let j = 0; j < len; j++) {
        if (this.bedList[j].bedReferenceId === control.value) {
          return { bedRefIdMismatch: true};
        }
      }
      return null;
    }
  }

  uniqueBedNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const len = this.bedList.length;
      for(let j = 0; j < len; j++) {
        if (this.bedList[j].bedName === control.value) {
          return { bedNameMismatch: true};
        }
      }
      return null;
    }
  }

}
