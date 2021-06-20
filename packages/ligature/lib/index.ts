/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Observable } from "rxjs";

export type Dataset = string;
export type Entity = string;
export type Attribute = string;
export type StringLiteral = string;
export type BooleanLiteral = boolean;
export type LongLiteral = bigint;
export type DoubleLiteral = number;
export type Literal = StringLiteral | BooleanLiteral | LongLiteral | DoubleLiteral;

export type Value = Entity | Literal;
export type Statement = { entity: Entity, attribute: Attribute, value: Value, context: Entity };

export type StringLiteralRange = { start: string, end: string };
export type LongLiteralRange = { start: bigint, end: bigint };
export type DoubleLiteralRange = { start: number, end: number };
export type LiteralRange = StringLiteralRange | LongLiteralRange | DoubleLiteralRange;

export interface Ligature {
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

export interface ReadTx { 
    /**
     * Accepts nothing but returns a Flow of all Statements in the Collection.
     */
    allStatements(): Observable<Statement>
 
    /**
     * Is passed a pattern and returns a seq with all matching Statements.
     */
    matchStatements(entity: Entity | null, attribute: Attribute | null, value: Value | null, context: Entity | null): Observable<Statement>
 
    /**
     * Is passed a pattern and returns a seq with all matching Statements.
     */
    matchStatements(entity: Entity | null, attribute: Attribute | null, range: LiteralRange, context: Entity | null): Observable<Statement>
}

export interface WriteTx {
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

export const datasetPatternFull = /^[a-zA-Z_][a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;%=]*$/;
export const entityPatternFull = /^[a-zA-Z_][a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;%=]*$/;
export const attributePatternFull = /^[a-zA-Z_][a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;%=]*$/;
export const datasetPattern = /[a-zA-Z_][a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;%=]*/;
export const entityPattern = /[a-zA-Z_][a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;%=]*/;
export const attributePattern = /[a-zA-Z_][a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;%=]*/;

export function validateDataset(dataset: Dataset): boolean {
    return datasetPatternFull.test(dataset);
}

export function validateEntity(entity: Entity): boolean {
    return entityPatternFull.test(entity);
}

export function validateAttribute(attribute: Attribute): boolean {
    return attributePatternFull.test(attribute);
}

export function validateIntegerLiteral(literal: bigint): boolean {
    return literal >= -9223372036854775808n && literal <= 9223372036854775807n;
}
