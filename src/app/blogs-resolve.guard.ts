import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Blog } from './models/blog';
import { BlogAppService } from './Services/blog-app.service';

@Injectable({
  providedIn: 'root'
})
export class BlogsResolveGuard implements Resolve<Observable<object>> {

  constructor(private _serv: BlogAppService) { }
  resolve():Observable<Blog[]> {
    return this._serv.getBlogs()
  }

}
