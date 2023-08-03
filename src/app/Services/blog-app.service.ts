import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError,map, Observable, retry, throwError } from 'rxjs';
import { Blog } from '../models/blog';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class BlogAppService {
  // object is posiibly undefined 
  
  baseUrl:string="http://localhost:3000/"

  constructor(private _http: HttpClient,private _rout: Router,) { }

  checkLocalStorage(){
    if (localStorage.getItem('userLoggedIn')) {
      return true
    } 
    return false
  }

  handleError(error:Error){
    alert(error.message)
    return throwError(()=>error)
  }

  getBlogs():Observable<Blog[]> {
    return this._http.get<Blog[]>(this.baseUrl+"blogs")
    .pipe(retry(1),catchError(this.handleError))
  }

  getUsers():Observable<User[]> {
    return this._http.get<User[]>(this.baseUrl+"users")
    .pipe(retry(1),catchError(this.handleError))
  }
  
  signUpUser(user: object) {
    return this._http.post(this.baseUrl+"users", user)
    .pipe(retry(1),catchError(this.handleError))
  }

  addBlog(blog: Blog) {
    return this._http.post(this.baseUrl+"blogs", blog)
    .pipe(retry(1),catchError(this.handleError))
  }

  addComment(id:number|null,updatedData:Blog|undefined){
    
    return this._http.put(this.baseUrl+"blogs/"+id,updatedData)
    .pipe(retry(1),catchError(this.handleError))
  }

  deleteBlog(i:number):Observable<Blog>{
    return this._http.delete<Blog>(this.baseUrl+"blogs/"+i)
    .pipe(retry(1),catchError(this.handleError))
  }
  
  deleteUser(id:string|null):Observable<User>{
    return this._http.delete<User>(this.baseUrl+"users/"+id)
    .pipe(retry(1),catchError(this.handleError))
  }

  addLikes(id:number|null,updatedData:Blog|undefined){   
    
    return this._http.put(this.baseUrl+"blogs/"+id,updatedData)
    .pipe(retry(1),catchError(this.handleError))
  }
  getAuthorsWithBlogCount(): Observable<{ author: string; blogCount: number }[]> {
    return this._http.get<Blog[]>(this.baseUrl + "blogs").pipe(
      map((blogs: Blog[]) => {
        const authorCountMap = new Map<string, number>();

        // Count the number of blogs for each author
        blogs.forEach((blog: Blog) => {
          const author = blog.author;
          if (author) {
            if (authorCountMap.has(author)) {
              authorCountMap.set(author, authorCountMap.get(author)! + 1);
            } else {
              authorCountMap.set(author, 1);
            }
          }
        });

        // Convert the authorCountMap to an array of objects with author and blogCount properties
        const authorsWithCounts = Array.from(authorCountMap).map(([author, blogCount]) => ({
          author,
          blogCount
        }));

        return authorsWithCounts;
      }),
      catchError(this.handleError)
    );
  }

  
}