import { ApplicationModel } from "../../../../models";
import * as moment from "moment";

export default (_, __, { user: { _id } }) =>
  ApplicationModel.find({ state: "ACCEPTED" }).then(applications => {
    let seven = 0;
    let one = 0;
    let two = 0;
    let three = 0;
    let four = 0;
    let five = 0;
    let six = 0;
    (applications as any).map(application => {
      if (
        moment()
          .startOf("day")
          .diff(moment(application.createdAt).startOf("day"), "days") === 0 ||
        moment()
          .startOf("day")
          .diff(moment(application.updatedAt).startOf("day"), "days") === 0
      )
        one = one + 1;
      else if (
        moment()
          .startOf("day")
          .diff(moment(application.createdAt).startOf("day"), "days") === 1 ||
        moment()
          .startOf("day")
          .diff(moment(application.updatedAt).startOf("day"), "days") === 1
      )
        two = two + 1;
      else if (
        moment()
          .startOf("day")
          .diff(moment(application.createdAt).startOf("day"), "days") === 2 ||
        moment()
          .startOf("day")
          .diff(moment(application.updatedAt).startOf("day"), "days") === 2
      )
        three = three + 1;
      else if (
        moment()
          .startOf("day")
          .diff(moment(application.createdAt).startOf("day"), "days") === 3 ||
        moment()
          .startOf("day")
          .diff(moment(application.updatedAt).startOf("day"), "days") === 3
      )
        four = four + 1;
      else if (
        moment()
          .startOf("day")
          .diff(moment(application.createdAt).startOf("day"), "days") === 4 ||
        moment()
          .startOf("day")
          .diff(moment(application.updatedAt).startOf("day"), "days") === 4
      )
        five = five + 1;
      else if (
        moment()
          .startOf("day")
          .diff(moment(application.createdAt).startOf("day"), "days") === 5 ||
        moment()
          .startOf("day")
          .diff(moment(application.updatedAt).startOf("day"), "days") === 5
      )
        six = six + 1;
      else if (
        moment()
          .startOf("day")
          .diff(moment(application.createdAt).startOf("day"), "days") === 6 ||
        moment()
          .startOf("day")
          .diff(moment(application.updatedAt).startOf("day"), "days") === 6
      )
        seven = seven + 1;
    });
    return [one, two, three, four, five, six, seven];
  });
