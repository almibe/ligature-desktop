<script lang="typescript">
    import { createEventDispatcher, onMount } from 'svelte';
    import { ligature } from "../../store/store";
    import { Dataset } from "@ligature/ligature";

    export let removeModalState;

    let dispatch = createEventDispatcher();
    let showModal = () => {};

    $: {
        if (removeModalState.show) {
            showModal();
        }
    }

    let removeDatasetModal;

    const enterKeyListener = event => {
        if (event.isComposing) {
            return;
        }
        if (event.code === "Enter") {
            removeDataset();
        }
    }

    onMount(async () => {
        let bs = await import("../../../node_modules/bootstrap/dist/js/bootstrap.esm");
        let modalEl = document.getElementById('removeDatasetModal');
    	removeDatasetModal = new bs.Modal(modalEl, {});

        showModal = () => {
	        removeDatasetModal.show();
            removeModalState.show = true;
            window.addEventListener("keypress", enterKeyListener);
        }

        modalEl.addEventListener('hide.bs.modal', function (event) {
            window.removeEventListener("keypress", enterKeyListener);
            removeModalState.show = false;
            dispatch('updateDatasets');
        })
    })

    async function removeDataset() {
        await $ligature.deleteDataset(new Dataset(removeModalState.dataset.name)); //TODO handle errors
        removeDatasetModal.hide();
    }

    function cancel() {
        removeDatasetModal.hide();
    }
</script>

<div class="modal fade" id="removeDatasetModal" tabindex="-1" aria-labelledby="removeDatasetModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="removeDatasetModalLabel">Remove Dataset?</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Are you sure you want to remove {removeModalState.dataset ? removeModalState.dataset.name : ""}?
            </div>
            <div class="modal-footer">
                <div class="control">
                    <button class="btn btn-outline-danger" on:click={removeDataset}>Yes</button>
                </div>
                <div class="control">
                    <button class="btn btn-outline-dark" on:click={cancel}>No</button>
                </div>
            </div>
        </div>
    </div>
</div>
