import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private _rout: Router) { }
  canActivate(): boolean {
    if (localStorage.getItem("userLoggedIn")) {
      return true
    } else {
      alert("Please Login")
      this._rout.navigateByUrl("userLogin")
      return false
    }

  }

}
