import { Component, OnInit } from '@angular/core';
import { BlogAppService } from '../Services/blog-app.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { CountService } from '../Services/count.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Blog } from '../models/blog';
import { User } from '../models/user';
import { WordLimitterPipe } from './wordLimitter.pipe';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { __values } from 'tslib';

@Component({
  selector: 'app-show-blog',
  templateUrl: './show-blog.component.html',
  styleUrls: ['./show-blog.component.css']
})
export class ShowBlogComponent implements OnInit {
  searchControl = new FormControl();
  filteredBlogOptions: Blog[] = [];
  // for pagination
  p:number = 1

  // for icon
  faUser = faUser

  blogList: Blog[] = []
  userlogged: boolean = false
  loggedUser?:string|null
  famousAuthors: string[] = [];
  searchTerm: string='';
  filteredBlogList: Blog[]=[]
 

  constructor(private _serv: BlogAppService,
    private _rout: Router,
    private _countServ: CountService,
    private _snackBar: MatSnackBar,
    private _route: ActivatedRoute) {}


  ngOnInit(): void {

    

    this.blogList = this._route.snapshot.data['data']

    this.blogList.sort(function compare(obj1, obj2) { return new Date(obj2.date).getTime() - new Date(obj1.date).getTime() })
    

    if (localStorage.getItem('userLoggedIn')) {
      this.userlogged = true
      this.loggedUser = localStorage.getItem("userLoggedIn")
    }

    this._serv.getBlogs().subscribe((res:Blog[]) => {
      let count = res.length
      this._countServ.updateCount(count)
    })
    this._serv.getUsers().subscribe((res:User[]) => {
      let count = res.length
      this._countServ.updateUserCount(count)
    })
    this.getFamousAuthors();

    this.filteredBlogOptions = this.blogList;
    this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  
  }
  // search
  private _filter(value: string): Blog[] {
    const filterValue = value.toLowerCase();
    return this.blogList.filter((blog) =>
      blog.name?.toLowerCase().includes(filterValue)
    );
  }

  searchs(): void {
    
    const searchTerm = this.searchControl.value;
    this.filteredBlogOptions =this._filter(searchTerm);

      const foundBlog = this.blogList.find(
        (blog)=>blog.name?.toLocaleLowerCase()==searchTerm.toLocaleLowerCase());

        if (foundBlog) {
          this._rout.navigate(['userLogged/viewBlog',foundBlog.id]);
        }
 
  }

  readMore(id:number|undefined):void {
    if (localStorage.getItem("userLoggedIn" || localStorage.getItem("admin"))) {
      this._rout.navigate(['userLogged/viewBlog', id])
    } else {
      this._snackBar.open("Please Login To Read More", "", { duration: 2 * 1000 })
      setTimeout(() => {
        this._rout.navigateByUrl("userLogin")
      }, 1000);
    }
  }
  getFamousAuthors(): void {
    this._serv.getAuthorsWithBlogCount().subscribe((authors: { author: string; blogCount: number }[]) => {
      authors.sort((a, b) => b.blogCount - a.blogCount);

      const top10Authors = authors.slice(0, 10);

      this.famousAuthors = top10Authors.map((authorObj) => authorObj.author);
    });
  }
  search(): void{
    if(this.searchTerm){
      this.filteredBlogList=this.blogList.filter((item)=>
      item.name?.toLocaleLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    else{
      this.filteredBlogList=this.blogList
    }
  }
}

