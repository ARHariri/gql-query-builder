"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OperationType_1 = require("../OperationType");
var Utils_1 = require("../Utils");
var DefaultAppSyncMutationAdapter = /** @class */ (function () {
    function DefaultAppSyncMutationAdapter(options) {
        if (Array.isArray(options)) {
            this.variables = Utils_1.default.resolveVariables(options);
        }
        else {
            this.variables = options.variables;
            this.fields = options.fields;
            this.operation = options.operation;
        }
    }
    DefaultAppSyncMutationAdapter.prototype.mutationBuilder = function () {
        return this.operationWrapperTemplate(this.variables, this.operationTemplate(this.operation));
    };
    DefaultAppSyncMutationAdapter.prototype.mutationsBuilder = function (mutations) {
        var _this = this;
        var content = mutations.map(function (opts) {
            _this.operation = opts.operation;
            _this.variables = opts.variables;
            _this.fields = opts.fields;
            return _this.operationTemplate(opts.operation);
        });
        return this.operationWrapperTemplate(Utils_1.default.resolveVariables(mutations), content.join("\n  "));
    };
    // Convert object to name and argument map. eg: (id: $id)
    DefaultAppSyncMutationAdapter.prototype.queryDataNameAndArgumentMap = function () {
        return this.variables && Object.keys(this.variables).length
            ? "(" + Object.keys(this.variables).reduce(function (dataString, key, i) {
                return "" + dataString + (i !== 0 ? ", " : "") + key + ": $" + key;
            }, "") + ")"
            : "";
    };
    DefaultAppSyncMutationAdapter.prototype.queryDataArgumentAndTypeMap = function (variables) {
        return Object.keys(variables).length
            ? "(" + Object.keys(variables).reduce(function (dataString, key, i) {
                return "" + dataString + (i !== 0 ? ", " : "") + "$" + key + ": " + Utils_1.default.queryDataType(variables[key]);
            }, "") + ")"
            : "";
    };
    // start of mutation building
    DefaultAppSyncMutationAdapter.prototype.operationWrapperTemplate = function (variables, content) {
        return {
            query: OperationType_1.default.Mutation + " " + (this.operation
                .charAt(0)
                .toUpperCase() +
                this.operation.slice(1)) + " " + this.queryDataArgumentAndTypeMap(variables) + " {\n  " + content + "\n}",
            variables: Utils_1.default.queryVariablesMap(variables)
        };
    };
    DefaultAppSyncMutationAdapter.prototype.operationTemplate = function (operation) {
        return operation + " " + this.queryDataNameAndArgumentMap() + " {\n    " + this.queryFieldsMap(this.fields) + "\n  }";
    };
    // Fields selection map. eg: { id, name }
    DefaultAppSyncMutationAdapter.prototype.queryFieldsMap = function (fields) {
        var _this = this;
        return Array.isArray(fields)
            ? fields
                .map(function (field) {
                return typeof field === "object"
                    ? Object.keys(field)[0] + " { " + _this.queryFieldsMap(Object.values(field)[0]) + " }"
                    : "" + field;
            })
                .join(", ")
            : "";
    };
    return DefaultAppSyncMutationAdapter;
}());
exports.default = DefaultAppSyncMutationAdapter;
//# sourceMappingURL=DefaultAppSyncMutationAdapter.js.map