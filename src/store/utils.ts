import { Row } from "tinybase";

type CodedEntity = { code: string } & Row;

/**
 * Transform an array of arkhamdb-json-data into an index { [code]: data }.
 */
export function indexedByCode(arr: CodedEntity[]): Record<string, Row> {
  return arr.reduce((acc, curr) => {
    acc[curr.code] = curr;
    return acc;
  }, {} as Record<string, Row>);
}
