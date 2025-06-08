import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';


@Injectable()
export class BaseService {

  constructor(protected http: HttpClient) {
    this.setHeaders();
  }

  private setHeaders(queryParams?) {
    let token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    return { headers: new HttpHeaders({ token: `${token}` }), params: this.setParams(queryParams) };

  }
  private setParams(queryParams) {
    let params = new HttpParams();

    for (let key in queryParams) {
      if (queryParams.hasOwnProperty(key) && queryParams[key] != '') {
        params = params.set(key, queryParams[key]);
      }
    }

    return params;
  }


  protected __get(url, queryParams?) {
  
    return this.http.get(`${url}`, this.setHeaders(queryParams));
  }

  protected __post(url, postBody?,Params?) {

    return this.http.post(`${url}`, postBody, this.setHeaders());
  }
  protected __put(url, postBody) {
    return this.http.put(`${url}`, postBody, this.setHeaders());
  }
  protected __delete(url) {


    return this.http.delete(`${url}`, this.setHeaders());
  }

  /**
   * handle error
   *

  * @param error Response
   */
  protected handleError(httpErrorResponse: any) {

    return throwError(httpErrorResponse.error || 'Server error');

  }
}