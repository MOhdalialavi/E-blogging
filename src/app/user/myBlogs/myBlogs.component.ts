import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from 'src/app/models/blog';
import { BlogAppService } from 'src/app/Services/blog-app.service';

@Component({
  selector: 'app-myBlogs',
  templateUrl: './myBlogs.component.html',
  styleUrls: ['./myBlogs.component.css']
})
export class MyBlogsComponent implements OnInit {

  myBlogs: Blog[] = []

  constructor(private serv: BlogAppService,
    private _rout:Router,
    private _route:ActivatedRoute) { }

  ngOnInit() {

    // current user's blogs coming from resolve 
    this.myBlogs= this._route.snapshot.data['myBlogs']
    
    // sorting them with their date
    this.myBlogs.sort(function compare(obj1, obj2) { return new Date(obj2.date).getTime() -new Date(obj1.date).getTime() })}

  deleteBlog(i:number):void{
    if(confirm("Are you sure ? ")){
      this.serv.deleteBlog(i).subscribe(()=>{
        let currentUrl = this._rout.url;
          this._rout.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this._rout.navigate([currentUrl]);
          });
      })
    }
  }
  

  addBlog():void {
    this._rout.navigate(['userLogged/addBlog', localStorage.getItem("userLoggedIn")])
  }

}
