import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

// don't forget add this service to the admin module, inside providers
@Injectable({providedIn: 'root'})
export class AuthService {

  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    // take key from environment. Get key we can here: https://console.firebase.google.com/project/angular-blog-e4ebb/overview?hl=ru
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      )
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error;

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Incorrect email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Incorrect password');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('User with this email absent');
        break;
    }

    return throwError(error);
  }

  private setToken(response: FbAuthResponse | null) {
      if (response) {
        const expIn: number = <any>response.expiresIn * 1000;
        const expDate = new Date(new Date().getTime() + expIn);
        localStorage.setItem('fb-token', response.idToken);
        localStorage.setItem('fb-token-exp', expDate.toString());
      } else {
        localStorage.clear();
      }

  }
}
