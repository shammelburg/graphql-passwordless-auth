const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport')
const mailerhbs = require('nodemailer-express-handlebars')

module.exports = async function (folderAndTemplateName, mailOptions) {

    const nodemailerConfig = require('../../config/nodemailer.config');
    const transporter = nodemailer.createTransport(sgTransport(nodemailerConfig));
    const root = './src/services/nodemailer/';

    const handlebarOptions = {
        viewEngine: {
            extName: '.hbs',
            partialsDir: `${root}${folderAndTemplateName}`,
            layoutsDir: `${root}${folderAndTemplateName}`,
            defaultLayout: folderAndTemplateName + '.hbs'
        },
        viewPath: `${root}${folderAndTemplateName}`,
        extName: '.hbs'
    };

    transporter.use('compile', mailerhbs(handlebarOptions));

    return new Promise((resolve, reject) => {
        try {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    resolve('Email sent: ' + info.message);
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}