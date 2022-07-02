import { HarRequest } from "./har-request";
import { HarResponse } from "./har-response";

export interface HarEntry {
  _initiator: {
    type: 'script' | 'parser' | 'other';
  };
  _resourceType: 'document' | 'script' | 'hxr';
  cache: {};
  connection: string;
  /**
   * Reference to the parent page id. This may be null.
   */
  pageref: string;
  /**
   * Represents a single http request inside the HTTP Archive.
   */
  request: HarRequest;
  response: HarResponse;
  /**
   * The IP address of the server that was connected.
   */
  serverIPAddress: string;
  /**
   * The date and time stamp for the beginning of the request.
   */
  startedDateTime: Date;
  /**
   * The total elapsed time of the request in milliseconds. It is the sum of all the timings available
   * in the timings object (not including undefined values).
   */
  time: number;
  timings: {
    /**
     * The time in milliseconds spent waiting for a network connection.
     */
    blocked: number;
    /**
     * The time in milliseconds spent in DNS resolution of the host name.
     */
    dns: number;
    /**
     * The time in milliseconds spent negotiating the SSL/TLS session.
     */
    ssl: number;
    /**
     * The time in milliseconds spent making the TCP connection.
     */
    connect: number;
    /**
     * The time in milliseconds spent sending the request to the server.
     */
    send: number;
    /**
     * The time in milliseconds spent waiting for a response from the server.
     */
    wait: number;
    /**
     * The time in milliseconds spent reading the response from the server.
     */
    receive: number;
  };
}
