"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer"), fs = require("fs"), _jsy = require('jsy');
const sendMail = (option, cb) => {
    let htmlcontent = getHtml(option.template);
    if (htmlcontent &&
        _jsy(option.to) &&
        !_jsy(option.subject).isEmpty()) {
        htmlcontent = fillTemplate(htmlcontent, option.vars);
        if (option.footer)
            htmlcontent = htmlcontent + loadfooter();
        let from;
        try {
            from = option.from;
            getTransport().sendMail({
                to: option.to,
                subject: option.subject,
                html: htmlcontent,
                from: from
            }, function (err, info) {
                if (cb) {
                    cb(err, info);
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }
};
const getHtml = (templateName) => {
    try {
        const templatePath = "content/mails/" + templateName + ".html";
        const templateContent = fs.readFileSync(templatePath, "utf8");
        return templateContent;
    }
    catch (e) {
        console.log("exception", e);
        return false;
    }
};
const getTransport = () => {
    const smtpConfig = {
        host: 'mail.toolynk.com',
        port: 25,
        secure: false,
        auth: {
            user: 'bridge@toolynk.com',
            pass: 'G&340fvv'
        },
        tls: {
            ciphers: 'SSLv3'
        }
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const transport = nodemailer.createTransport(smtpConfig);
    return transport;
};
const fillTemplate = (htmlcontent, vars) => {
    let find, re;
    for (let k in vars) {
        if (vars.hasOwnProperty(k)) {
            find = '{{' + k + '}}';
            re = new RegExp(find, 'g');
            htmlcontent = htmlcontent.replace(re, vars[k]);
        }
    }
    return htmlcontent;
};
const loadfooter = () => {
    try {
        const templatePath = "content/mails/footer.html";
        const templateContent = fs.readFileSync(templatePath, "utf8");
        return templateContent;
    }
    catch (e) {
        return false;
    }
};
exports.default = sendMail;
//# sourceMappingURL=mailer.js.map