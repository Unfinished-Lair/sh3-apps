import type { GraphDomain, GraphDomainHost } from './types';

export interface GraphDomainContribution {
  /** Stable, shard-prefixed id, e.g. 'my-shader-app:shader-graph'. */
  id: string;
  /** Lazy factory; called at most once per id per registry instance. */
  factory: (host: GraphDomainHost) => GraphDomain;
}

export interface DomainListing {
  id: string;
  /** Best-effort label without instantiation; same as id when unknown. */
  label: string;
}

export interface DomainRegistry {
  register(c: GraphDomainContribution): void;
  unregister(id: string): void;
  /** Instantiates on first call. Returns null when id is not registered. */
  get(id: string): GraphDomain | null;
  /** Lazy listing — does NOT instantiate factories. */
  list(): DomainListing[];
  clear(): void;
}

function makeHost(id: string): GraphDomainHost {
  return {
    log: (level, msg, ...args) => {
      const fn =
        level === 'debug' ? console.debug :
        level === 'info'  ? console.info  :
        level === 'warn'  ? console.warn  : console.error;
      fn(`[graph:${id}] ${msg}`, ...args);
    },
  };
}

export function createDomainRegistry(): DomainRegistry {
  const factories = new Map<string, GraphDomainContribution['factory']>();
  const instances = new Map<string, GraphDomain>();

  return {
    register(c) { factories.set(c.id, c.factory); },
    unregister(id) {
      factories.delete(id);
      instances.delete(id);
    },
    get(id) {
      const cached = instances.get(id);
      if (cached) return cached;
      const factory = factories.get(id);
      if (!factory) return null;
      const inst = factory(makeHost(id));
      instances.set(id, inst);
      return inst;
    },
    list() {
      return Array.from(factories.keys()).map((id) => ({ id, label: id }));
    },
    clear() {
      factories.clear();
      instances.clear();
    },
  };
}
