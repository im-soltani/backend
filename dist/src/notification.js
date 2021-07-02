"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onesignal = require("simple-onesignal");
const sendToCandidat = (_data, cb = null) => {
    onesignal.configure("9f63cf2c-c2ba-4c65-9f15-54d8de7e45a7", "MjQ4ZDNhODMtMDM2Yi00NjU0LWEyZWEtMTAxNzUxYjBhYWRm");
    return onesignal.sendMessage({
        headings: { en: _data.head ? _data.head : "" },
        ttl: 30,
        contents: { en: _data.body ? _data.body : "" },
        // check this filter
        filters: [{ field: "tag", relation: "=", key: "id", value: _data.userId }],
        included_segments: ["Active Users", "Inactive Users"],
        buttons: _data.button,
        data: _data.data
    }, function (err, resp) {
        if (cb) {
            cb(err, resp);
        }
    });
};
const sendToEntreprise = (_data, cb = null) => {
    onesignal.configure("5c2921c4-b734-45d3-9319-f7ec093d6792", "MzIzZjVkODAtZmQyZC00ODI0LWIxMGEtNWZhMmQ1NmUwYTky");
    return onesignal.sendMessage({
        headings: { en: _data.head ? _data.head : "" },
        ttl: 30,
        contents: { en: _data.body ? _data.body : "" },
        // check this filter
        filters: [{ field: "tag", relation: "=", key: "id", value: _data.userId }],
        included_segments: ["Active Users", "Inactive Users"],
        buttons: _data.button,
        data: _data.data
    }, function (err, resp) {
        if (cb) {
            cb(err, resp);
        }
    });
};
exports.default = {
    sendToCandidat,
    sendToEntreprise
};
//# sourceMappingURL=notification.js.map