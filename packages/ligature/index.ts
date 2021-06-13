/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Observable } from "rxjs";

type Dataset = string;
type Entity = string;
type Attribute = string;
type StringLiteral = string;
type BooleanLiteral = boolean;
type LongLiteral = bigint;
type DoubleLiteral = number;
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
    createDataset(dataset: Dataset): Observable<Dataset>;
    deleteDataset(dataset: Dataset): Observable<Dataset>;
    
    query<T>(fn: (readTx: ReadTx) => T): T;
 
    write<T>(fn: (writeTx: WriteTx) => T): T;
 
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
