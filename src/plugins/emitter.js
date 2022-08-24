import { emitter } from '../utils/emitter';

const BvEmitterPlugin = {
    install(app, options) {
        const _emitter = emitter;

        app.config.globalProperties.$bvEmitter = _emitter;
        app.provide('bvEmitter', _emitter);
    },
};

export { BvEmitterPlugin };
