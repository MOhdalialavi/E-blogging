import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowBlogComponent } from './show-blog/show-blog.component';
import { WordLimitterPipe } from './show-blog/wordLimitter.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {UserLoginComponent} from './userLogin/userLogin.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSignUpComponent } from './userSignUp/userSignUp.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from './material/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AdminComponent } from './admin/admin.component';
import { LocalStorage } from 'ngx-webstorage';

@NgModule({
  declarations: [	
    AppComponent,
    ShowBlogComponent,
    WordLimitterPipe,
    HeaderComponent,
    UserLoginComponent,
    UserSignUpComponent,
    AdminComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatTabsModule,
    MatIconModule,
    MaterialModule,
    MatMenuModule,
    FormsModule,
    MatAutocompleteModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
