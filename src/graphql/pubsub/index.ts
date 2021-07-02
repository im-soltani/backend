import {PubSub} from "graphql-subscriptions";
const instance = new PubSub();

(instance as any).ee.setMaxListeners(10e1000000);

export default instance;