<script lang="typescript">
    import { onMount } from 'svelte';
    import { store, Dataset } from "../../store/store";
    import { modalState } from '../../store/modalState';

    export let errorMessages = [];

    let showModal = (dataset: null | Dataset) => {}
    let title: String = ""
    let submitButton: String = ""

	const unsubscribe = modalState.subscribe(modalState => {
        if (modalState.show) {
            title = modalState.title
            submitButton = modalState.dataset ? "Edit" : "Add"
            showModal(modalState.dataset)
        }
	});

    let newDatasetModal;

    const enterKeyListener = event => {
        if (event.isComposing) {
            return;
        }
        if (event.code === "Enter") {
            addNewDataset()
        }
    }

    onMount(async () => {
        let bs = await import("../../../node_modules/bootstrap/dist/js/bootstrap.esm");
        let modalEl = document.getElementById('newDatasetModal');
    	newDatasetModal = new bs.Modal(modalEl, {});

        showModal = (dataset: null | Dataset) => {
            (document.getElementById('datasetName') as any).value = dataset ? dataset.name : '';
            (document.getElementById('datasetUrl') as any).value = dataset ? dataset.url : '';
            (document.getElementById('ligatureEndpoint') as any).checked = dataset ? dataset.type == "Ligature" : false;
            (document.getElementById('sparqlEndpoint') as any).checked = dataset ? dataset.type == "SPARQL" : false;
	        newDatasetModal.show()
            window.addEventListener("keydown", enterKeyListener);
        }

        modalEl.addEventListener('hide.bs.modal', function (event) {
            errorMessages.length = 0;
            window.removeEventListener("keydown", enterKeyListener)
            modalState.hide();
        })

        //handle focus
        var modal = document.getElementById('newDatasetModal');
        var datasetName = document.getElementById('datasetName');

        modal.addEventListener('shown.bs.modal', function () {
            datasetName.focus()
        });
    })

    function addNewDataset() {
        errorMessages.length = 0;
        let name = (document.getElementById('datasetName') as any).value.trim();
        let url = (document.getElementById('datasetUrl') as any).value.trim();
        let ligatureEndpoint = (document.getElementById('ligatureEndpoint') as any).checked;
        let sparqlEndpoint = (document.getElementById('sparqlEndpoint') as any).checked;
        let type: "Ligature" | "SPARQL"
        let valid = true;

        if (name.length == 0) {
            errorMessages.push("Name is required.");
            errorMessages = errorMessages;
            valid = false;
        }

        if ((modalState.dataset() == null || name != modalState.dataset().name) && store.isDuplicate(name)) {
            errorMessages.push("Dataset name already exists.");
            errorMessages = errorMessages;
            valid = false;
        }

        if (ligatureEndpoint) {
            type = "Ligature";
        } else if (sparqlEndpoint) {
            type = "SPARQL";
        } else {
            errorMessages.push("Must set Endpoint tpye.");
            errorMessages = errorMessages;
            valid = false;
        }

        if (url.length == 0) {
            errorMessages.push("URL is required.");
            errorMessages = errorMessages;
            valid = false;
        }

        if (!validURL(url)) {
            errorMessages.push("URL is invalid.");
            errorMessages = errorMessages;
            valid = false;
        }

        if (valid) {
            if (modalState.dataset() != null) {
                store.removeDataset(modalState.dataset())
            }
            store.addDataset({name: name, url: url, type: type})
            newDatasetModal.hide()
        }
    }

    const urlPattern = new RegExp('^(https?:\\/\\/)'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))|'+ // OR ip (v4) address
            '(localhost)'+ // OR localhost
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    function validURL(str: string) {
        return urlPattern.test(str);
    }

    function cancel() {
        newDatasetModal.hide();
    }
</script>

<div class="modal fade" id="newDatasetModal" tabindex="-1" aria-labelledby="newDatasetModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="newDatasetModalLabel">{title}</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="field">
                    <label for="datasetName" class="label">Name</label>
                    <div class="control">
                        <input id="datasetName" class="input" type="text">
                    </div>
                </div>

                <div class="field">
                    <div class="control">
                        <label class="radio">
                            <input type="radio" name="endpoint" id="ligatureEndpoint">
                            Ligature Endpoint
                        </label>
                        <label class="radio">
                            <input type="radio" name="endpoint" id="sparqlEndpoint">
                            SPARQL Endpoint
                        </label>
                    </div>
                </div>

                <div class="field">
                    <label class="label" for="datasetUrl">URL</label>
                    <div class="control">
                        <input class="input" type="text" id="datasetUrl">
                    </div>
                </div>
            </div>
            {#if errorMessages.length > 0}
            <div class="alert alert-danger" role="alert">
                <ul>
                    {#each errorMessages as errorMessage}
                        <li>{errorMessage}</li>
                    {/each}
                </ul>
            </div>
            {/if}
            <div class="modal-footer">
                <div class="control">
                    <button class="btn btn-outline-dark" on:click={addNewDataset}>{submitButton}</button>
                </div>
                <div class="control">
                    <button class="btn btn-outline-danger" on:click={cancel}>Cancel</button>
                </div>
            </div>
        </div>
    </div>
</div>
