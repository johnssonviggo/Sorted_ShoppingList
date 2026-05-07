import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Router } from '@angular/router';
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";


@Injectable()
export class AuthInceptor implements HttpInterceptor {
    
    constructor(private router: Router) { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        const token = localStorage.getItem('token');

        let cloned = req;

        if (token) {
            cloned = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(cloned).pipe(
            catchError((error: HttpErrorResponse) => {

                if (error.status === 401 || error.status === 403) {
                    localStorage.removeItem('token');
                    this.router.navigate(['/login']);
                }

                return throwError(() => error);
            })
        )
    }
}