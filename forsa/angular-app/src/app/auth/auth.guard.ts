import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, public toastr: ToastrManager) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let token = localStorage.getItem('token')
    let role = localStorage.getItem('role')


    if (token && role === 'admin') {
      return true;
    }


    this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    this.toastr.warningToastr('Please Login as Admin to Continue!', 'Failed!');
    return false;
  }

}
