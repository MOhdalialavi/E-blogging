import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import { Blog } from 'src/app/models/blog';
import { User } from 'src/app/models/user';
import { BlogAppService } from 'src/app/Services/blog-app.service';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit {

  loggedUserId?: string | null
  imageUrl?: string|null|ArrayBuffer
  loggedUser?: User
  constructor(
    private serv: BlogAppService,
    private route: ActivatedRoute,
    private _http: BlogAppService,
    private _rout: Router) { }

  ngOnInit(): void {

    // took the current user id from parametrs and retrived the full object of current user
    this.loggedUserId = this.route.snapshot.paramMap.get("id")
    this._http.getUsers().subscribe((res: User[]) => {
      this.loggedUser = res.find((element: User) => element.id == this.loggedUserId)
    })
  }

  // reads the url of image when choose any image in input:file using fileReader and saved the url to imageUrl variable
  onselectFile(event:Event): void {
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

  // adding the additional details and image url of the blog and sending post request
  addBlog(formValues: Blog): void {

    // loggedUser is possibly undefined.
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
      this.serv.addBlog(formValues).subscribe(()=>{
        alert("Success")
      })
      setTimeout(() => {
        this._rout.navigateByUrl("")
      }, 1000);
    }
  }
}