import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse, HttpStatusCode
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {ActivityWatcher} from './activity-watcher';
import {tap} from 'rxjs/operators';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  constructor(private readonly activityWatcher: ActivityWatcher) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const exclude = ['/api/auth'];
    const startTime = new Date();
    if (!exclude.includes(req.url)) {
      this.activityWatcher.addRequest(req, startTime);
    }

    if (req.url === 'api/fake') {
      const response = createFakeResponse();

      this.activityWatcher.addResponse(response, startTime);

      return of(response);
    }

    return next.handle(req).pipe(
      tap(
        (response) => {
          if (response instanceof HttpResponse) {
            if (!exclude.includes(req.url)) {
              this.activityWatcher.addResponse(response, startTime);
            }
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== HttpStatusCode.Unauthorized) {
              if (!exclude.includes(req.url)) {
                this.activityWatcher.addError(err, startTime);
              }
              return;
            }
          }
        }
      )
    );
  }
}
function createFakeResponse(): HttpResponse<any> {
  return new HttpResponse({
    status: 200, body: {
      source: 'local',
      message: 'this represents a local api call'
    },
    url: `${window.location.origin}/api/fake`
  });
}

