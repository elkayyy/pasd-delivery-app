import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/model/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserList = () =>
    this.http
      .get(environment.firebase.url + 'user-list.json')
      .pipe(
        map((res) =>
          Object.entries(res).map((entry) => ({ ...entry[1], id: entry[0] }))
        )
      );
  updateUser = (user: User) =>
    this.http.put(
      environment.firebase.url + 'user-list/' + user.id + '.json',
      user
    );
  createUser = (user: User) =>
    this.http.post(environment.firebase.url + 'user-list.json', user);
  deleteUser = (id: string) =>
    this.http.delete(environment.firebase.url + 'user-list/' + id + '.json');
}
