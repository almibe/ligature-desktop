import { readable } from 'svelte/store';
import { LigatureDexie } from '@ligature/ligature-indexeddb';

export const ligature = readable(new LigatureDexie("ligature-lab"));
