import Fields from "./Fields";
interface IQueryBuilderOptions {
  operation: string;
  fields?: Fields;
  variables?: any;
}
export default IQueryBuilderOptions;
