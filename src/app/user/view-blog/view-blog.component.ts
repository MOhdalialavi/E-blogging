import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Blog } from 'src/app/models/blog';
import { comment } from 'src/app/models/comment';
import { User } from 'src/app/models/user';
import { BlogAppService } from 'src/app/Services/blog-app.service';
import { LikeService } from 'src/app/like.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { likedUser } from 'src/app/models/likedUsers';
import { toHtml } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.css']
})
export class ViewBlogComponent implements OnInit {
  post = {
    id: 1,
    likeCount: 0
  };

  currentBlogId: number | null = 0;
  currentBlog: Blog | undefined;
  comments: comment[] = [];
  currentUser: User | undefined;
  faUser = faUser;
  number: number | null = 0
  likes: number | null = 0
  username: any = ""

  allBlogs: Blog[] = [];

  constructor(
    private route: ActivatedRoute,
    private likeService: LikeService,
    private http: HttpClient,
    private serv: BlogAppService
  ) { }

  addCommentForm = new FormGroup({
    review: new FormControl(''),
    username: new FormControl(''),
    id: new FormControl('')
  });

  ngOnInit(): void {

    this.currentBlogId = JSON.parse(this.route.snapshot.paramMap.get('id') || '');

    this.allBlogs = this.route.snapshot.data['allBlogs'];
    this.blogs();
    this.serv.getUsers().subscribe((res: User[]) => {
      this.currentUser = res.find((user: User) => user.id == localStorage.getItem('userLoggedIn'));
      console.log(this.currentUser?.username)
      this.username = this.currentUser?.username;

    });
  }


  likePost(postId: number): void {

    this.serv.getBlogs().subscribe((res: Blog[]) => {
      const clickedBlog = res.find((blog: Blog) => blog.name === this.currentBlog?.name);

      if (clickedBlog) {
        const likes = clickedBlog!.likes
        const index = clickedBlog?.likedUsers.indexOf(this.username);
        console.log(this.username)
        if (index !== -1) {
          console.log('Element found at index:', index);
          // const newLikeCount = this.currentBlog?.likes! -1
          clickedBlog.likes = likes - 1
          clickedBlog?.likedUsers.splice(index!, 1)
        } else {
          console.log('Element not found');
          clickedBlog.likes = likes + 1
          clickedBlog.likedUsers.push(this.username)

        }



        // clickedBlog.as[0]=33
        this.serv.addLikes(this.currentBlogId, clickedBlog).subscribe(() => {
          this.currentBlog = clickedBlog;
        });
      }
      this.serv.addLikes(this.currentBlogId, clickedBlog).subscribe((res: any) => {
        this.addCommentForm.value.review = '';
        location.replace('userLogged/viewBlog/' + this.currentBlogId);
        this.blogs();
      });
    });
  }



  blogs() {
    if (this.allBlogs) {
      this.currentBlog = this.allBlogs.find((element: Blog) => element.id == this.currentBlogId);

      console.log(this.currentBlog?.likedUsers)




      if (this.currentBlog) {
        this.comments = this.currentBlog.comments;

        if (this.currentBlog.likes) {
          console.log(this.currentBlog.likes)
          this.likes = this.currentBlog.likes
        } else {
          this.likes = 0
        }
      }

    }

  }

  addComment(): void {
    this.serv.getBlogs().subscribe((res: Blog[]) => {
      let newId: string = '';
      let clickedBlog = res.find((blog: Blog) => blog.name == this.currentBlog?.name);
      this.addCommentForm.value.username = this.currentUser?.username;
      if (clickedBlog) {
        let length = clickedBlog.comments.length;
        if (length > 0) {
          newId = <string>clickedBlog?.comments[length - 1]?.id + 1;
        }
      }

      this.addCommentForm.value.id = newId;

      clickedBlog?.comments.push(this.addCommentForm.value);
      clickedBlog?.likedUsers.splice(0, clickedBlog?.likedUsers.length);

      clickedBlog!.likes = 0


      this.serv.addComment(this.currentBlogId, clickedBlog).subscribe((res: any) => {
        this.addCommentForm.value.review = '';
        location.replace('userLogged/viewBlog/' + this.currentBlogId);
        this.blogs();
      });
    });
  }
}
