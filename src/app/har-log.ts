import { HarPage } from './har-page';
import { HarEntry } from './har-entry';

export interface HarLog {
  /**
   * the version of the HTTP Archive
   */
   version: '1.1' | '1.2';
   /**
    * Represents the creator (software) of the HTTP Archive.
    */
   creator: {
     /**
      * The name of the Creator.
      */
     name: string;
     /**
      * The version of the Creator.
      */
     version: string;
   };
   /**
    * Represents pages inside the HTTP Archive
    */
   pages: HarPage[];
   /**
    * Represents http request/response pairs inside the HTTP Archive
    */
   entries: HarEntry[];
}
