const axios = require('axios');

exports.sendSMS = async (to, body) => {
    try {
        const response = await axios.post(
            'https://www.bulksmsnigeria.com/api/v2/sms',
            {
                from: process.env.SENDER_ID, 
                to: to, 
                body: body,
                api_token: process.env.BULK_SMS_API_TOKEN 
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('SMS sent:', response.data);
    } catch (error) {
        console.error('Error sending SMS:', error.response ? error.response.data : error.message);
    }
};
