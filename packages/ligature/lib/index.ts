/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const identifierPatternFull = /^[a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;%=]*$/;
export const identifierPattern =      /[a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;%=]*/;
 
export function validateIntegerLiteral(literal: bigint): boolean {
    return literal >= -9223372036854775808n && literal <= 9223372036854775807n;
}

export type InvalidDataset = "InvalidDataset";

export class Dataset {
    readonly name: string;

    private constructor(name: string) {
        this.name = name;
    }

    equals(other: Dataset): boolean {
        return this.name === other.name;
    }

    static from(name: string): Dataset | InvalidDataset {
        if (identifierPatternFull.test(this.name)) {
            return new Dataset(name);
        } else {
            return "InvalidDataset"
        }
    }
}

export type InvalidIdentifier = "InvalidIdentifier"

export class Identifier {
    readonly id: string;

    private constructor(id: string) {
        this.id = id;
    }

    equals(other: Identifier): boolean {
        return this.id === other.id;
    }

    static from(id: string): Identifier | InvalidIdentifier {
        if (identifierPatternFull.test(id)) {
            return new Identifier(id)
        } else {
            return "InvalidIdentifier"
        }
    }
}

export type InvalidLongLiteral = "InvalidLongLiteral"

export class LongLiteral {
    readonly value: bigint;

    private constructor(value: bigint) {
        this.value = value;
    }

    equals(other: LongLiteral) {
        return this.value === other.value;
    }

    static from(value: bigint): LongLiteral | InvalidLongLiteral {
        if (validateIntegerLiteral(value)) {
            return new LongLiteral(value)
        } else {
            return "InvalidLongLiteral"
        }
    }
}

export type StringLiteral = string;
export type BytesLiteral = Uint8Array;
export type Literal = StringLiteral | BytesLiteral | LongLiteral;

export type Value = Identifier | Literal;

export class Statement {
    readonly entity: Identifier;
    readonly attribute: Identifier;
    readonly value: Value;
    readonly context: Identifier;

    constructor(entity: Identifier, attribute: Identifier, value: Value, context: Identifier) {
        this.entity = entity;
        this.attribute = attribute;
        this.value = value;
        this.context = context;
    }

    private valuesEqual(value: Value): boolean {
        if (this.value instanceof Identifier && value instanceof Identifier) {
            return this.value.equals(value);
        } else {
            return value === this.value
        }
    }

    equals(statement: Statement): boolean {
        return this.entity.equals(statement.entity) &&
            this.attribute.equals(statement.attribute) &&
            this.valuesEqual(statement.value) &&
            this.context.equals(statement.context);
    }
}

export type StringLiteralRange = { start: string, end: string };
export type LongLiteralRange = { start: LongLiteral, end: LongLiteral };
export type BytesLiteralRange = { start: BytesLiteral, end: BytesLiteral };
export type LiteralRange = StringLiteralRange | BytesLiteralRange | LongLiteralRange;

export class ResultComplete {
    readonly length: BigInt

    constructor(length: BigInt) {
        this.length = length
    }
}

export class ResultError {
    readonly message: string
    readonly error: Error | null

    constructor(message: string, error: Error | null = null) {
        this.message = message
        this.error = error
    }
}

/**
 * An interface that represents a result set from a method call on a Ligature object.
 */
export interface ResultStream<T> {
    /**
     * Returns the next value if one exists, ResultComplete if a next value doesn't exist, or a ResultError if an error occurred.
     * If you call next on a completed or an error stream you will continue to get the last result.
     */
    next(): Promise<T | ResultComplete | ResultError>
    /**
     * Returns an array of results.
     * If the requested number is greater than the remaining number an array with all the remain elements will be returned.
     * If the result set is empty ResultComplete will be returned.
     * If you call next on a completed or an error stream you will continue to get the last result.
     */
    //take(number: number): Promise<Array<T> | ResultComplete | ResultError>

    /**
     * Returns all remaining results as an array.
     */
    toArray(): Promise<Array<T> | ResultComplete | ResultError>
}

/**
 * This function is a type guard for checking if an object implements ResultStream.
 */
export function instanceOfResultStream<T>(object: any): object is ResultStream<T> {
    return 'next' in object && 'toArray' in object;
}

export class ArrayResultStream<T> implements ResultStream<T> {
    private array: Array<T>
    private index = 0;
    
    constructor(array: Array<T>) {
        this.array = array
    }

    next(): Promise<T | ResultComplete | ResultError> {
        if (this.index == this.array.length) {
            return Promise.resolve(new ResultComplete(BigInt(this.array.length)))
        } else {
            let result = this.array[this.index];
            this.index++
            return Promise.resolve(result);
        }
    }

    toArray(): Promise<Array<T> | ResultComplete | ResultError> {
        if (this.index == this.array.length) {
            return Promise.resolve(new ResultComplete(BigInt(this.array.length)));
        }
        let result = this.array.slice(this.index, this.array.length)
        this.index = this.array.length
        return Promise.resolve(result)
    }

    // take(number: number): ResultComplete | ResultError | T[] {
    //     if (this.index == this.array.length) {
    //         return new ResultComplete(BigInt(this.array.length))
    //     } else {
    //         let result = this.array[this.index];
    //         this.index++
    //         return result;
    //     }
    // }
}

/**
 * The main interface for interacting with Ligature.
 * It allows for interacting with Datasets outside of transactions,
 * and also allow for interacting with the contents of a specific Dataset inside of a transaction.
 */
export interface Ligature {
    allDatasets(): Promise<ResultStream<Dataset>>;
    datasetExists(dataset: Dataset): Promise<boolean>;
    matchDatasetPrefix(prefix: string): Promise<ResultStream<Dataset>>;
    matchDatasetRange(start: string, end: string): Promise<ResultStream<Dataset>>;
    createDataset(dataset: Dataset): Promise<Dataset>;
    deleteDataset(dataset: Dataset): Promise<Dataset>;
    
    query<T>(dataset: Dataset, fn: (readTx: ReadTx) => Promise<T>): Promise<T>;
 
    write<T>(dataset: Dataset, fn: (writeTx: WriteTx) => Promise<T>): Promise<T>;
 
    /**
     * Close connection with the Store.
     */
    close(deleteDb: boolean): Promise<void>;
 
    isOpen(): boolean;
}

export interface ReadTx { 
    /**
     * Accepts nothing but returns a Flow of all Statements in the Collection.
     */
    allStatements(): Promise<ResultStream<Statement>>
 
    /**
     * Is passed a pattern and returns a seq with all matching Statements.
     */
    matchStatements(entity: Identifier | null, attribute: Identifier | null, value: Value | null | LiteralRange, context: Identifier | null): Promise<ResultStream<Statement>>
}

export interface WriteTx {
    /**
     * Returns a new, unique to this collection identifier in the form _:UUID
     */
    newIdentifier(prefix: string): Promise<Identifier>
    addStatement(statement: Statement): Promise<Statement>
    removeStatement(statement: Statement): Promise<Statement>

    /**
     * Cancels this transaction.
     */
    cancel(): any //TODO figure out return type
}
