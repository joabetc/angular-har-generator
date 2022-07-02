export interface HarPage {
  /**
   * the date and time stamp for the beginning of the page load.
   */
   startedDateTime: Date;
   /**
    * The unique identifier of a page within the Archive.
    */
   id: string;
   /**
    * The page title.
    */
   title: string;
   /**
    * Represents detailed timing of page within the HTTP Archive.
    */
   pageTimings: {
     /**
      * The number of milliseconds since startedDateTime that the content of the page loaded.
      */
     onContentLoad: number;
     /**
      * The number of milliseconds since $har->page()->started_date_time() that the page loaded.
      */
     onLoad: number;
   };
}
