import {describe, expect} from "../node_modules/@jest/globals";

const request = require("supertest");
const app = require("../src/server/server.js");

describe("Test the root path", () => {
    test("It should respond the GET method", done => {
        request(app)
            .get("/")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});
