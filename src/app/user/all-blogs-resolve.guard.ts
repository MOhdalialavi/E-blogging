import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable } from 'rxjs';
import { BlogAppService } from '../Services/blog-app.service';

@Injectable({
  providedIn: 'root'
})
export class AllBlogsResolveGuard implements Resolve<Observable<object>> {
  curentUserId?: string | null
  constructor(private _serv: BlogAppService) { }

  // used rxjs operators to filter the blogs written by the current user
  resolve() {
    return this._serv.getBlogs()
  }
}
