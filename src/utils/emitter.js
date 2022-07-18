import mitt from 'mitt';

const emitter = mitt();

// Extending with .once
// https://github.com/developit/mitt/issues/136
emitter.once = function(type, handler) {
    const fn = (...args) => {
        emitter.off(type, fn);
        handler(args);
    };

    emitter.on(type, fn);
};

emitter.$emit = function(t, e) {
    emitter.emit(t, e);
};
emitter.$on = function(t, e) {
    emitter.on(t, e);
};
emitter.$once = function(t, e) {
    emitter.once(t, e);
};
emitter.$off = function(t, e) {
    emitter.off(t, e);
};

export { emitter };