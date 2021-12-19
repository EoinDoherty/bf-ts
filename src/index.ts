import * as fs from 'fs';
import { interpret } from './interpreter';

function main(): void{
    const args: string[] = process.argv;
    const source_file: string = args[2];
    const file_contents: string = fs.readFileSync(source_file, {encoding: 'utf-8'})
    interpret(file_contents);
}

main();