import * as fs from 'fs';
import * as path from 'path';
const Util = require('util');
const ReadFile = Util.promisify(fs.readFile);
const Handlebars = require('handlebars');
import nodemailer from 'nodemailer'
import config from '../config';

const sendEmail = async (
    email: string,
    html: string,
    subject: string
) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: config.emailSender.email,
            pass: config.emailSender.appPass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"Academic Administration Solution" <fahimfiroz.ph@gmail.com>', // sender address
        to: email, // list of receivers
        subject, // Subject line
        //text: "Hello world?", // plain text body
        html, // html body
    });

    //console.log("Message sent: %s", info.messageId);
}

const createEmailContent = async (data: object, templateType: string) => {
    try {
        const templatePath = path.join(
            process.cwd(),
            `views/email-templates/${templateType}.template.hbs`
        );
        const content = await ReadFile(templatePath, 'utf8');

        const template = Handlebars.compile(content);

        return template(data);
    } catch (error) { }
};

export const EmailHelper = {
    sendEmail,
    createEmailContent
};
