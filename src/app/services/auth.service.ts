import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, take } from 'rxjs';
import { UserService } from '../components/user-list/user.service';
import { User } from '../model/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user$ = new BehaviorSubject<User | undefined>(undefined);
  user$: Observable<User | undefined> = this._user$;

  private _loginErrorMessage$ = new BehaviorSubject<string>('');
  loginErrorMessage$: Observable<string> = this._loginErrorMessage$;

  constructor(private router: Router, private userS: UserService) {}

  login = (name: string) => {
    this.userS
      .getUserList()
      .pipe(take(1))
      .subscribe((userList) => {
        const possibleUser = userList.find((user) => user.name === name);
        this._user$.next(possibleUser);
        if (possibleUser) {
          this._loginErrorMessage$.next('');
          this.router.navigateByUrl('/home');
          return;
        }
        this._loginErrorMessage$.next('Please check Your credentials.');
      });
  };

  logout = () => {
    this._user$.next(undefined);
  };
}
