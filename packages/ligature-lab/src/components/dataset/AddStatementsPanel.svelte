<script lang="typescript">
    import { Attribute, Dataset, Entity, Statement, identifierPatternFull } from "@ligature/ligature";
    import type { Value } from "@ligature/ligature";
    import { ligature } from '../../store/store';

    export let dataset: Dataset

    let integerPattern = /^[1-9][0-9]*$/
    let floatPattern = /^[1-9][0-9]*.[0-9]*$/
    let stringPattern = /^"(([^\x00-\x1F\"\\]|\\[\"\\/bfnrt]|\\u[0-9a-fA-F]{4})*)"$/

    let errors: string[] = [];
    let messages: string[] = [];

    async function addStatement() {
        errors = [];
        messages = [];

        let valid = true;
        let entityValue = document.getElementById("entityQueryInput").value.trim();
        let attributeValue = document.getElementById("attributeQueryInput").value.trim();
        let valueValue = document.getElementById("valueQueryInput").value.trim();
        let contextValue = document.getElementById("contextQueryInput").value.trim();

        let entity = new Entity(entityValue);
        if (!entity.isValid()) {
            valid = false;
            errors.push("Invalid Entity.");
        }
        let attribute = new Attribute(attributeValue);
        if (!attribute.isValid()) {
            valid = false;
            errors.push("Invalid Attribute.");
        }
        let value: Value;
        if (valueValue.length == 0) {
            valid = false;
            errors.push("Value can't be empty.");
        } else if (stringPattern.test(valueValue)) {
            value = valueValue.substring(1, valueValue.length-1);
        } else if (integerPattern.test(valueValue)) {
            value = BigInt(valueValue);
            //TODO check value range to make sure it's valid
        } else if (floatPattern.test(valueValue)) {
            value = Number(valueValue);
        } else if (identifierPatternFull.test(valueValue)) { //handle entity
            value = new Entity(valueValue);
        } else {
            valid = false;
            errors.push("Invalad Value.");
        }
        let context = new Entity(contextValue);
        if (!context.isValid()) {
            valid = false;
            errors.push("Invalid Context.")
        }

        if (valid) {
            let statement = new Statement(entity, attribute, value, context);
            $ligature.write(dataset, async (tx) => {
                let res = await tx.addStatement(statement); //TODO handle errors
                if (res != null) {
                    messages.push("Added " + statement); //TODO pretty print Statement (probably using lig)
                }
            })
        }
    }
</script>
<div class="row align-items-center">
    <div class="col">
        <label for="entityQueryInput" class="form-label">Entity</label>
        <input type="text" class="form-control" id="entityQueryInput" placeholder="Entity">
    </div>
    <div class="col">
        <label for="attributeQueryInput" class="form-label">Attribute</label>
        <input type="text" class="form-control" id="attributeQueryInput" placeholder="Attribute">
    </div>
    <div class="col">
        <label for="valueQueryInput" class="form-label">Value ?</label>
        <input type="text" class="form-control" id="valueQueryInput" placeholder="Value">
    </div>
    <div class="col">
        <label for="contextQueryInput" class="form-label">Context</label>
        <input type="text" class="form-control" id="contextQueryInput" placeholder="Context">
    </div>
    <div class="col">
        <button type="button" class="btn btn-outline-dark" on:click={() => addStatement()}>Add</button>
    </div>
</div>
<div class="row">
    {#each errors as error}
        <p>Error: {error}</p>
    {/each}
    {#each messages as message}
         <p>{message}</p>
    {/each}
</div>
