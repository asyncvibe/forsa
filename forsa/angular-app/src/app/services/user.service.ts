import { Injectable } from '@angular/core';
import { BaseService } from '../services/base.service'
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  backendUrl = environment.Url.concat('/api/user')
  constructor(protected http: HttpClient) { super(http) }

  findAllUsers(): Observable<any> {
    return this.__get(`${this.backendUrl}/findAllUsers`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }

  findUsersStats(): Observable<any> {
    return this.__get(`${this.backendUrl}/findUserStats`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  

  updateUser(id,data): Observable<any> {
    return this.__post(`${this.backendUrl}/editProfile/${id}`, data)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  updateImage(id,data): Observable<any> {
    return this.__post(`${this.backendUrl}/updateImage/${id}`, data)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  updateCompanyImage(id,data): Observable<any> {
    return this.__post(`${this.backendUrl}/updateCompanyImage/${id}`, data)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  resetPassword(password,code,id): Observable<any> {
    return this.__post(`${this.backendUrl}/resetpassword/${code}/${id}`, password)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }

  sendEmailToUser(data): Observable<any> {
    return this.__post(`${this.backendUrl}/sendEmailAlert`, data)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }

  deleteUser(id) {
    return this.__delete(`${this.backendUrl}/deleteOneUser/${id}`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  createUser(data): Observable<any> {
    return this.__post(`${this.backendUrl}/createAccount`, data)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  LoginUser(data): Observable<any> {
    return this.http.post(`${this.backendUrl}/login`, data)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  findOnUser(id) {
    return this.__get(`${this.backendUrl}/findOneUser/${id}`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }

  findUnverifiedUsers() {
    return this.__get(`${this.backendUrl}/unverifiedUsers`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }

  verifyUser(id) {
    return this.__get(`${this.backendUrl}/verifyUser/${id}`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }

  findBrokers(){
    return this.__get(`${this.backendUrl}/findBrokers`)
    .pipe(tap(data => <any>data),
      catchError(this.handleError));
  }
  findCustomers(){
    return this.__get(`${this.backendUrl}/findCustomers`)
    .pipe(tap(data => <any>data),
      catchError(this.handleError));
  }
  findLandlords(){
    return this.__get(`${this.backendUrl}/findLandlords`)
    .pipe(tap(data => <any>data),
      catchError(this.handleError));
  }


  
  findVerifiedUsers(){
    return this.__get(`${this.backendUrl}/findVerifiedUsers`)
    .pipe(tap(data => <any>data),
      catchError(this.handleError));
  }

  assignPostsToUser(id,data): Observable<any> {
    return this.__post(`${this.backendUrl}/assignPostsToUser/${id}`, data)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }


}
