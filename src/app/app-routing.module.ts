import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogsResolveGuard } from './blogs-resolve.guard';
import { NotLoggedInGuard } from './not-logged-in.guard';
import { ShowBlogComponent } from './show-blog/show-blog.component';
import { UserLoginComponent } from './userLogin/userLogin.component';
import { UserSignUpComponent } from './userSignUp/userSignUp.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: '/home', pathMatch: 'full',
    // component: ShowBlogComponent,
    // resolve: {
    //   data: BlogsResolveGuard
    // }
  },{
    path: 'home',
    component: ShowBlogComponent,
    resolve: {
      data: BlogsResolveGuard
    }
  },
  
  {
    path: 'userLogin',
    component: UserLoginComponent,
    canActivate:[NotLoggedInGuard]
  },
  {
    path: 'userLogged',
    loadChildren: () => import('./user/user.module')
      .then(mod => mod.UserModule)
  },
  {
    path: "userSignUp",
    component: UserSignUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
