// // import { EventEmitter } from 'events';

// // const eventEmitter = new EventEmitter();

// // export default eventEmitter;
// import { EventEmitter } from 'events';

// const eventEmitter = new EventEmitter();
// export default eventEmitter;

import EventEmitter from 'events';

class PubSub extends EventEmitter { }

const eventEmitterInstance = new PubSub();

export default eventEmitterInstance;