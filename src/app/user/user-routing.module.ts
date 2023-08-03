import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { AllBlogsResolveGuard } from './all-blogs-resolve.guard';
import { LoginGuard } from './login.guard';
import { MyBlogsResolveGuard } from './my-blogs-resolve.guard';
import { MyBlogsComponent } from './myBlogs/myBlogs.component';
import { ViewBlogComponent } from './view-blog/view-blog.component';

const routes: Routes = [
  {
    path:'addBlog/:id',
    component:AddBlogComponent,
    canActivate:[LoginGuard],
  },
  {
    path:'viewBlog/:id',
    component:ViewBlogComponent,
    canActivate:[LoginGuard],
    resolve:{
      allBlogs:AllBlogsResolveGuard
    }
  },
  {
    path:'myBlog',
    component:MyBlogsComponent,
    canActivate:[LoginGuard],
    resolve:{
      myBlogs:MyBlogsResolveGuard
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
