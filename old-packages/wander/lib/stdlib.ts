/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ResultComplete, ResultError, ResultStream } from "../../ligature/lib";
import { Name, NativeFunction } from "./ast";
import { Binding } from "./binding";
import { TODO } from "./debug";
import { ExecutionScope } from "./index"

export function stdLib(scope: ExecutionScope): Binding {
    let stdLib = common();

    if (scope.scopeType == "Instance") {
        instanceScope(scope, stdLib)
    } else if (scope.scopeType == "ReadTx") {
        readScope(scope, stdLib)
    } else if (scope.scopeType == "WriteTx") {
        writeScope(scope, stdLib)
    }

    return stdLib;
}

function common(): Binding {
    const stdLib = new Binding();

    stdLib.bind(new Name("log"), new NativeFunction(["message"], (Binding: Binding) => {
        throw new Error("Not implemented.");
    }))

    stdLib.bind(new Name("not"), new NativeFunction(["bool"], (bindings: Binding) => {
        let b = bindings.read(new Name("bool")) as boolean //TODO check value
        return !b
    }));

    stdLib.bind(new Name("and"), new NativeFunction(["booll", "boolr"], (bindings: Binding) => {
        let booll = bindings.read(new Name("booll")) as boolean //TODO check value
        let boolr = bindings.read(new Name("boolr")) as boolean //TODO check value
        return booll && boolr
    }));

    stdLib.bind(new Name("or"), new NativeFunction(["booll", "boolr"], (bindings: Binding) => {
        let booll = bindings.read(new Name("booll")) as boolean //TODO check value
        let boolr = bindings.read(new Name("boolr")) as boolean //TODO check value
        return booll || boolr
    }));

    class RangeResultStream implements ResultStream<bigint> {
        readonly start: bigint
        readonly stop: bigint
        private i: bigint

        constructor(start: bigint, stop: bigint) {
            this.start = start
            this.stop = stop
            this.i = start
        }

        next(): Promise<bigint | ResultComplete | ResultError> {
            if (this.i < this.stop) {
                let result = this.i
                this.i++;
                return Promise.resolve(result)
            } else {
                return Promise.resolve(new ResultComplete(this.stop - this.start));
            }
        }
        toArray(): Promise<ResultComplete | ResultError | bigint[]> {
            throw new Error("Method not implemented.");
        }
    }

    // stdLib.bind(new Name("range"), new NativeFunction(["start", "stop"], (bindings: Binding) => {
    //     let start = bindings.read(new Name("start")) as unknown as bigint //TODO check value
    //     let stop = bindings.read(new Name("stop")) as unknown as bigint //TODO check value
    //     return new RangeResultStream(start, stop)
    // }))

    return stdLib;
}

function instanceScope(scope: ExecutionScope, bindings: Binding) {
    // allDatasets(): Promise<Array<Dataset>>;
    bindings.bind(new Name("allDatasets"), new NativeFunction([], (_bindings: Binding) => {
        return TODO()
    }))
    // datasetExists(dataset: Dataset): Promise<boolean>;
    bindings.bind(new Name("datasetExists"), new NativeFunction(["dataset"], (_bindings: Binding) => {
        return TODO()
    }))
    // matchDatasetPrefix(prefix: string): Promise<Array<Dataset>>;
    bindings.bind(new Name("matchDatasetPrefix"), new NativeFunction(["prefix"], (_bindings: Binding) => {
        return TODO()
    }))
    // matchDatasetRange(start: string, end: string): Promise<Array<Dataset>>;
    bindings.bind(new Name("matchDatasetRange"), new NativeFunction(["start", "end"], (_bindings: Binding) => {
        return TODO()
    }))
    // createDataset(dataset: Dataset): Promise<Dataset>;
    bindings.bind(new Name("createDataset"), new NativeFunction(["dataset"], (_bindings: Binding) => {
        return TODO()
    }))
    // deleteDataset(dataset: Dataset): Promise<Dataset>;
    bindings.bind(new Name("deleteDataset"), new NativeFunction(["dataset"], (_bindings: Binding) => {
        return TODO()
    }))
    // query<T>(dataset: Dataset, fn: (readTx: ReadTx) => Promise<T>): Promise<T>;
    bindings.bind(new Name("query"), new NativeFunction(["dataset", "fn"], (_bindings: Binding) => {
        return TODO()
    }))
    // write<T>(dataset: Dataset, fn: (writeTx: WriteTx) => Promise<T>): Promise<T>;
    bindings.bind(new Name("write"), new NativeFunction(["dataset", "fn"], (_bindings: Binding) => {
        return TODO()
    }))
}

function readScope(scope: ExecutionScope, bindings: Binding) {
    //      allStatements(): Promise<Array<Statement>>
    bindings.bind(new Name("allStatements"), new NativeFunction([], (_bindings: Binding) => {
        return TODO()
    }))
    //      matchStatements(entity: Entity | null, attribute: Attribute | null, value: Value | null | LiteralRange, context: Entity | null): Promise<Array<Statement>>
    bindings.bind(new Name("matchStatements"), new NativeFunction(["entity", "attribute", "value", "context"], (_bindings: Binding) => {
        return TODO()
    }))
}

function writeScope(scope: ExecutionScope, bindings: Binding) {
    // /**
    //  * Returns a new, unique to this collection identifier in the form _:UUID
    //  */
    //  generateEntity(prefix: string): Promise<Entity>
    bindings.bind(new Name("newEntity"), new NativeFunction(["prefix"], (_bindings: Binding) => {
        return TODO()
    }))
    //  addStatement(statement: Statement): Promise<Statement>
    bindings.bind(new Name("addStatement"), new NativeFunction(["statement"], (_bindings: Binding) => {
        return TODO()
    }))
    //  removeStatement(statement: Statement): Promise<Statement>
    bindings.bind(new Name("removeStatement"), new NativeFunction(["statement"], (_bindings: Binding) => {
        return TODO()
    }))
    //  /**
    //   * Cancels this transaction.
    //   */
    //  cancel(): any //TODO figure out return type
    bindings.bind(new Name("cancel"), new NativeFunction([], (_bindings: Binding) => {
        return TODO()
    }))
}
