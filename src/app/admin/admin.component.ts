import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../models/blog';
import { User } from '../models/user';
import { FormBuilder, NgForm } from '@angular/forms';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BlogAppService } from '../Services/blog-app.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';

type Sections={
  addnewuser: boolean;
    BlogAddshow: boolean;
    showUsers:boolean;
    showAddUser:Boolean;
};
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
[x: string]: any;
  users: User[] = [];
  userBlog: Blog[]=[];
  searchTerm: string='';
  filteredBlogList: Blog[]=[]
  faUser = faUser;
  UserId: string|null="";
  hide = true;
  loggeduserId?:string|null;
  imageUrl?:string | null |ArrayBuffer;
  loggedUser?:User
  addBlogForm:FormGroup;
   sections: Sections={
    addnewuser: false,
    BlogAddshow:false,
    showUsers:false,
    showAddUser:false
  };



  constructor(private _serv: BlogAppService,
    private _rout: Router,
    private _route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _http:BlogAppService) { 
      this.addBlogForm = this.formBuilder.group({
        title: ['', Validators.required],
        image: [''],
        content: ['', Validators.required]
      }); }

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
// 
loadUsers(){
  this._serv.getUsers().subscribe((User: User[])=>{
    this.users=User;
  });
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
          location.replace('admin')

        })
      }else{
        alert("please choose anthor username")
      }
    })
  }
    

  ngOnInit(): void {
    this.loadUserBlog();
    this.loadUsers();
    this.loggeduserId=this._route.snapshot.paramMap.get("id");
    this._http.getUsers().subscribe((res:User[])=>{
      this.loggedUser=res.find((element:User)=>element.id==this.loggeduserId)
    })
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
  deleteUser(i:any):void{
    if(confirm("are you sure ? ")){
      this._serv.deleteUser(i).subscribe(() => {
          alert("Deleted Successfully")
          location.replace('admin')

        })
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
  onSelectFile(event: Event):void{
   let ev=(event.target as HTMLInputElement)
   if (ev.files) {
     let reader = new FileReader()
     reader.readAsDataURL(ev?.files[0])
     reader.onload = (event:ProgressEvent<FileReader>) => {
       if(event.target){
         this.imageUrl = event.target.result
       }
     }
   }
 }
    
 addBlog(formValues: Blog): void {

  // loggedUser is possibly undefined
  if (this.loggedUser) {
    formValues.authorUname = this.loggedUser.username
    formValues.author = this.loggedUser.name
    formValues.date = new Date()
    formValues.comments = []
    formValues.likes = 0
    formValues.likedUsers = []
    if (this.imageUrl == undefined) {
      formValues.image = "https://www.kindpng.com/picc/m/320-3203444_blog-subscribe-widget-computer-icons-free-download-hd.png"
    } else {
      formValues.image = this.imageUrl
    }
    this._serv.addBlog(formValues).subscribe(()=>{
      alert("Success")
    })
    setTimeout(() => {                            
      this._rout.navigateByUrl("")
    }, 1000);
  }
}
toggleSection(section: keyof Sections):void{
  this.sections[section]=!this.sections[section];
}

    
    
}


  