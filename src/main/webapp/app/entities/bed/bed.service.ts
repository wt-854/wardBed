import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IBed } from 'app/shared/model/bed.model';

type EntityResponseType = HttpResponse<IBed>;
type EntityArrayResponseType = HttpResponse<IBed[]>;

@Injectable({ providedIn: 'root' })
export class BedService {
  public resourceUrl = SERVER_API_URL + 'api/beds';

  constructor(protected http: HttpClient) {}

  create(bed: IBed): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bed);
    return this.http
      .post<IBed>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(bed: IBed): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bed);
    return this.http
      .put<IBed>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBed>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBed[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(bed: IBed): IBed {
    const copy: IBed = Object.assign({}, bed, {
      wardAllocationDate:
        bed.wardAllocationDate && bed.wardAllocationDate.isValid() ? bed.wardAllocationDate.format(DATE_FORMAT) : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.wardAllocationDate = res.body.wardAllocationDate ? moment(res.body.wardAllocationDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((bed: IBed) => {
        bed.wardAllocationDate = bed.wardAllocationDate ? moment(bed.wardAllocationDate) : undefined;
      });
    }
    return res;
  }
}
