#!/bin/sh
rm -rf node_modules/vue
rm -rf node_modules/@vue
mkdir node_modules/@vue
cp -r ./deps/vue node_modules
cp -r ./deps/compiler-core node_modules/@vue
cp -r ./deps/compiler-dom node_modules/@vue
cp -r ./deps/reactivity node_modules/@vue
cp -r ./deps/runtime-core node_modules/@vue
cp -r ./deps/runtime-dom node_modules/@vue
cp -r ./deps/babel-helper-vue-transform-on node_modules/@vue
