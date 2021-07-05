<script lang="typescript">
    import { Attribute, Dataset, Entity, Statement } from "@ligature/ligature";
    import type { Value } from "@ligature/ligature";
    import { ligature } from '../../store/store';
    import { checkValue } from './dataset';

    export let dataset: Dataset

    let errors: string[] = [];
    let messages: string[] = [];

    function addError(error: string) {
        errors = [...errors, error];
    }

    function addMessage(message: string) {
        messages = [...messages, message];
    }

    async function addStatement() {
        errors = [];
        messages = [];

        let valid = true;
        let entityValue = document.getElementById("entityInput").value.trim();
        let attributeValue = document.getElementById("attributeInput").value.trim();
        let valueValue = document.getElementById("valueInput").value.trim();
        let contextValue = document.getElementById("contextInput").value.trim();

        let entity = new Entity(entityValue);
        if (!entity.isValid()) {
            valid = false;
            addError("Invalid Entity.");
        }
        let attribute = new Attribute(attributeValue);
        if (!attribute.isValid()) {
            valid = false;
            addError("Invalid Attribute.");
        }
        let value: Value | null = checkValue(valueValue, false, addError);
        if (value == null) {
            valid = false;
        }
        let context = new Entity(contextValue);
        if (!context.isValid()) {
            valid = false;
            addError("Invalid Context.")
        }

        if (valid) {
            let statement = new Statement(entity, attribute, value, context);
            await $ligature.write(dataset, async (tx) => {
                let res = await tx.addStatement(statement); //TODO handle errors
                console.log(res);
                if (res != null) {
                    addMessage("Added " + statement); //TODO pretty print Statement (probably using lig)
                }
            })
        }
    }
</script>
<div class="row align-items-center">
    <div class="col">
        <label for="entityInput" class="form-label">Entity</label>
        <input type="text" class="form-control" id="entityInput" placeholder="Entity">
    </div>
    <div class="col">
        <label for="attributeInput" class="form-label">Attribute</label>
        <input type="text" class="form-control" id="attributeInput" placeholder="Attribute">
    </div>
    <div class="col">
        <label for="valueInput" class="form-label">Value ?</label>
        <input type="text" class="form-control" id="valueInput" placeholder="Value">
    </div>
    <div class="col">
        <label for="contextInput" class="form-label">Context</label>
        <input type="text" class="form-control" id="contextInput" placeholder="Context">
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
