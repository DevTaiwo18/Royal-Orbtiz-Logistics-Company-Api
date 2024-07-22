const { initClient } = require('messagebird');
const messagebird = initClient(process.env.MESSAGEBIRD_API_KEY);

exports.sendSMS = (to, body) => {
    const params = {
        originator: process.env.MESSAGEBIRD_PHONE_NUMBER,
        recipients: [to],
        body: body,
    };

    messagebird.messages.create(params, (err, response) => {
        if (err) {
            console.error('Error sending SMS:', err);
            return; 
        } else {
            console.log('SMS sent:', response.id);
        }
    });
};
