export interface HarRequest {
  /**
   * The request method.
   */
  method: string;
  /**
   * The absolute url of the request (excluding fragments).
   */
  url: string;
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
  /**
   * A list of the individual objects in the query string
   */
  queryString: {
    name: string;
    value: string;
  }[];
  /**
   * A list of cookie objects
   */
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
  /**
   * The total number of bytes in the http request up to and including the double CRLF before the start of the request body
   */
  headersSize: number;
  /**
   * The total number of bytes in the http request body
   */
  bodySize: number;
  postData?: {
    mimeType: string;
    text: string;
  };
}
