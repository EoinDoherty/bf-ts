"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const tokenStrings = ['+', '-', '[', ']', '<', '>', '.', ','];
function parse(text) {
    let tokens = [];
    for (const character of text) {
        if (isToken(character)) {
            tokens.push(character);
        }
    }
    return tokens;
}
exports.parse = parse;
function isToken(text) {
    return tokenStrings.includes(text);
}
