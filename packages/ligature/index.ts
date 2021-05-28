/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Observable } from "rxjs";

type Dataset = { name: string }; //TODO needs validation
type Entity = { id: string }; //TODO needs validation
type Attribute = { name: string }; //TODO needs validation
type StringLiteral = { value: string };
type BooleanLiteral = { value: boolean };
type LongLiteral = { value: bigint };
type DoubleLiteral = { value: number };
type Literal = StringLiteral | BooleanLiteral | LongLiteral | DoubleLiteral;

type Value = Entity | Literal;
type Statement = { entity: Entity, attribute: Attribute, value: Value, context: Entity };

type StringLiteralRange = { start: string, end: string };
type LongLiteralRange = { start: bigint, end: bigint };
type DoubleLiteralRange = { start: number, end: number };
type LiteralRange = StringLiteralRange | LongLiteralRange | DoubleLiteralRange;

interface Ligature {
    allDatasets(): Observable<Dataset>;
    datasetExists(dataset: Dataset): Observable<boolean>;
    matchDatasetPrefix(prefix: string): Observable<Dataset>;
    matchDatasetRange(start: string, end: string): Observable<Dataset>;
    createDataset(dataset: Dataset): Observable<null>; //TODO shouldn't return null
    deleteDataset(dataset: Dataset): Observable<null>; //TODO shouldn't return null
    
    // query<T>(fn: (readTx: ReadTx) => T): T {
    //      let readTx = this.readTx()
    //      try {
    //          return fn(readTx)
    //      } finally {
    //          if (readTx.isOpen()) {
    //              readTx.cancel()
    //          }
    //      }
    //  }
 
    // write(fn: suspend (WriteTx) -> Unit) {
    //      val writeTx = this.writeTx()
    //      try {
    //          return fn(writeTx)
    //      } finally {
    //          if (writeTx.isOpen()) {
    //              writeTx.commit()
    //          }
    //      }
    //  }
 
     /**
      * Close connection with the Store.
      */
    close(): void;
 
    isOpen(): boolean;
}
 
interface ReadTx { 
    /**
     * Accepts nothing but returns a Flow of all Statements in the Collection.
     */
    allStatements(): Observable<Statement>
 
    /**
     * Is passed a pattern and returns a seq with all matching Statements.
     */
    matchStatements(entity: Entity | null, attribute: Attribute | null, object: Object | null, context: Entity | null): Observable<Statement>
 
    /**
     * Is passed a pattern and returns a seq with all matching Statements.
     */
    matchStatements(entity: Entity | null, attribute: Attribute | null, range: LiteralRange, context: Entity | null): Observable<Statement>
}

interface WriteTx {
    /**
     * Returns a new, unique to this collection identifier in the form _:NUMBER
     */
    generateEntity(prefix: Entity): Entity //TODO add default for prefix
    addStatement(statement: Statement): any //TODO figure out return type
    removeStatement(statement: Statement): any //TODO figure out return type

    /**
     * Cancels this transaction.
     */
    cancel(): any //TODO figure out return type
}
 
// /**
//  * Accepts a String representing an identifier and returns true or false depending on if it is valid.
//  */
// function validPredicate(identifier: String): Boolean {
//     return "[a-zA-Z_][^\\s\\(\\)\\[\\]\\{\\}'\"`<>\\\\]*".toRegex().matches(identifier)
// }
 
// /**
//  * Accepts a String representing a lang tag and returns true or false depending on if it is valid.
//  */
// fun validLangTag(langTag: String): Boolean {
//     return "[a-zA-Z]+(-[a-zA-Z0-9]+)*".toRegex().matches(langTag)
// }
