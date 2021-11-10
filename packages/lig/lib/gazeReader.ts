// /* This Source Code Form is subject to the terms of the Mozilla Public
//  * License, v. 2.0. If a copy of the MPL was not distributed with this
//  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// import { Statement, Identifier, identifierPattern, LongLiteral, BytesLiteral, StringLiteral } from "@ligature/ligature"
// import type { Value } from '@ligature/ligature'
// import { LigError } from "."
// import { Either, Left, Right } from "purify-ts"
// import { Gaze, takeWhile, takeString } from "@ligature/gaze"

// /**
//  * Reads a set of Statements encoded in a string.
//  * 
//  * @param input - the string containing a set of Statements
//  */
// export function read(input: string): Either<LigError, Array<Statement>> {
//     throw new Error("todo")
// }

// /**
//  * Reads a single identifier encoded in a string.
//  * 
//  * @param input - the string containing an Identifier
//  */
// export function readIdentifier(input: string): Either<LigError, Identifier> {
//     let gaze = Gaze.from(input)
//     return gaze.attempt(identifierStep)
// }

// /**
//  * Reads a single value encoded in a string
//  * 
//  * @param input - the string containing a value
//  */
// export function readValue(input: string): Either<LigError, Value> {
//     let gaze = Gaze.from(input)
//     return gaze.attempt(valueStep)
// }

// const identifierStep = (gaze: Gaze<string>): Either<LigError, Identifier> => {
//     let opening = gaze.attempt(takeString("<"))
//     let content = gaze.attempt(takeWhile((s: string) => {
//         return identifierPattern.test(s)
//     }))
//     let closing = gaze.attempt(takeString(">"))
//     if (content.isRight()) {
//         return Identifier.from(content.unsafeCoerce())
//     } else {
//         return Left({message: "Could not match Identifier"})
//     }
// }

// const valueStep = (gaze: Gaze<string>): Either<LigError, Value> => {
//     let identifierAttempt = gaze.attempt(identifierStep)
//     if (identifierAttempt.isRight()) { return identifierAttempt }
//     let stringAttempt = gaze.attempt(stringStep)
//     if (stringAttempt.isRight()) { return stringAttempt }
//     let integerAttempt = gaze.attempt(integerStep)
//     if (integerAttempt.isRight()) { return integerAttempt }
//     let byteAttempt = gaze.attempt(bytesStep)
//     if (byteAttempt.isRight()) { return byteAttempt }
//     return Left({ message: "Could not match value." })
// }

// const stringStep = (gaze: Gaze<string>): Either<LigError, StringLiteral> => {
//     throw new Error("todo")
// }

// const bytesStep = (gaze: Gaze<string>): Either<LigError, BytesLiteral> => {
//     throw new Error("todo")
// }

// const integerStep = (gaze: Gaze<string>): Either<LigError, LongLiteral> => {
//     let res = gaze.attempt(takeWhile((s: string) => { 
//         return (
//             s == "0" || 
//             s == "1" || 
//             s == "2" || 
//             s == "3" || 
//             s == "4" || 
//             s == "5" || 
//             s == "6" || 
//             s == "7" || 
//             s == "8" || 
//             s == "9") 
//         }))
//     if (res.isRight()) {
//         return LongLiteral.from(BigInt(res.unsafeCoerce()))
//     } else {
//         return Left({message: "Could not create LongLiteral."})
//     }
// }
