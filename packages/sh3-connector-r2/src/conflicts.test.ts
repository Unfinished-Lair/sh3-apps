import { describe, it, expect, vi } from 'vitest';
import type { ConflictsApi } from 'sh3-core';
import { presentImportConflicts, type ImportConflictInput } from './conflicts';

function fakeConflictsApi(over: Partial<ConflictsApi> = {}): ConflictsApi {
  return {
    resolve: vi.fn(async () => ({ status: 'resolved', choices: [], skipped: [] })),
    resolveDocuments: vi.fn(async () => ({ status: 'resolved', resolved: [], failed: [], skipped: [] })),
    ...over,
  };
}

describe('presentImportConflicts', () => {
  it('returns [] and does not call resolve when input is empty', async () => {
    const api = fakeConflictsApi();
    const result = await presentImportConflicts(api, []);
    expect(result).toEqual([]);
    expect(api.resolve).not.toHaveBeenCalled();
  });
});
