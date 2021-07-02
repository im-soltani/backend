import {ApplicationModel} from "../../../../models";
import pubSub from "../../../pubsub";

export default (_, {id,state}) => ApplicationModel.findById(id).then(application => {
    if (!application) {
        return null;
    }
    (application as any).state = state;
    pubSub.publish("APPLICATION_UPDATED", {applicationUpdated: application});
    return application.save();
});
