import { HarRequest } from "./har-request";

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
  response: {
    /**
     * The numeric status of the response.
     */
    status: number;
    /**
     * The status text of the response.
     */
    statusText: string;
    /**
     * The version of the http request
     */
    httpVersion: string;
    /**
     * A list of http header objects.
     */
    headers: {
      name: string;
      value: string;
    }[];
    cookies: {
      /**
       * The name of the cookie.
       */
      name: string;
      /**
       * The value of the cookie.
       */
      value: string;
      /**
       * The expiry date (if any) of the cookie.
       */
      expires: Date;
      /**
       * If the cookie is marked as httpOnly
       */
      httpOnly: boolean;
      /**
       * If the cookie is marked as secure, to only be transmitted over https.
       */
      secure: boolean;
    }[];
    content: {
      /**
       * The length of the returned content in bytes.
       */
      size: number;
      /**
       * The mime type of the response text. The charset attribute is included if available
       */
      mimeType: string;
      /**
       * The plain text response. If this field is not HTTP decoded, then the encoding field may be used
       */
      text: string;
    };
    /**
     * The content of the Location header of the response, if any.
     */
    redirectURL: string;
    /**
     * The total number of bytes in the http response up to and including the double CRLF before the start of the response body
     */
    headersSize: number;
    /**
     * The total number of bytes in the http response body.
     */
    bodySize: number;
  };
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
