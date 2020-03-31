"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.resolveVariables = function (operations) {
        var ret = {};
        for (var _i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
            var variables = operations_1[_i].variables;
            ret = __assign({}, ret, variables);
        }
        return ret;
    };
    Utils.queryFieldsMap = function (fields) {
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
    // Variables map. eg: { "id": 1, "name": "Jon Doe" }
    Utils.queryVariablesMap = function (variables) {
        var variablesMapped = {};
        if (variables) {
            Object.keys(variables).map(function (key) {
                variablesMapped[key] =
                    typeof variables[key] === "object"
                        ? variables[key].value
                        : variables[key];
            });
        }
        return variablesMapped;
    };
    Utils.queryDataType = function (variable) {
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
    return Utils;
}());
exports.default = Utils;
//# sourceMappingURL=Utils.js.map