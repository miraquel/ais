import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";
import { BaseUrl } from "../base-url";
import "rxjs/add/operator/map";
import "rxjs/add/operator/timeout";

/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {
  urlMaster: string = BaseUrl.BASE_API_URL;

  constructor(public http: Http) {
    console.log('Hello UserServiceProvider Provider');
  }

  public findById(user) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    var url = this.urlMaster+'/api/'+user.principalType+'s/'+user.userId;
    var response = this.http.get(url)
      .map(res => res.json())
      .timeout(5000);
    return response;
  }

  public updateUser(data, user) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let options = new RequestOptions({
      headers: headers
    });

    let body = JSON.stringify(data);

    var url = this.urlMaster+'/api/'+user.principalType+'s/'+user.userId;
    var response = this.http.patch(url, body, options)
      .map(res => res.json())
      .timeout(5000);
    return response;
  }

  public verifyAccessToken(accessToken) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    var url = this.urlMaster+'/api/'+accessToken.principalType+'s/'+accessToken.userId+'/accessTokens/'+accessToken.id;
    var response = this.http.get(url)
      .map(res => res.json())
      .timeout(5000);
    return response;
  }
}
