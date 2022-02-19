const {init, trace, traceAsync} = require('@jahiduls/lib-tracing');

// Initialize the library
init();

const sum = (a, b) => {
    console.log(`Returning: ${a + b}`);
    return a + b;
}

// Decorate a function
const tracedSum = trace(sum, 'sum-test');

// Run the decorated function
const sumResult = tracedSum(1, 2);
console.log(`Result of sum: ${sumResult}`);

const asyncMult = async (a, b) => {
    console.log(`Returning: ${a * b}`);

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    await timeout(2000);

    return a * b;
}

const tracedAsyncMult = traceAsync(asyncMult, 'mult-test');

(async () => {
    const multResult = await tracedAsyncMult(2, 3);
    console.log(`Result of mult: ${multResult}`);
})();
