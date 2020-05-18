import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBed } from 'app/shared/model/bed.model';
import { BedService } from './bed.service';

@Component({
  templateUrl: './bed-add-dialog.component.html'
})
export class BedAddDialogComponent {
  bed?: IBed;

  constructor(protected bedService: BedService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  positive(): void {
    this.activeModal.close();
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  previousState(): void {
    window.history.back();
  }

  confirmAdd(): void {
    this.bedService.create(this.bed!).subscribe(() => this.eventManager.broadcast('bedListModification'));
    this.activeModal.dismiss(true);
  }

  confirmDelete(id: number): void {
    this.bedService.delete(id).subscribe(() => {
      this.eventManager.broadcast('bedListModification');
      this.activeModal.close();
    });
  }
}

@Component({
  template: ''
})
export class BedAddPopupComponent implements OnInit, OnDestroy {
  
  constructor(
    protected activatedRoute: ActivatedRoute, 
    protected router: Router, 
    protected modalService: NgbModal,
    protected ngbModalRef: NgbModalRef
    ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bed }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(BedAddDialogComponent as Component, 
          { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.bed = bed;
        this.ngbModalRef.result.then(() => {
          this.router.navigate(['/bed', { outlets: { popup: null } }]);
          this.ngbModalRef.close() 
        }, () => {
          this.router.navigate(['/bed/new', { outlets: { popup: null } }]);
          this.ngbModalRef.close()
        });
      }, 0);
    });
  }

  ngOnDestroy(): void {
    this.ngbModalRef.close();
  }


}
