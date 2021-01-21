/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

type Dataset = { name: String }; //TODO needs validation
type BlankNode = { id: bigint };
type IRI = { id: String }; //TODO needs validation
type DefaultGraph = "_"; //TODO this probably isn't the best way to do this
type LangLiteral = { value: String, langTag: String }; //TODO needs validation -- should langTag be its own type?
type StringLiteral = { value: String };
type BooleanLiteral = { value: Boolean };
type LongLiteral = { value: Number };
type DoubleLiteral = { value: bigint };
type Literal = LangLiteral | StringLiteral | BooleanLiteral | LongLiteral | DoubleLiteral;

const A: IRI = { id: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" };

type Subject = IRI | BlankNode | DefaultGraph;
type Predicate = IRI;
type Obj = IRI | BlankNode | DefaultGraph | Literal;
type Graph = IRI | BlankNode | DefaultGraph;
type Statement = { subject: Subject, predicate: Predicate, object: Obj, graph: Graph = "_" };

type LangLiteralRange = { start: LangLiteral, end: LangLiteral };
type StringLiteralRange = { start: String, end: String };
type LongLiteralRange = { start: bigint, end: bigint };
type DoubleLiteralRange = { start: Number, end: Number };
type LiteralRange = LangLiteralRange | StringLiteralRange | LongLiteralRange | DoubleLiteralRange;
 
interface LigatureStore {
    readTx(): ReadTx;
    writeTx(): WriteTx;
    // compute<T>(fn: (readTx: ReadTx) => T): T {
    //      let readTx = this.readTx()
    //      try {
    //          return fn(readTx)
    //      } finally {
    //          if (readTx.isOpen()) {
    //              readTx.cancel()
    //          }
    //      }
    //  }
 
    //  suspend fun write(fn: suspend (WriteTx) -> Unit) {
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
 
    isOpen(): Boolean;
 }
 
 interface ReadTx {
     /**
      * Returns a Flow of all existing collections.
      */
    collections(): Flow<CollectionName>
 
     /**
      * Returns a Flow of all existing collections that start with the given prefix.
      */
    collections(prefix: CollectionName): Flow<CollectionName>
 
     /**
      * Returns a Flow of all existing collections that are within the given range.
      * `from` is inclusive and `to` is exclusive.
      */
     suspend fun collections(from: CollectionName, to: CollectionName): Flow<CollectionName>
 
     /**
      * Accepts nothing but returns a Flow of all Statements in the Collection.
      */
     suspend fun allStatements(collection: CollectionName): Flow<Statement>
 
     /**
      * Is passed a pattern and returns a seq with all matching Statements.
      */
     suspend fun matchStatements(collection: CollectionName, subject: Entity? = null, predicate: Predicate? = null, `object`: Object? = null, context: Entity? = null): Flow<Statement>
 
     /**
      * Is passed a pattern and returns a seq with all matching Statements.
      */
     suspend fun matchStatements(collection: CollectionName, subject: Entity? = null, predicate: Predicate? = null, range: Range<*>, context: Entity? = null): Flow<Statement>
 
     /**
      * Cancels this transaction.
      */
     suspend fun cancel()
 
     suspend fun isOpen(): Boolean
 }
 
 interface WriteTx {
     /**
      * Creates a collection with the given name or does nothing if the collection already exists.
      * Only useful for creating an empty collection.
      */
     suspend fun createCollection(collection: CollectionName)
 
     /**
      * Deletes the collection of the name given and does nothing if the collection doesn't exist.
      */
     suspend fun deleteCollection(collection: CollectionName)
 
     /**
      * Returns a new, unique to this collection identifier in the form _:NUMBER
      */
     suspend fun newEntity(collection: CollectionName): Entity
     suspend fun addStatement(collection: CollectionName, statement: Statement)
     suspend fun removeStatement(collection: CollectionName, statement: Statement)
 
     /**
      * Commits this transaction.
      */
     suspend fun commit()
 
     /**
      * Cancels this transaction.
      */
     suspend fun cancel()
 
     suspend fun isOpen(): Boolean
 }
 
 /**
  * Accepts a String representing an identifier and returns true or false depending on if it is valid.
  */
 fun validPredicate(identifier: String): Boolean {
     return "[a-zA-Z_][^\\s\\(\\)\\[\\]\\{\\}'\"`<>\\\\]*".toRegex().matches(identifier)
 }
 
 /**
  * Accepts a String representing a lang tag and returns true or false depending on if it is valid.
  */
 fun validLangTag(langTag: String): Boolean {
     return "[a-zA-Z]+(-[a-zA-Z0-9]+)*".toRegex().matches(langTag)
 }
