import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../models/blog';
import { User } from '../models/user';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { BlogAppService } from '../Services/blog-app.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
[x: string]: any;
  userBlog: Blog[]=[];
  searchTerm: string='';
  filteredBlogList: Blog[]=[]
  faUser = faUser
  hide = true;



  constructor(private _serv: BlogAppService,
    private _rout: Router,
    private _route: ActivatedRoute) { }

  AdduserForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z ]*$")]),
    username: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z0-9]*$")]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  },{validators:this.passwordMatchValidator()});

  // to get the controls of form for validation
  get AdduserFormControl() {
    return this.AdduserForm.controls;
  }
  private passwordMatchValidator():ValidatorFn{
  return (control: AbstractControl):ValidationErrors | null=> {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password != confirmPassword) {
      return {passwordMismatched: true};
    } else {
      return null;
    }
  }
}

  // signup function when click the signup button
  AddUser() {
    console.log("done")
    this._serv.getUsers().subscribe((res:User[])=>{
      let allUsers=res
      let isAlreadyUser =allUsers.findIndex((res:User)=>res.username==this.AdduserForm.value.username)
      if(isAlreadyUser==-1){
        this._serv.signUpUser(this.AdduserForm.value).subscribe(()=>{
          alert("success")
        })
      }else{
        alert("please choose anthor username")
      }
    })
  }
    

  ngOnInit(): void {
    this.loadUserBlog();
  }
  loadUserBlog(): void{
    this._serv.getBlogs().subscribe((Blog: Blog[])=>{
      this.userBlog=Blog;
    });

  }
  deleteBlog(i:number):void{
    if(confirm("Are you sure ? ")){
      this._serv.deleteBlog(i).subscribe(()=>{
        let currentUrl = this._rout.url;
          this._rout.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this._rout.navigate([currentUrl]);
          });
      })
    }
  }
  deleteUser(i:number):void{
    if(confirm("are you sure ? ")){
      // this._serv.de
    }

  }
  ViewBlog(a:any) {
    // let currentUser = res.find((element: User) => element.username == this.loginCredentials.username)s
    const foundBlog = this.userBlog.find((blog)=>blog.id==a);
    
    // Assuming you have a unique identifier for each blog, use it to construct the URL
      if (foundBlog){
        this._rout.navigate(['userLogged/viewBlog',foundBlog.id]);
      }
  }
}
 
  