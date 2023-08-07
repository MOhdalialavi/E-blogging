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
    showPendingBlogs:boolean;
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
  userlogged:boolean=false;
  loggeduserId?:string|null;
  imageUrl?:string | null |ArrayBuffer;
  loggedUser?:User
  loggedUserId?: string | null
  addBlogForm:FormGroup;
  pendingBlogs:any=[];
  sidebaropen:boolean=true;
   sections: Sections={
    addnewuser: false,
    BlogAddshow:false,
    showUsers:false,
    showAddUser:false,
    showPendingBlogs:false,
  };
  toggleSidebar(): void {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('sidebar-closed');
    }
  }
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
    name: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z ]*")]),
    username: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z0-9]*@")]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  },{validators:this.passwordMatchValidator()});

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
loadUsers(){
  console.log("User loading")
  this._serv.getUsers().subscribe((data: User[])=>{
    this.users=data;
  });
}
  AddUser() {
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
    this.loadPendingBlogs();
    this.loggedUserId = this._route.snapshot.paramMap.get("id")
    this._http.getUsers().subscribe((res: User[]) => {
      this.loggedUser = res.find((element: User) => element.id == this.loggedUserId)
    })
    this.loadUsers()
    this.loadUserBlog()
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
          // location.replace('admin')

        })
    }

  }
  ViewBlog(a:any) {
    const foundBlog = this.userBlog.find((blog)=>blog.id==a);
    
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

  if (localStorage.getItem("isAdmin") == "true") {
    formValues.name = this.addBlogForm.value.title;
    formValues.authorUname = "Magzine-editor"
    formValues.author = "Magzine-editor"
    formValues.date = new Date()
    formValues.comments = []
    formValues.likes = 0
    formValues.likedUsers = []
    if (this.imageUrl == undefined) {
      formValues.image = "https://cdn.dribbble.com/userupload/4390643/file/original-27fb59109656888382920a85dcb00ef5.png?resize=1200x900"
    } else {
      formValues.image = this.imageUrl
    }
    this._serv.addBlog(formValues).subscribe(()=>{
          alert("Success")
        })
    setTimeout(() => {
      this.sections = {
        addnewuser: false,
        BlogAddshow:false,
        showUsers:false,
        showAddUser:false,
        showPendingBlogs:false,
      };
          this._rout.navigateByUrl("/admin")
          location.replace('admin')
        }, 1000);
  }

}
toggleSection(section: keyof Sections):void{
  let tog =!this.sections[section];
  this.sections = {
    addnewuser: false,
    BlogAddshow:false,
    showUsers:false,
    showAddUser:false,
    showPendingBlogs:false,
  };
  this.sections[section] = tog;  
}
tooggleSidebar():void{
  this.sidebaropen=!this.sidebaropen;
}

logout():void {
  if (confirm("Are you sure you want to Logout")) {
    localStorage.clear();
    this._serv.logout();
    this._rout.navigateByUrl('/');
  }
  console.log("ok")
  }

loadPendingBlogs():void{
  this._serv.getpendingblogs().subscribe((data)=>{
  this.pendingBlogs = data
  }); 
  // console.log(this.pendingBlogs)
}

approveBlog(blog:Blog):void{
  this.loadUserBlog();
  blog.status='approved';
  this._serv.approvedBlog(blog).subscribe(()=>{
  this.rejectBlog(blog)
  this._rout.navigateByUrl("/admin");
  location.replace('admin')

  }); 
} 
rejectBlog(blog:Blog):void{
  blog.status='rejected'
  this._serv.rejectBlog(blog).subscribe(()=>{
  this.loadPendingBlogs();
  this._rout.navigateByUrl("/admin");
  location.replace('admin')


  })
}   
}


  