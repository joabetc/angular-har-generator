export interface HarResponse {
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
}
