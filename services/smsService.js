const messagebird = require('messagebird');
const client = messagebird(process.env.MESSAGEBIRD_API_KEY);

exports.sendSMS = (to, body) => {
    const params = {
        originator: process.env.MESSAGEBIRD_PHONE_NUMBER,
        recipients: [to],
        body: body,
    };

    client.messages.create(params, (err, response) => {
        if (err) {
            console.error('Error sending SMS:', err);
            throw err;
        } else {
            console.log('SMS sent:', response.id);
        }
    });
};
