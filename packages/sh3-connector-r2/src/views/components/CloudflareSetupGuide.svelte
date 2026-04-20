<script lang="ts">
  type Props = { onClose: () => void };
  let { onClose }: Props = $props();

  const origin = typeof location !== 'undefined' ? location.origin : '<SH3 origin>';
  const corsJson = `[
  {
    "AllowedOrigins": ["${origin}"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]`;
</script>

<aside class="r2-guide" aria-label="Cloudflare R2 setup guide">
  <header class="r2-guide__header">
    <h3>Cloudflare R2 setup</h3>
    <button class="r2-guide__close" type="button" aria-label="Close guide" onclick={onClose}>×</button>
  </header>

  <ol class="r2-guide__steps">
    <li>
      <strong>Sign in to Cloudflare.</strong>
      Go to <a href="https://dash.cloudflare.com" target="_blank" rel="noopener">dash.cloudflare.com</a>.
      R2 requires a payment method to enable, but the free tier covers 10 GB of storage and 1M Class A / 10M Class B ops per month.
    </li>

    <li>
      <strong>Enable R2 and create a bucket.</strong>
      From the left sidebar, click <em>R2</em>. If R2 isn't enabled, click <em>Enable R2</em> and accept the terms.
      Then click <em>Create bucket</em>, give it a name (e.g. <code>sh3-backups</code>), and pick a location hint close to you.
    </li>

    <li>
      <strong>Copy your Account ID.</strong>
      On the R2 overview page, the right sidebar shows <em>Account ID</em>. Paste it into the form's Account ID field.
    </li>

    <li>
      <strong>Create an API token.</strong>
      Top right of the R2 page: <em>Manage R2 API Tokens</em> → <em>Create API token</em>.
      Name it (e.g. <code>sh3-connector-r2</code>), choose <em>Object Read &amp; Write</em>, scope it to your bucket.
      After creating, copy the <em>Access Key ID</em> and <em>Secret Access Key</em> — they are shown <strong>once</strong> — into the form.
    </li>

    <li>
      <strong>Configure CORS on the bucket.</strong>
      Open your bucket → <em>Settings</em> → <em>CORS Policy</em> → <em>Edit CORS policy</em> → paste:
      <pre>{corsJson}</pre>
      Without this, the browser blocks uploads from this SH3 origin.
    </li>

    <li>
      <strong>Fill in the form and save.</strong>
      Back in the left column: fill Label + Account ID + Bucket + Key prefix (optional) + Access Key + Secret.
      <em>Save &amp; validate</em> issues a signed <code>HeadBucket</code> — a green result means credentials and CORS are both working.
    </li>
  </ol>
</aside>

<style>
  .r2-guide {
    background: var(--sh3-surface, #1a1a1a);
    border: 1px solid var(--sh3-border, #2a2a2a);
    border-radius: 4px;
    padding: 12px 16px;
    overflow: auto;
    max-height: 100%;
  }
  .r2-guide__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .r2-guide__header h3 { margin: 0; font-size: 1em; }
  .r2-guide__close {
    background: transparent;
    color: inherit;
    border: none;
    font-size: 1.4em;
    line-height: 1;
    cursor: pointer;
    padding: 0 4px;
  }
  .r2-guide__close:hover { color: var(--sh3-accent, #4a9eff); }
  .r2-guide__steps { padding-left: 1.25em; display: flex; flex-direction: column; gap: 10px; font-size: 0.9em; }
  .r2-guide__steps li { line-height: 1.45; }
  .r2-guide__steps code { font-size: 0.9em; background: var(--sh3-bg, #111); padding: 1px 4px; border-radius: 2px; }
  .r2-guide__steps a { color: var(--sh3-accent, #4a9eff); }
  .r2-guide__steps pre {
    font-size: 0.82em;
    background: var(--sh3-bg, #111);
    padding: 8px;
    border-radius: 3px;
    overflow: auto;
    margin: 6px 0 0;
  }
</style>
