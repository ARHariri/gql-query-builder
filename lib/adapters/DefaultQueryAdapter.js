"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OperationType_1 = require("../OperationType");
var Utils_1 = require("../Utils");
var DefaultQueryAdapter = /** @class */ (function () {
    function DefaultQueryAdapter(options) {
        this.queryDataType = function (variable) {
            var type = "String";
            var value = typeof variable === "object" ? variable.value : variable;
            if (variable.type !== undefined) {
                type = variable.type;
            }
            else {
                switch (typeof value) {
                    case "object":
                        type = "Object";
                        break;
                    case "boolean":
                        type = "Boolean";
                        break;
                    case "number":
                        type = value % 1 === 0 ? "Int" : "Float";
                        break;
                }
            }
            if (typeof variable === "object" && variable.required) {
                type += "!";
            }
            return type;
        };
        if (Array.isArray(options)) {
            this.variables = Utils_1.default.resolveVariables(options);
        }
        else {
            this.variables = options.variables;
            this.fields = options.fields || [];
            this.operation = options.operation;
        }
    }
    // kicks off building for a single query
    DefaultQueryAdapter.prototype.queryBuilder = function () {
        return this.operationWrapperTemplate(this.operationTemplate());
    };
    // if we have an array of options, call this
    DefaultQueryAdapter.prototype.queriesBuilder = function (queries) {
        var _this = this;
        var content = function () {
            var tmpl = [];
            queries.forEach(function (query) {
                if (query) {
                    _this.operation = query.operation;
                    _this.fields = query.fields;
                    _this.variables = query.variables;
                    tmpl.push(_this.operationTemplate());
                }
            });
            return tmpl.join(" ");
        };
        return this.operationWrapperTemplate(content());
    };
    // Convert object to name and argument map. eg: (id: $id)
    DefaultQueryAdapter.prototype.queryDataNameAndArgumentMap = function () {
        return this.variables && Object.keys(this.variables).length
            ? "(" + Object.keys(this.variables).reduce(function (dataString, key, i) {
                return "" + dataString + (i !== 0 ? ", " : "") + key + ": $" + key;
            }, "") + ")"
            : "";
    };
    // Convert object to argument and type map. eg: ($id: Int)
    DefaultQueryAdapter.prototype.queryDataArgumentAndTypeMap = function () {
        var _this = this;
        return this.variables && Object.keys(this.variables).length
            ? "(" + Object.keys(this.variables).reduce(function (dataString, key, i) {
                return "" + dataString + (i !== 0 ? ", " : "") + "$" + key + ": " + _this.queryDataType(_this.variables[key]);
            }, "") + ")"
            : "";
    };
    DefaultQueryAdapter.prototype.operationWrapperTemplate = function (content) {
        return {
            query: OperationType_1.default.Query + " " + this.queryDataArgumentAndTypeMap() + " { " + content + " }",
            variables: Utils_1.default.queryVariablesMap(this.variables)
        };
    };
    // query
    DefaultQueryAdapter.prototype.operationTemplate = function () {
        return this.operation + " " + this.queryDataNameAndArgumentMap() + " { " + Utils_1.default.queryFieldsMap(this.fields) + " }";
    };
    return DefaultQueryAdapter;
}());
exports.default = DefaultQueryAdapter;
//# sourceMappingURL=DefaultQueryAdapter.js.map