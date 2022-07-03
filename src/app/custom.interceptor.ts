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

  private exclude = ['/api/auth'];

  constructor(private readonly activityWatcher: ActivityWatcher) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const startTime = new Date();
    if (!this.exclude.includes(req.url)) {
      this.activityWatcher.addRequest(req, startTime);
    }

    if (req.url === 'api/fake') {
      const response = this.createFakeResponse();

      this.activityWatcher.addResponse(response, startTime);

      return of(response);
    }

    return next.handle(req).pipe(
      tap(
        (response) => this.handleResponse(response, req, startTime),
        (err: any) => this.handleError(err, req, startTime)
      )
    );
  }

  createFakeResponse(): HttpResponse<any> {
    return new HttpResponse({
      status: 200, body: {
        source: 'local',
        message: 'this represents a local api call'
      },
      url: `${window.location.origin}/api/fake`
    });
  }

  handleResponse(response: HttpEvent<any>, req: HttpRequest<any>, startTime: Date) {
    if (response instanceof HttpResponse) {
      if (!this.exclude.includes(req.url)) {
        this.activityWatcher.addResponse(response, startTime);
      }
    }
  }

  handleError(err: any, req: HttpRequest<any>, startTime: Date) {
    if (err instanceof HttpErrorResponse) {
      if (err.status !== HttpStatusCode.Unauthorized) {
        if (!this.exclude.includes(req.url)) {
          this.activityWatcher.addError(err, startTime);
        }
        return;
      }
    }
  }
}
