import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { BlogAppService } from '../Services/blog-app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/user';
import { loginUser } from '../models/userLogin';

@Component({
  selector: 'app-userLogin',
  templateUrl: './userLogin.component.html',
  styleUrls: ['./userLogin.component.css']
})

export class UserLoginComponent {

  hide = true;
  loginCredentials:loginUser=new loginUser()

  constructor(
    private serv: BlogAppService,
    private _rout: Router,
    private _snackBar: MatSnackBar) { }

    login() {
      this.serv.getUsers().subscribe((res: User[]) => {
        const currentUser = res.find((element: User) => element.username === this.loginCredentials.username);

      if (!currentUser) {
        alert('No user found');
        return;
      }
        if (this.loginCredentials.username === 'admin@gmail' && this.loginCredentials.password === 'admin') {
        localStorage.setItem("userLoggedIn", currentUser.id)
        localStorage.setItem("loggedUser", currentUser.name)
        localStorage.setItem("isAdmin","true");
        this._rout.navigateByUrl("/admin");
        } else if (currentUser.password === this.loginCredentials.password) {
          localStorage.setItem('userLoggedIn', currentUser.id);
          localStorage.setItem('loggedUser', currentUser.name);
          localStorage.setItem("isAdmin","false")
          this._snackBar.open('Login success', '', { duration: 2 * 1000 });
          setTimeout(() => {
            this._rout.navigateByUrl('');
          }, 1000);
          } else {
            alert("Wrong password")
          }
        });
      }
    }
    

