import { readable } from 'svelte/store';
import { openLigatureSimpleIndexedDB } from '@ligature/ligature-indexeddb/lib/simple';
import { browser } from '$app/env';

export const ligature = readable(undefined, function start(set) {
    if (browser) {
        set(openLigatureSimpleIndexedDB("ligature-lab"))
    }

    return function stop() {
    };
});
