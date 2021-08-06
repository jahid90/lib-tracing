const { trace } = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { GrpcInstrumentation } = require("@opentelemetry/instrumentation-grpc");

const uris = require('./config/uris');
const constants = require('./config/constants');

if (constants.EnableLogTraceToConsole) {
    const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
}

const provider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: constants.SERVICE_NAME,
    })
});

const exporterOptions = uris.ZIPKIN_URI ? { url: uris.ZIPKIN_URI } : {};

provider.addSpanProcessor(
    new SimpleSpanProcessor(
        new ZipkinExporter(exporterOptions)
    )
);

const init = () => {
    provider.register();

    registerInstrumentations({
        instrumentations: [
            new HttpInstrumentation(),
            new GrpcInstrumentation(),
        ],
    });
}

const tracer = trace.getTracer(constants.SERVICE_NAME);

function traceFn(cb, label) {

    return function() {

        // Start the instrumentation
        const span = tracer.startSpan(label);

        // Invoke the function
        const result = cb.apply(this, arguments);

        // End the instrumentation
        span.end();

        // Return the result
        return result;
    };
}

function traceAsyncFn(cb, label) {

    return async function() {

        // Start the instrumentation
        const span = tracer.startSpan(label);

        // Invoke the function
        const result = cb.apply(this, arguments);

        // End the instrumentation
        span.end();

        // Return the result
        return result;
    }
}

module.exports = {
    trace: traceFn,
    traceAsync: traceAsyncFn,
    // Call this before starting the express server
    init
};
