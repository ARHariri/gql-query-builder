"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultAppSyncQueryAdapter_1 = require("../src/adapters/DefaultAppSyncQueryAdapter");
var queryBuilder = require("./");
describe("Query", function () {
    test("generates query", function () {
        var query = queryBuilder.query({
            operation: "thoughts",
            fields: ["id", "name", "thought"]
        });
        expect(query).toEqual({
            query: "query  { thoughts  { id, name, thought } }",
            variables: {}
        });
    });
    test("generates query when adapter argument is provided", function () {
        var query = queryBuilder.query({
            operation: "thoughts",
            fields: ["id", "name", "thought"]
        }, DefaultAppSyncQueryAdapter_1.default);
        expect(query).toEqual({
            query: "query Thoughts  { thoughts  { nodes { id, name, thought } } }",
            variables: {}
        });
    });
    test("generates query with variables", function () {
        var query = queryBuilder.query({
            operation: "thought",
            variables: { id: 1 },
            fields: ["id", "name", "thought"]
        });
        expect(query).toEqual({
            query: "query ($id: Int) { thought (id: $id) { id, name, thought } }",
            variables: { id: 1 }
        });
    });
    test("generates query with sub fields selection", function () {
        var query = queryBuilder.query({
            operation: "orders",
            fields: [
                "id",
                "amount",
                {
                    user: [
                        "id",
                        "name",
                        "email",
                        {
                            address: ["city", "country"]
                        }
                    ]
                }
            ]
        });
        expect(query).toEqual({
            query: "query  { orders  { id, amount, user { id, name, email, address { city, country } } } }",
            variables: {}
        });
    });
    test("generates query with required variables", function () {
        var query = queryBuilder.query({
            operation: "userLogin",
            variables: {
                email: { value: "jon.doe@example.com", required: true },
                password: { value: "123456", required: true }
            },
            fields: ["userId", "token"]
        });
        expect(query).toEqual({
            query: "query ($email: String!, $password: String!) { userLogin (email: $email, password: $password) { userId, token } }",
            variables: { email: "jon.doe@example.com", password: "123456" }
        });
    });
    test("generates multiple queries", function () {
        var query = queryBuilder.query([
            {
                operation: "thoughts",
                fields: ["id", "name", "thought"]
            },
            {
                operation: "prayers",
                fields: ["id", "name", "prayer"]
            }
        ]);
        expect(query).toEqual({
            query: "query  { thoughts  { id, name, thought } prayers  { id, name, prayer } }",
            variables: {}
        });
    });
});
describe("Mutation", function () {
    test("generates mutation query", function () {
        var query = queryBuilder.mutation({
            operation: "thoughtCreate",
            variables: {
                name: "Tyrion Lannister",
                thought: "I drink and I know things."
            },
            fields: ["id"]
        });
        expect(query).toEqual({
            query: "mutation ($name: String, $thought: String) {\n  thoughtCreate (name: $name, thought: $thought) {\n    id\n  }\n}",
            variables: {
                name: "Tyrion Lannister",
                thought: "I drink and I know things."
            }
        });
    });
    test("generates mutation query with required variables", function () {
        var query = queryBuilder.mutation({
            operation: "userSignup",
            variables: {
                name: "Jon Doe",
                email: { value: "jon.doe@example.com", required: true },
                password: { value: "123456", required: true }
            },
            fields: ["userId"]
        });
        expect(query).toEqual({
            query: "mutation ($name: String, $email: String!, $password: String!) {\n  userSignup (name: $name, email: $email, password: $password) {\n    userId\n  }\n}",
            variables: {
                name: "Jon Doe",
                email: "jon.doe@example.com",
                password: "123456"
            }
        });
    });
    test("generates multiple mutations", function () {
        var query = queryBuilder.mutation([
            {
                operation: "thoughtCreate",
                variables: {
                    name: "Tyrion Lannister",
                    thought: "I drink and I know things."
                },
                fields: ["id"]
            },
            {
                operation: "prayerCreate",
                variables: {
                    name: { value: "Tyrion Lannister" },
                    prayer: { value: "I wish for winter." }
                },
                fields: ["id"]
            }
        ]);
        expect(query).toEqual({
            query: "mutation ($name: String, $thought: String, $prayer: String) {\n  thoughtCreate (name: $name, thought: $thought) {\n    id\n  }\n  prayerCreate (name: $name, prayer: $prayer) {\n    id\n  }\n}",
            variables: {
                name: "Tyrion Lannister",
                thought: "I drink and I know things.",
                prayer: "I wish for winter."
            }
        });
    });
    test("generates mutation with required variables", function () {
        var query = queryBuilder.mutation({
            operation: "userSignup",
            variables: {
                name: "Jon Doe",
                email: { value: "jon.doe@example.com", required: true },
                password: { value: "123456", required: true }
            },
            fields: ["id"]
        });
        expect(query).toEqual({
            query: "mutation ($name: String, $email: String!, $password: String!) {\n  userSignup (name: $name, email: $email, password: $password) {\n    id\n  }\n}",
            variables: {
                name: "Jon Doe",
                email: "jon.doe@example.com",
                password: "123456"
            }
        });
    });
    test("generates mutation custom type", function () {
        var query = queryBuilder.mutation({
            operation: "userPhoneNumber",
            variables: {
                phone: {
                    value: { prefix: "+91", number: "9876543210" },
                    type: "PhoneNumber",
                    required: true
                }
            },
            fields: ["id"]
        });
        expect(query).toEqual({
            query: "mutation ($phone: PhoneNumber!) {\n  userPhoneNumber (phone: $phone) {\n    id\n  }\n}",
            variables: {
                phone: { prefix: "+91", number: "9876543210" }
            }
        });
    });
    test("generate mutation without fields selection", function () {
        var query = queryBuilder.mutation({
            operation: "logout"
        });
        expect(query).toEqual({
            query: "mutation  {\n  logout  \n}",
            variables: {}
        });
    });
});
describe("Subscriptions", function () {
    test("generates subscriptions", function () {
        var query = queryBuilder.subscription([
            {
                operation: "thoughtCreate",
                variables: {
                    name: "Tyrion Lannister",
                    thought: "I drink and I know things."
                },
                fields: ["id"]
            },
            {
                operation: "prayerCreate",
                variables: {
                    name: { value: "Tyrion Lannister" },
                    prayer: { value: "I wish for winter." }
                },
                fields: ["id"]
            }
        ]);
        expect(query).toEqual({
            query: "subscription ($name: String, $thought: String, $prayer: String) {\n  thoughtCreate (name: $name, thought: $thought) {\n    id\n  }\n  prayerCreate (name: $name, prayer: $prayer) {\n    id\n  }\n}",
            variables: {
                name: "Tyrion Lannister",
                thought: "I drink and I know things.",
                prayer: "I wish for winter."
            }
        });
    });
    test("generates subscription with required variables", function () {
        var query = queryBuilder.subscription({
            operation: "userSignup",
            variables: {
                name: "Jon Doe",
                email: { value: "jon.doe@example.com", required: true },
                password: { value: "123456", required: true }
            },
            fields: ["id"]
        });
        expect(query).toEqual({
            query: "subscription ($name: String, $email: String!, $password: String!) {\n  userSignup (name: $name, email: $email, password: $password) {\n    id\n  }\n}",
            variables: {
                name: "Jon Doe",
                email: "jon.doe@example.com",
                password: "123456"
            }
        });
    });
    test("generates subscription custom type", function () {
        var query = queryBuilder.subscription({
            operation: "userPhoneNumber",
            variables: {
                phone: {
                    value: { prefix: "+91", number: "9876543210" },
                    type: "PhoneNumber",
                    required: true
                }
            },
            fields: ["id"]
        });
        expect(query).toEqual({
            query: "subscription ($phone: PhoneNumber!) {\n  userPhoneNumber (phone: $phone) {\n    id\n  }\n}",
            variables: {
                phone: { prefix: "+91", number: "9876543210" }
            }
        });
    });
});
//# sourceMappingURL=index.test.js.map