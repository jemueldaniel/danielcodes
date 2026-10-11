import {build} from 'esbuild';
import fs from 'node:fs';
await build({entryPoints:['client.mjs'],bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022',legalComments:'inline',outfile:'bundle.js',logLevel:'info'});
const result=fs.readFileSync('bundle.js');
if(result.length>1700000)throw Error('Bundled EVM exceeds 1.7MB explicit cap');
console.log('BUNDLE_BYTES',result.length);
