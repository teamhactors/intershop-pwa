import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/** Monitor Request & Response */
@Injectable()
export class StatisticMonitorInterceptor implements HttpInterceptor {
  // tslint:disable-next-line:no-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTimestamp = new Date().getTime();
    return next.handle(req).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
          // tslint:disable-next-line:no-console
          console.log(
            '[STATS]',
            req.method,
            req.urlWithParams,
            res.status,
            `${new Date().getTime() - startTimestamp}ms`
          );
        }
      })
    );
  }
}
