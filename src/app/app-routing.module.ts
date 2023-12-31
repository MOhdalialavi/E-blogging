import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { BlogsResolveGuard } from './blogs-resolve.guard';
import { NotLoggedInGuard } from './not-logged-in.guard';
import { ShowBlogComponent } from './show-blog/show-blog.component';
import { UserLoginComponent } from './userLogin/userLogin.component';
import { UserSignUpComponent } from './userSignUp/userSignUp.component';
import { NotLoggedInResolver } from './NotLoggedInResolver'; // Update the path


const routes: Routes = [
  {
    path: "",
    // redirectTo: '/home', pathMatch: 'full',
    component: ShowBlogComponent,
    resolve: {
      data: BlogsResolveGuard
    }
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
    // canActivate:[NotLoggedInGuard]
  },
  {
    path: 'userLogged',
    loadChildren: () => import('./user/user.module')
      .then(mod => mod.UserModule)
  },
  {
    path: "userSignUp",
    component: UserSignUpComponent
  },
  {
    path: 'admin',
    // canActivate: [NotLoggedInGuard], // Use NotLoggedInGuard
    resolve: {
      data: NotLoggedInResolver
    },
    component: AdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
