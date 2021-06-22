/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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

/**
 * The main interface for interacting with Ligature.
 * It allows for interacting with Datasets outside of transactions,
 * and also allow for interacting with the contents of a specific Dataset inside of a transaction.
 */
export interface Ligature {
    allDatasets(): Promise<Array<Dataset>>;
    datasetExists(dataset: Dataset): Promise<boolean>;
    matchDatasetPrefix(prefix: string): Promise<Array<Dataset>>;
    matchDatasetRange(start: string, end: string): Promise<Array<Dataset>>;
    createDataset(dataset: Dataset): Promise<Dataset>;
    deleteDataset(dataset: Dataset): Promise<Dataset>;
    
    query<T>(fn: (readTx: ReadTx) => T): Promise<T>;
 
    write<T>(fn: (writeTx: WriteTx) => T): Promise<T>;
 
     /**
      * Close connection with the Store.
      */
    close(): Promise<void>;
 
    isOpen(): boolean;
}

export interface LigatureCursor<T> {
    
}

export interface ReadTx { 
    /**
     * Accepts nothing but returns a Flow of all Statements in the Collection.
     */
    allStatements(): Promise<Iterator<Statement>>
 
    /**
     * Is passed a pattern and returns a seq with all matching Statements.
     */
    matchStatements(entity: Entity | null, attribute: Attribute | null, value: Value | null, context: Entity | null): Promise<Iterator<Statement>>
 
    /**
     * Is passed a pattern and returns a seq with all matching Statements.
     */
    matchStatements(entity: Entity | null, attribute: Attribute | null, range: LiteralRange, context: Entity | null): Promise<Iterator<Statement>>
}

export interface WriteTx {
    /**
     * Returns a new, unique to this collection identifier in the form _:NUMBER
     */
    generateEntity(prefix: Entity): Promise<Entity>
    addStatement(statement: Statement): Promise<Statement>
    removeStatement(statement: Statement): Promise<Statement>

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
