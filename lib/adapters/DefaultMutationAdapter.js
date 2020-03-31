"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OperationType_1 = require("../OperationType");
var Utils_1 = require("../Utils");
var DefaultMutationAdapter = /** @class */ (function () {
    function DefaultMutationAdapter(options) {
        if (Array.isArray(options)) {
            this.variables = Utils_1.default.resolveVariables(options);
        }
        else {
            this.variables = options.variables;
            this.fields = options.fields;
            this.operation = options.operation;
        }
    }
    DefaultMutationAdapter.prototype.mutationBuilder = function () {
        return this.operationWrapperTemplate(OperationType_1.default.Mutation, this.variables, this.operationTemplate(this.operation));
    };
    DefaultMutationAdapter.prototype.mutationsBuilder = function (mutations) {
        var _this = this;
        var content = mutations.map(function (opts) {
            _this.operation = opts.operation;
            _this.variables = opts.variables;
            _this.fields = opts.fields;
            return _this.operationTemplate(opts.operation);
        });
        return this.operationWrapperTemplate(OperationType_1.default.Mutation, Utils_1.default.resolveVariables(mutations), content.join("\n  "));
    };
    // Convert object to name and argument map. eg: (id: $id)
    DefaultMutationAdapter.prototype.queryDataNameAndArgumentMap = function () {
        return this.variables && Object.keys(this.variables).length
            ? "(" + Object.keys(this.variables).reduce(function (dataString, key, i) {
                return "" + dataString + (i !== 0 ? ", " : "") + key + ": $" + key;
            }, "") + ")"
            : "";
    };
    DefaultMutationAdapter.prototype.queryDataArgumentAndTypeMap = function (variables) {
        if (!variables) {
            return "";
        }
        return Object.keys(variables).length
            ? "(" + Object.keys(variables).reduce(function (dataString, key, i) {
                return "" + dataString + (i !== 0 ? ", " : "") + "$" + key + ": " + Utils_1.default.queryDataType(variables[key]);
            }, "") + ")"
            : "";
    };
    // start of mutation building
    DefaultMutationAdapter.prototype.operationWrapperTemplate = function (type, variables, content) {
        return {
            query: type + " " + this.queryDataArgumentAndTypeMap(variables) + " {\n  " + content + "\n}",
            variables: Utils_1.default.queryVariablesMap(variables)
        };
    };
    DefaultMutationAdapter.prototype.operationTemplate = function (operation) {
        return operation + " " + this.queryDataNameAndArgumentMap() + " " + (this.fields && this.fields.length > 0
            ? "{\n    " + this.queryFieldsMap(this.fields) + "\n  }"
            : "");
    };
    // Fields selection map. eg: { id, name }
    DefaultMutationAdapter.prototype.queryFieldsMap = function (fields) {
        var _this = this;
        return fields
            ? fields
                .map(function (field) {
                return typeof field === "object"
                    ? Object.keys(field)[0] + " { " + _this.queryFieldsMap(Object.values(field)[0]) + " }"
                    : "" + field;
            })
                .join(", ")
            : "";
    };
    return DefaultMutationAdapter;
}());
exports.default = DefaultMutationAdapter;
//# sourceMappingURL=DefaultMutationAdapter.js.map