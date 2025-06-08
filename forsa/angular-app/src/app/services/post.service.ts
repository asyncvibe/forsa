import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../services/base.service'
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PostService extends BaseService {

  constructor(protected http: HttpClient) { super(http) }

  backendUrl = environment.Url.concat('/api/property')
  backendListUrl = environment.Url.concat('/api/list')
  backendCategoryList = environment.Url.concat('/api/category')



  findAllPosts(): Observable<any> {
    return this.__get(`${this.backendUrl}/fetchAllProperties`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  findPropertyStats(): Observable<any> {
    return this.__get(`${this.backendUrl}/findPropertyStates`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  findInActivePosts() {
    return this.__get(`${this.backendUrl}/fetchInactivePosts`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  findActivePosts() {
    return this.__get(`${this.backendUrl}/fetchactivePosts`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  findOneProperty(id): Observable<any> {
    return this.__get(`${this.backendUrl}/findOneProperty/${id}`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  findFeaturedProperties(): Observable<any> {
    return this.__get(`${this.backendUrl}/fetchfeaturedProperties`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  findPendingFeaturedRequests(): Observable<any> {
    return this.__get(`${this.backendUrl}/featuredrequested`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  approveFeaturedRequest(id): Observable<any> {
    return this.__post(`${this.backendUrl}/approveFeaturedPost/${id}`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  approvePost(id): Observable<any> {
    return this.__post(`${this.backendUrl}/changePostStatusToActive/${id}`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  findAllCategories(): Observable<any> {
    return this.__get(`${this.backendCategoryList}/fetchAllCategories`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  deleteImage(id, imageName): Observable<any> {
    console.log('image name in the service:', imageName)
    return this.__get(`${this.backendUrl}/deleteImageOfProperty/${id}/${imageName}`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  uploadImage(id, data): Observable<any> {
    return this.__post(`${this.backendUrl}/uploadImage/${id}`, data)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  assignPostsToList(id, data): Observable<any> {
    return this.__post(`${this.backendListUrl}/addPostsToList/${id}`, data)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }

  updatePost(id, data): Observable<any> {
    return this.__post(`${this.backendUrl}/updateProperty/${id}`, data)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  deletePost(id): Observable<any> {
    return this.__delete(`${this.backendUrl}/deleteProperty/${id}`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  changePostStatus(id): Observable<any> {
    return this.__delete(`${this.backendUrl}/changePropertyStatus/${id}`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  createPostByAdmin(data): Observable<any> {
    return this.__post(`${this.backendUrl}/createProperty/`, data)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }

  assignPeopleToList(id, data): Observable<any> {
    return this.__post(`${this.backendListUrl}/addPeopleToList/${id}`, data)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  fetchAllLists(): Observable<any> {
    return this.__get(`${this.backendListUrl}/fetchAllLists`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
  UserCreatedPosts(id): Observable<any> {
    return this.__get(`${this.backendUrl}/findPropertyByUserId/${id}`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));
  }
}
