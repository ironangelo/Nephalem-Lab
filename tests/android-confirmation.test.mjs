import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const activity=readFileSync(new URL('../android/app/src/main/java/cl/ironangelo/nephalemlab/MainActivity.java',import.meta.url),'utf8');
const ui=readFileSync(new URL('../src/universal-ui.js',import.meta.url),'utf8');
test('embedded Android WebView installs the JS dialog host before loading Nephalem Lab',()=>{
 assert.ok(activity.includes('import android.webkit.WebChromeClient;'));
 assert.ok(activity.includes('webView.setWebChromeClient(new WebChromeClient());'));
 assert.ok(activity.indexOf('webView.setWebChromeClient')<activity.indexOf('webView.loadUrl('));
});
test('user sees state while filtering instead of a silent Save observation',()=>{
 assert.ok(ui.includes('function announceObservation('));
 assert.ok(ui.includes('filterWorker.postMessage('));
 assert.ok(ui.includes('function saveObservationDraft('));
});
