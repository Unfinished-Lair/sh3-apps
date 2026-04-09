/**
 * sh3-registry client entry — combo bundle (shard + companion app).
 * Default export is the shard; named "app" export is the companion app.
 * The loader's duck-typing iterates all exports and classifies each.
 */
import { registryShard } from './registryShard.svelte';
import { registryApp } from './registryApp';

export default registryShard;
export { registryApp as app };
