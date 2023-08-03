import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class NotLoggedInGuard implements CanActivate {

  constructor(private _rout:Router){}
  canActivate():boolean{
    if(!localStorage.getItem("loggedUser")){
      return true;
    }else{
      this._rout.navigateByUrl("")
      return false
    }
  }
}
