import { parse, Token } from './parser';
import * as readline from 'readline';

export function interpret(text: string): void {
    let tokens = parse(text);
    const machine = new TapeMachine(tokens);
    machine.start();
}

class TapeMachine {
    tokens: Token[];
    tokenLength: number;
    tokenIndex = 0;

    tapeLength = 255;
    tape: Array<number> = new Array<number>(this.tapeLength).fill(0);
    tapeIndex = 0;
    run = true;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.tokenLength = tokens.length;
    }
    
    start() {
        this.eval()
    }

    eval() {
        while (this.run && this.tokenIndex < this.tokenLength) {
            const token = this.currentToken();
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
                    this.putCell();
                    break;
                default:
                    console.log(`Invalid operation ${this.currentToken()} ${this.tokenIndex}`)
                    break;
            }
        }
    }

    advance() {
        this.tokenIndex++;
    }

    retreat() {
        this.tokenIndex = this.tokenIndex <= 0 ? 0 : this.tokenIndex - 1;
    }

    currentValue(): number {
        return this.tape[this.tapeIndex];
    }

    currentToken(): Token {
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
        } else {
            this.advance();
        }
    }
    
    skipLoop() {
        let openBrackets = 0

        for (; this.tokenIndex < this.tokenLength; this.advance()) {
            const token = this.currentToken();
            if (token === ']') {
                openBrackets--;
            } else if (token === '[') {
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
            } else if (token === '[') {
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
        this.run = false;

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("> ", (inLine) => {
            this.tape[this.tapeIndex] = inLine.charCodeAt(0);
            rl.close();
            this.run = true;
            this.advance();
            this.eval();
        });
    }

}