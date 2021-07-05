import { Entity, identifierPatternFull, validateIntegerLiteral } from "@ligature/ligature";
import type { Value } from '@ligature/ligature';

//TODO eventually remove these regexes and use code from lig
let integerPattern = /^[1-9][0-9]*$/
let floatPattern = /^[1-9][0-9]*.[0-9]*$/
let stringPattern = /^"(([^\x00-\x1F\"\\]|\\[\"\\/bfnrt]|\\u[0-9a-fA-F]{4})*)"$/

export function checkValue(valueValue: string, allowEmpty: boolean, addError: (string: string) => void): Value | null {
    if (valueValue.length == 0 && allowEmpty) {
        return null;
    } else if (valueValue.length == 0 && !allowEmpty) {
        addError("Value can't be empty.");
        return null;
    } else if (stringPattern.test(valueValue)) {
        return valueValue.substring(1, valueValue.length-1);
    } else if (integerPattern.test(valueValue)) {
        let bi = BigInt(valueValue)
        if (validateIntegerLiteral(bi)) {
            return bi;
        } else {
            addError("Integer out of range in Value.");
            return null;
        }
    } else if (floatPattern.test(valueValue)) {
        return Number(valueValue);
    } else if (identifierPatternFull.test(valueValue)) { //handle entity
        return new Entity(valueValue);
    } else {
        addError("Invalid Value.");
        return null;
    }
}
