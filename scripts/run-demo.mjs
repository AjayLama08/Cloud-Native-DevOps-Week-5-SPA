import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

const modulePath = process.argv[2];
if (!modulePath) {
  console.error('Usage: node scripts/run-demo.mjs /scripts/<demo>.ts');
  process.exitCode = 1;
} else {
  const outDir = await mkdtemp(join(tmpdir(), 'reviews-spa-demo-'));
  try {
    await build({
      configFile: false,
      logLevel: 'error',
      ssr: { noExternal: true },
      build: {
        emptyOutDir: true,
        outDir,
        ssr: resolve(process.cwd(), modulePath.replace(/^\/+/, '')),
        rollupOptions: { output: { entryFileNames: 'demo.mjs' } },
      },
    });
    await import(pathToFileURL(join(outDir, 'demo.mjs')).href);
  } finally {
    await rm(outDir, { force: true, recursive: true });
  }
}
