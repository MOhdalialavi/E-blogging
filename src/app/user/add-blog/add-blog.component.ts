import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from 'src/app/models/blog';
import { User } from 'src/app/models/user';
import { BlogAppService } from 'src/app/Services/blog-app.service';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit {

  loggedUserId?: string | null;
  imageUrl?: string | null | ArrayBuffer;
  loggedUser?: User;
  pendingBlogs: Blog[] = [];

  constructor(
    private serv: BlogAppService,
    private route: ActivatedRoute,
    private _http: BlogAppService,
    private _rout: Router
  ) {}

  ngOnInit(): void {

    this.loggedUserId = this.route.snapshot.paramMap.get("id");
    this._http.getUsers().subscribe((res: User[]) => {
      this.loggedUser = res.find((element: User) => element.id == this.loggedUserId);
    });
  }

  

  onselectFile(event: Event): void {
    let ev = event.target as HTMLInputElement;
    if (ev.files) {
      let reader = new FileReader();
      reader.readAsDataURL(ev?.files[0]);
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          this.imageUrl = event.target.result;
        }
      };
    }
  }

  addBlog(formValues: Blog): void {
    if (this.loggedUser) {
      formValues.authorUname = this.loggedUser.username;
      formValues.author = this.loggedUser.name;
      formValues.date = new Date();
      formValues.comments = [];
      formValues.likes = 0;
      formValues.likedUsers = [];
      formValues.status = 'pending'; // Add the status property
      if (this.imageUrl == undefined) {
        formValues.image = "https://cdn.dribbble.com/userupload/4390643/file/original-27fb59109656888382920a85dcb00ef5.png?resize=1200x900";
        // https://www.kindpng.com/picc/m/320-3203444_blog-subscribe-widget-computer-icons-free-download-hd.png";
      } else {
        formValues.image = this.imageUrl;
      }
      formValues.id = Date.now() +Math.floor(Math.random()*1000)
      
      // this.serv.addBlog(formValues).subscribe(() => {
      // });
      this.serv.fetchPendingBlogs(formValues).subscribe(() => {
        // alert("Blog has been submitted for approval");
      });
      alert("Blog has been submitted for approval");
      setTimeout(() => {
        this._rout.navigateByUrl("");
      }, 1000);
    }
  }
}
