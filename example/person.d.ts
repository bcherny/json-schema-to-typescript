export interface Person {
  "firstName": string;
  "lastName": string;
  /**
   * Age in years
   */
  "age"?: number;
  "hairColor"?: "black" | "brown" | "blue";
  [k: string]: any;
}