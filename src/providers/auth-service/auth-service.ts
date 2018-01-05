import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from "@ionic/storage";
import { BaseUrl } from "../base-url";
import "rxjs/add/operator/map";
import "rxjs/add/operator/timeout";

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  urlMaster: string = BaseUrl.BASE_API_URL;

  constructor(public http: Http, private storage: Storage) {
    console.log('Hello AuthServiceProvider Provider');
  }

  public login(credentials) {
    if (credentials.email === null || credentials.password === null || credentials.userType === null) {
      return Observable.throw("Please insert credentials");
    } else {
      let headers = new Headers({
        'Content-Type': 'application/json'
      });

      let options = new RequestOptions({
        headers: headers
      });

      let body = JSON.stringify(credentials);

      var url = this.urlMaster+'/api/'+credentials.userType+'/login';
      var response = this.http.post(url,body,options)
        .map(res => res.json())
        .timeout(5000);
      return response;
    }
  }

  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public logout(credentials) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let options = new RequestOptions({
      headers: headers
    });

    var url = this.urlMaster+'/api/'+credentials.principalType+'s/logout?access_token='+credentials.id;
    var response = this.http.post(url,options)
      .map(res => res.json())
      .timeout(5000);
    return response;
  }

}
