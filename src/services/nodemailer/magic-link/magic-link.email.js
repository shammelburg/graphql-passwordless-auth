const prepareEmail = require('../prepare-mail');

const folderAndTemplateName = 'magic-link';

module.exports = async function ({ firstName, to, cc, subject, loginUrl, ip }) {
    var mailOptions = {
        from: {
            name: process.env.SENDGRID_DISPLAY_NAME,
            address: process.env.SENDGRID_FROM
        },
        to: to,
        cc: cc || [],
        subject: subject || folderAndTemplateName,
        template: folderAndTemplateName,
        context: {
            firstName,
            loginUrl,
            ip,
            duration: process.env.JWT_MAGIC_LINK_DURATION
        }
    };

    return await prepareEmail(folderAndTemplateName, mailOptions);
};