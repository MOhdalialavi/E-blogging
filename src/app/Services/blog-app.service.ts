import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data, Router } from '@angular/router';
import { catchError,map, Observable, retry, throwError } from 'rxjs';
import { Blog } from '../models/blog';
import { User } from '../models/user';
import { HttpHeaders } from '@angular/common/http';
import { loginUser } from '../models/userLogin';

@Injectable({
  providedIn: 'root'
})
export class BlogAppService {
  approvedBlogs:Blog[]=[];

  isLoggedIn() {
    throw new Error('Method not implemented.');
  }
  private isAuthenticated = false;
  
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
  getpendingblogs():Observable<any>{
    return this._http.get(`${this.baseUrl}Pending-blogs`)
    .pipe(retry(1),catchError(this.handleError))
  }
  // getpendingBlogs():Observable<Blog>{
  //   return this._http.get<Blog[]>(`${this.baseUrl}Pending-blogs`)
  //   .pipe(retry(1),catchError(this.handleError))

  // }
  getUsers():Observable<User[]> {
    return this._http.get<User[]>(this.baseUrl+"users")
    .pipe(retry(1),catchError(this.handleError))
  }

  signUpUser(user: object) {
    return this._http.post(this.baseUrl+"users", user)
    .pipe(retry(1),catchError(this.handleError))
  }
  fetchPendingBlogs(blog: Blog) {
    
    return this._http.post(`${this.baseUrl}Pending-blogs`,blog)
      .pipe(
        catchError(this.handleError)
      );
  }
  loadPending(){
    return this._http.get(this.baseUrl+"Pending-blogs")
    .pipe(retry(1),catchError(this.handleError))
  }

  approvedBlog(blog: Blog): Observable<any> {
    return this._http.post<Blog>(`${this.baseUrl}blogs`, blog)
    .pipe(
      catchError(this.handleError)
    );

    
  }

  rejectBlog(blog: Blog): Observable<any> {
    return this._http.delete(`${this.baseUrl}Pending-blogs/${blog.id}`)
      .pipe(
        catchError(this.handleError)
      );
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
  login(username:string,password:string):Observable<any>{
    const headers=new HttpHeaders({
      'Content-Type':'application/json'
    });
    const body={
      username:username,
      password:password
    };
    return this._http.post<any>(this.baseUrl + 'login', body, { headers: headers }).pipe(
      map((response) => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userLoggedIn', 'true'); // Mark user as logged in
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userLoggedIn');
    this._rout.navigateByUrl('/login'); // Redirect to the login page
  }
  
}
