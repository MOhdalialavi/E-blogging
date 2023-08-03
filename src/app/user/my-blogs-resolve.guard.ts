import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Blog } from '../models/blog';
import { User } from '../models/user';
import { BlogAppService } from '../Services/blog-app.service';

@Injectable({
  providedIn: 'root'
})

export class MyBlogsResolveGuard implements Resolve<Observable<object>> {

  curentUserId?: string | null
  currentUser?: User | null=new User()
  constructor(private _serv: BlogAppService) { }

  // used rxjs operators to filter the blogs written by the current user
  resolve() {
    this._serv.getUsers().subscribe((user:User[]) => {
      this.currentUser = user.find((element: User) => element.id == localStorage.getItem("userLoggedIn"))
    })
    return this._serv.getBlogs()
      .pipe(map((blogs: Blog[]) => blogs.filter((blog: Blog) => blog.authorUname == this.currentUser?.username)))
  }

}
