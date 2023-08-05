import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotLoggedInResolver implements Resolve<boolean> {

  constructor(private _router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (localStorage.getItem("loggedUser")==null) {
        this._router.navigateByUrl("userLogin");
        return false;
    } else {
        return true;
    }
  }
}
