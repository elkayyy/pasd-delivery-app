import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { concatMap, Observable, take, tap } from 'rxjs';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss'],
})
export class TestingComponent {
  private _pasdUrl = 'https://pasd-webshop-api.onrender.com/';

  private _pasdApiKey = '38j4gsAHGr3YS4ANPULG';

  testList$: Observable<any>;
  pasdOrderList$: Observable<any>;

  testEntry = {
    name: 'Abigail',
    age: '27',
    type: 'test',
  };

  testEntryPut = { name: 'Barb', age: '36', type: 'production' };

  deleteId = '';
  putId = '';

  constructor(private http: HttpClient) {}

  setTestList = () => {
    this.testList$ = this.http.get<Record<string, any>>(
      environment.firebase.url + 'test-list.json'
    );
  };

  sendTestEntry = () => {
    this.testList$ = this.http
      .post(environment.firebase.url + 'test-list.json', this.testEntry)
      .pipe(
        concatMap(() =>
          this.http.get<Record<string, any>>(
            environment.firebase.url + 'test-list.json'
          )
        )
      );
  };

  putTestEntry = () => {
    this.testList$ = this.http
      .put(
        environment.firebase.url + 'test-list/' + this.putId + '.json',
        this.testEntryPut
      )
      .pipe(
        concatMap(() =>
          this.http.get<Record<string, any>>(
            environment.firebase.url + 'test-list.json'
          )
        )
      );
  };

  deleteTestList = () => {
    this.testList$ = this.http
      .delete(environment.firebase.url + 'test-list.json')
      .pipe(
        concatMap(() =>
          this.http.get<Record<string, any>>(
            environment.firebase.url + 'test-list.json'
          )
        )
      );
  };

  deleteTestEntry = () => {
    this.testList$ = this.http
      .delete(environment.firebase.url + 'test-list/' + this.deleteId + '.json')
      .pipe(
        concatMap(() =>
          this.http.get<Record<string, any>>(
            environment.firebase.url + 'test-list.json'
          )
        )
      );
  };

  setPasdOrderList = () => {
    this.pasdOrderList$ = this.http.get(this._pasdUrl + 'api/order', {
      headers: new HttpHeaders()
        .set('accept', 'application/json')
        .set('x-api-key', this._pasdApiKey)
        .set('access-control-allow-origin', '*'),
    });
  };
}
