import Fields from "./Fields";
import IQueryBuilderOptions from "./IQueryBuilderOptions";
export default class Utils {
  static resolveVariables(operations: IQueryBuilderOptions[]): any;
  static queryFieldsMap(fields?: Fields): string;
  static queryVariablesMap(
    variables: any
  ): {
    [key: string]: unknown;
  };
  static queryDataType(variable: any): string;
}
