import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { environment } from '../../environments/environment';
import { ElectronService } from './electron.service';
import * as path from 'path';
import * as uuid from 'uuidv4';
import { GsapiService } from './gsapi.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private DEV = false;

  constructor(
    private electronService: ElectronService,
    private gsApiService: GsapiService,
  ) {

    // resume session
    if (this.DEV) console.log('[Session.Service] constructor(): restoring session');
    var savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        if (this.DEV) console.log('[Session.Service] constructor(): session restored');
        this.setToken(savedToken);
      } catch (ex) {
      }
    }

  }


  private _email = '';
  private _username = '';
  private _expire = '0';
  private _token = '';

  public get email() : string {
    return this._email;
  }
  public get username() : string {
    return this._username;
  }
  public get expire() : string {
    return this._expire;
  }

  public get token() : string {
    if (this._token) {
      try {
        this.validateToken(this._token);
        return this._token;
      } catch (ex) {
        console.warn('[Session.Service] get token(): Token not valid: ', ex);
        return '';
      }
    }
  }

  private setToken(token: string) : void {
    if (token) {
      var tokenBody = this.validateToken(token);
      this._email = tokenBody['email'];
      this._username = tokenBody['username'];
      this._expire = tokenBody['exp'];
      this._token = token;
      localStorage.setItem('token', token);
    } else {
      this.killSession();
    }
  }


  private killSession() {
    localStorage.removeItem('token');
    this._email = '';
    this._expire = '';
    this._token = '';
    this._username = '';
  }


  private validateToken(token: string) : object {
    // console.log('SessionService: validateToken(' + token + ')');
    try {
      if (!token) {
        throw 'token not set';
      }
      var splitToken = token.split('.');
      if (splitToken.length !== 3) {
        throw 'failed to split token';
      }
      try {
        var tokenBodyJSON = atob(splitToken[1]);
        var tokenBody = JSON.parse(tokenBodyJSON);
      } catch (ex) {
        throw 'failed to parse token body';
      }
      var now = moment().toISOString();
      var exp = tokenBody['exp'];
      if (exp <= now) {
        throw 'token expired';
      }
      return tokenBody;
    } catch (ex) {
      throw '[Session.Service] validateToken(): ' + ex;
    }
  }




  public userProfile(): void {
    this.electronService.remote.shell.openExternal(`${environment.identityProvider}/landing.php?from-application=${environment.appName}&redirect=/profile&token=${this.token}`);
  }

  signInStatusInterval = null;




  public signIn(callback: Function): void {
    var authId = uuid();
    var signInUrl = `${environment.identityProvider}/signin?forApp=${environment.appName}&redirect=false&authId=${authId}`;

    console.log('[Session.Service] signIn(): Open sign in window');

    this.electronService.remote.shell.openExternal(signInUrl);

    if (this.signInStatusInterval !== null) {
      clearInterval(this.signInStatusInterval);
    } 
    this.signInStatusInterval = setInterval(() => {
      try {
        this.gsApiService.get('/20190605.account/checkAuthId?authId=' + authId)
        .subscribe(response => {
          // console.log(response);
          if (response.success) {
            this.setToken(response.data);
            clearInterval(this.signInStatusInterval);
            this.signInStatusInterval = null;
            callback();
          } else {
          }
        });

      } catch (ex) {
      }
    }, 1000);


  }

  public signOut(): void {
    this.killSession();
  }

}
