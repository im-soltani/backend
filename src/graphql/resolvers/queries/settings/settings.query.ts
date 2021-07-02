import { SettingsModel } from "../../../../models";

export default (_, {}, { user: {} }) => {
  return SettingsModel.findOne().then(settings => {
    return settings;
  });
};
