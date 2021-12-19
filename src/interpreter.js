"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpret = void 0;
const parser_1 = require("./parser");
const rls = __importStar(require("readline-sync"));
function interpret(text) {
    let tokens = (0, parser_1.parse)(text);
    const machine = new TapeMachine(tokens);
    machine.start();
}
exports.interpret = interpret;
class TapeMachine {
    constructor(tokens) {
        this.tokenIndex = 0;
        this.tapeLength = 255;
        this.tape = new Array(this.tapeLength).fill(0);
        this.tapeIndex = 0;
        this.tokens = tokens;
        this.tokenLength = tokens.length;
    }
    start() {
        this.eval();
        process.stdout.write("\n");
    }
    eval() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.tokenIndex < this.tokenLength) {
                const token = this.currentToken();
                // console.log(token);
                switch (token) {
                    case '+':
                        this.increment();
                        break;
                    case '-':
                        this.decrement();
                        break;
                    case '<':
                        this.shiftLeft();
                        break;
                    case '>':
                        this.shiftRight();
                        break;
                    case '[':
                        this.startLoop();
                        break;
                    case ']':
                        this.endLoop();
                        break;
                    case '.':
                        this.printCell();
                        break;
                    case ',':
                        yield this.putCell();
                        break;
                    default:
                        console.log(`Invalid operation ${this.currentToken()} ${this.tokenIndex}`);
                        break;
                }
            }
        });
    }
    advance() {
        this.tokenIndex++;
    }
    retreat() {
        this.tokenIndex = this.tokenIndex <= 0 ? 0 : this.tokenIndex - 1;
    }
    currentValue() {
        return this.tape[this.tapeIndex];
    }
    currentToken() {
        return this.tokens[this.tokenIndex];
    }
    increment() {
        this.tape[this.tapeIndex]++;
        this.advance();
    }
    decrement() {
        this.tape[this.tapeIndex]--;
        this.advance();
    }
    shiftLeft() {
        this.tapeIndex--;
        if (this.tapeIndex < 0) {
            this.tapeIndex = this.tapeIndex + this.tapeLength;
        }
        this.advance();
    }
    shiftRight() {
        this.tapeIndex = (this.tapeIndex + 1) % this.tapeLength;
        this.advance();
    }
    startLoop() {
        if (this.currentValue() === 0) {
            this.skipLoop();
        }
        else {
            this.advance();
        }
    }
    skipLoop() {
        let openBrackets = 0;
        for (; this.tokenIndex < this.tokenLength; this.advance()) {
            const token = this.currentToken();
            if (token === ']') {
                openBrackets--;
            }
            else if (token === '[') {
                openBrackets++;
            }
            if (openBrackets === 0) {
                this.advance();
                return;
            }
        }
    }
    endLoop() {
        // Not really necessary, but prevents 
        // looking back then immediately looking forward
        if (this.currentValue() === 0) {
            this.advance();
        }
        this.restartLoop();
    }
    restartLoop() {
        let closeBrackets = 0;
        for (; this.tokenIndex >= 0; this.retreat()) {
            const token = this.currentToken();
            if (token === ']') {
                closeBrackets++;
            }
            else if (token === '[') {
                closeBrackets--;
            }
            if (closeBrackets === 0) {
                return;
            }
        }
    }
    printCell() {
        const character = String.fromCharCode(this.tape[this.tapeIndex]);
        process.stdout.write(character);
        this.advance();
    }
    putCell() {
        let inLine = rls.question("> ");
        // Ignore all other characters since it's 1AM and this is the last thing to do
        this.tape[this.tapeIndex] = inLine.charCodeAt(0);
        this.advance();
    }
}
