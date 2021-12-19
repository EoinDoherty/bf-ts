export type Token = '+' | '-' | '[' | ']' | '<' | '>' | '.' | ',';
const tokenStrings = ['+' , '-' , '[' , ']' , '<' , '>' , '.' , ','];

export function parse(text: string): Token[] {
    let tokens: Token[] = [];

    for (const character of text) {
        if (isToken(character)) {
            tokens.push(character as Token);
        }
    }

    return tokens;
}

function isToken(text: string): text is Token {
    return tokenStrings.includes(text);
}