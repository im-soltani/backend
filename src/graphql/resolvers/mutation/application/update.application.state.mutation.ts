import { ApplicationModel } from "../../../../models";

export default (_, { id, state }) => {
  return ApplicationModel.findById(id).then(async application => {
    if (!application) {
      return null;
    } else {
      if ((application as any).state !== state) {
        (application as any).state = state;
        await application.save();
      }
      return ApplicationModel.findById(id).then(applicationd => {
        return applicationd;
      });
    }
  });
};
