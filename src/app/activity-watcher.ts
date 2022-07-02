import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { HarLog } from './har-log';
import { HarEntry } from './har-entry';
import { Har } from './har';
import { proxyBuilder } from './builder';
import { HarRequest } from './har-request';
import { HarResponse } from './har-response';

@Injectable({
  providedIn: 'root',
})
export class ActivityWatcher {
  private log: HarLog = {} as HarLog;

  /**
   * This method resets the log for a new set of requests.
   * We create a "document" resource to glue the requests together
   * so we have the url that kicked off the other requests.
   * @param url
   */
  startNewActivity(url: string) {
    const startTime = new Date();
    this.log = {
      version: '1.2',
      creator: {
        name: 'MyApp',
        version: '1',
      },
      pages: [
        {
          startedDateTime: startTime,
          id: 'page_1',
          title: this.getUrl(url),
          pageTimings: {} as any,
        },
      ],
      entries: [
        {
          _initiator: {
            type: 'script',
          },
          _resourceType: 'document',
          cache: {},
          connection: '',
          pageref: 'page_1',
          request: proxyBuilder<HarRequest>()
            .method('GET')
            .url(this.getUrl(url))
            .httpVersion('')
            .headers([])
            .queryString([])
            .cookies([])
            .headersSize(-1)
            .bodySize(-1).build()
          ,
          response: {
            status: 200,
            statusText: '',
            httpVersion: '',
            headers: [],
            cookies: [],
            content: {
              size: 0,
              mimeType: 'text/html',
              text: 'Generated',
            },
            redirectURL: '',
            headersSize: -1,
            bodySize: -1,
          },
          serverIPAddress: '::1',
          startedDateTime: startTime,
          time: 0,
          timings: {
            blocked: -1,
            dns: -1,
            ssl: -1,
            connect: -1,
            send: -1,
            wait: -1,
            receive: -1,
          },
        },
      ],
    };
  }

  /**
   * Creates a new entry for the given http request.
   * @param request
   * @param startTime
   */
  addRequest(request: HttpRequest<any>, startTime: Date) {
    try {
      if (!request) {
        return;
      }
      request = request.clone();
      const entry: HarEntry = {
        _initiator: {
          type: 'script',
        },
        _resourceType: 'hxr',
        cache: {},
        connection: '',
        pageref: 'page_1',
        request:  proxyBuilder<HarRequest>()
          .method(request.method)
          .url(this.getUrl(request.url))
          .httpVersion('')
          .headers(request.headers?.keys().map((k) => {
            return {
              name: k,
              value: request.headers.get(k) ?? '',
            };
          }))
          .queryString(request.params?.keys().map((k) => {
            return {
              name: k,
              value: request.params.get(k) ?? '',
            };
          }))
          .cookies([])
          .headersSize(-1)
          .bodySize(-1)
          .build(),
        response: {} as any,
        serverIPAddress: '::1',
        startedDateTime: startTime,
        time: 0,
        timings: {
          blocked: -1,
          dns: -1,
          ssl: -1,
          connect: -1,
          send: -1,
          wait: -1,
          receive: -1,
        },
      };
      if (request.body) {
        entry.request.postData = {
          mimeType: 'application/json', // todo not sure if there's any way to get this
          text: JSON.stringify(request.body),
        };
      }
      this.log.entries.push(entry);
    } catch {
      // we don't want an error here to cause additional problems.
    }
  }

  /**
   * Updates a previously added entry with a response body.
   * @param response
   * @param startTime
   */
  addResponse(response: HttpResponse<any>, startTime: Date) {
    try {
      response = response.clone();
      const entry = this.log.entries.find(
        (x) => x.request.url === response.url && x.startedDateTime === startTime
      );
      if (!entry) {
        return;
      }
      entry.response = proxyBuilder<HarResponse>()
        .status(response.status)
        .statusText(response.statusText)
        .httpVersion('')
        .headers(response.headers?.keys().map((k) => {
          return {
            name: k,
            value: response.headers.get(k) ?? '',
          };
        }))
        .cookies([])
        .content({
          size: response.body?.length || 0,
          mimeType: 'application/json', // todo not sure if there's any way to get this
          text: JSON.stringify(response.body),
        })
        .redirectURL('')
        .headersSize(-1)
        .bodySize(-1).build();

      const delay = new Date().getTime() - entry.startedDateTime.getTime();
      entry.timings.wait = delay;
      entry.time = delay;
    } catch {
      // we don't want an error here to cause additional problems.
    }
  }

  /**
   * If the request fails, add the error messages as the response body instead.
   * @param error
   * @param startTime
   */
  addError(error: HttpErrorResponse, startTime: Date) {
    if (!error) {
      return;
    }
    try {
      const entry = this.log.entries.find(
        (x) => x.request.url === error.url && x.startedDateTime === startTime
      );
      if (!entry) {
        return;
      }
      entry.response = proxyBuilder<HarResponse>()
        .status(error.status)
        .statusText(error.statusText)
        .httpVersion('')
        .headers(error.headers?.keys().map((k) => {
          return {
            name: k,
            value: error.headers.get(k) ?? '',
          };
        }))
        .cookies([])
        .content({
          size: error.error?.length || 0,
          mimeType: 'application/json', // todo not sure if there's any way to get this
          text: JSON.stringify(error.error),
        })
        .redirectURL('')
        .headersSize(-1)
        .bodySize(-1).build();

      const delay = new Date().getTime() - entry.startedDateTime.getTime();
      entry.timings.wait = delay;
      entry.time = delay;
    } catch {
      // we don't want an error here to cause additional problems.
    }
  }

  /**
   * Turns the log into a json string, then into a blog and then into a data url.
   */
  getHar() {
    const har: Har = {
      log: this.log,
    };
    const blob = new Blob([JSON.stringify(har)], {
      type: 'application/json',
    });
    return window.URL.createObjectURL(blob);
  }

  private getUrl(url: string): string {
    //check to see if the link is external or not
    if (!url.startsWith('http')) {
      return `${window.location.origin}/${url}`
    }
    return url;
  }
}
