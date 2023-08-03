import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { UserRoutingModule } from './user-routing.module';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { ViewBlogComponent } from './view-blog/view-blog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MyBlogsComponent } from './myBlogs/myBlogs.component';
import { WordLimitterPipe } from './myBlogs/wordLimitter.pipe';


// test for lazy loading
console.log("Lazy Load");


@NgModule({
  declarations: [
    AddBlogComponent,
    ViewBlogComponent,
    MyBlogsComponent,
    WordLimitterPipe
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    MatSnackBarModule
  ]
})
export class UserModule { }