import { SettingsModel } from "../../../../models";

export default (
  _,
  { variable, value },
  {
    user: {
      profile: { _id }
    }
  }
) => {
  return SettingsModel.findOne().then(async setting => {
    if (!setting) {
      return false;
    } else {
      (setting as any)[variable] = value;

      return await setting.save().then(res => {
        if (res) return true;
        else return false;
      });
    }
  });
};
