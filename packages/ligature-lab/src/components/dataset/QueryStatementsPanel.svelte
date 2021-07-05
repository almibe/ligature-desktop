<script lang="typescript">
    import { Dataset, Entity, Attribute, Statement } from "@ligature/ligature";
    import type { Value, LiteralRange } from "@ligature/ligature";
    import { ligature } from '../../store/store';
    import { checkValue } from "./dataset";

    export let dataset: Dataset

    let errors: string[] = [];
    let messages: string[] = [];

    function addError(error: string) {
        errors = [...errors, error];
    }

    function addMessage(message: string) {
        messages = [...messages, message];
    }

    function queryStatements() {
        errors = [];
        messages = [];

        let valid = true;
        let entityValue = document.getElementById("entityQueryInput").value.trim();
        let attributeValue = document.getElementById("attributeQueryInput").value.trim();
        let valueStartValue = document.getElementById("valueStartQueryInput").value.trim();
        let valueStopeValue = document.getElementById("valueStopQueryInput").value.trim();
        let contextValue = document.getElementById("contextQueryInput").value.trim();

        let entity: Entity = null;
        if (entityValue.length > 0) {
            entity = new Entity(entityValue);
            if (!entity.isValid()) {
                valid = false;
                errors.push("Invalid Entity.");
            }
        }

        let attribute = null;
        if (attributeValue.length > 0) {
            attribute = new Attribute(attributeValue);
            if (!attribute.isValid()) {
                valid = false;
                errors.push("Invalid Attribute.");
            }
        }

        //TODO double check that value query validitally is being checked properly
        let startValue: Value | null = checkValue(valueStartValue, true, addError);
        let stopValue: Value | null = checkValue(valueStopeValue, true, addError);

        let context = null;
        if (contextValue.length > 0) {
            context = new Entity(contextValue);
            if (!context.isValid()) {
                valid = false;
                errors.push("Invalid Context.")
            }
        }

        if (valid) {
            $ligature.query(dataset, async (tx) => {
                let res = null;
                if (stopValue != null) {
                    let range: LiteralRange | null = makeLiteralRange(startValue, stopValue);
                    if (range == null) {
                        addError("Invalid LiteralRange.");
                    } else {
                        res = await tx.matchStatements(entity, attribute, range, context); //TODO handle errors
                    }
                } else {
                    res = await tx.matchStatements(entity, attribute, startValue, context); //TODO handle errors
                }
                if (res != null) {
                    messages.push("Found" + res); //TODO pretty print Statement (probably using lig)
                }
            })
        }
    }

    function makeLiteralRange(start: Value, end: Value): LiteralRange | null {
        let startType = typeof start;
        let endType = typeof end;
        if (startType === 'number' && endType === 'number') {
            return { start: start as number, end: end as number };
        } else if (startType === 'bigint' && endType === 'bigint') {
            return { start: start as bigint, end: end as bigint };
        } else if (startType === 'string' && endType === 'string') {
            return { start: start as string, end: end as string };
        } else {
            return null;
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
        <label for="valueStartQueryInput" class="form-label">Value ?</label>
        <input type="text" class="form-control" id="valueStartQueryInput" placeholder="Value Start">
        <input type="text" class="form-control" id="valueStopQueryInput" placeholder="Value Stop">
    </div>
    <div class="col">
        <label for="contextQueryInput" class="form-label">Context</label>
        <input type="text" class="form-control" id="contextQueryInput" placeholder="Context">
    </div>
    <div class="col">
        <button type="button" class="btn btn-outline-dark" on:click={() => queryStatements()}>Query</button>
    </div>
</div>
