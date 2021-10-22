/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Value, Entity, validateIntegerLiteral } from "@ligature/ligature";

export const ENTITY_VALUE_TYPE = 0;
export const STRING_VALUE_TYPE = 1;
export const INTEGER_VALUE_TYPE = 2;
export const FLOAT_VALUE_TYPE = 3;
export const BYTES_VALUE_TYPE = 4;

/**
 * Encodes the type of a Value that is used for storing.
 * Entity     - 0
 * String     - 1
 * Integer    - 2
 * Float      - 3
 * Byte Array - 4
 */
export function valueType(value: Value): number {
    if (value instanceof Entity) {
        return ENTITY_VALUE_TYPE;
    } else if (typeof value == 'string') {
        return STRING_VALUE_TYPE;
    } else if (typeof value == 'bigint') {
        return INTEGER_VALUE_TYPE;
    } else if (typeof value == 'number') {
        return FLOAT_VALUE_TYPE;
    } else if (value instanceof Uint8Array) {
        return BYTES_VALUE_TYPE;
    } else {
        throw new Error("Invalid Value " + value);
    }
}

/**
 * 
 */
export function encodeInteger(integer: bigint): Uint8Array {
    if (!validateIntegerLiteral(integer)) {
        throw new Error("Integer value out of range - " + integer);
    }
    let adjusted = integer + 9223372036854775808n;
    let byte0 = Number((adjusted >> 56n) % 256n);
    let byte1 = Number((adjusted >> 48n) % 256n);
    let byte2 = Number((adjusted >> 40n) % 256n);
    let byte3 = Number((adjusted >> 32n) % 256n);
    let byte4 = Number((adjusted >> 24n) % 256n);
    let byte5 = Number((adjusted >> 16n) % 256n);
    let byte6 = Number((adjusted >> 8n) % 256n);
    let byte7 = Number(adjusted % 256n);
    return new Uint8Array([byte0, byte1, byte2, byte3, byte4, byte5, byte6, byte7]); 
}

/**
 * 
 */
export function decodeInteger(bytes: Uint8Array): bigint {
    if (bytes.length != 8) {
        throw new Error("Can only decode 64bit integers - " + bytes);
    }
    let num0 = BigInt(bytes[0]) << 56n;
    let num1 = BigInt(bytes[1]) << 48n;
    let num2 = BigInt(bytes[2]) << 40n;
    let num3 = BigInt(bytes[3]) << 32n;
    let num4 = BigInt(bytes[4]) << 24n;
    let num5 = BigInt(bytes[5]) << 16n;
    let num6 = BigInt(bytes[6]) << 8n;
    let num7 = BigInt(bytes[7]);
    return num0 + num1 + num2 + num3 + num4 + num5 + num6 + num7 - 9223372036854775808n;
}
