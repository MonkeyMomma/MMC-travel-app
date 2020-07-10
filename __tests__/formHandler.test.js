import {handleForm} from "../src/client/js/formHandler.js";
import {describe, expect} from "../node_modules/@jest/globals";


describe('Testing handleForm function', () => {
    test('It should return true because the function is defined', () => {
        expect(handleForm).toBeDefined();
    });
    test('It should return true as handleForm is a function', () => {
        expect(typeof handleForm).toBe('function');
    });
});
