export * from '@vue/runtime-dom';

if ( (process.env.NODE_ENV !== 'production')) {
    console[console.info ? 'info' : 'log'](`You are running a development build of Vue.\n` +
        `Make sure to use the production build (*.prod.js) when deploying for production.`);
}
