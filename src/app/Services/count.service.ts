import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountService {

  //creating a behavior subject with initial value 0 
  public countSubject = new BehaviorSubject<number>(0)
  public countSub$: Observable<number> = this.countSubject;
  
  //creating a behavior subject with initial value 0 
  public userCountSubject = new BehaviorSubject<number>(0)
  public userCountSub$: Observable<number> = this.userCountSubject;
  // update function for blogsCount
  updateCount(data: number):void {
    this.countSubject.next(data)
  }

  // update function for userCount
  updateUserCount(data: number) :void{
    this.userCountSubject.next(data)
  }

}
