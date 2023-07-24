const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ region: 'us-east-1' }); // Replace 'us-east-1' with your desired region

exports.sendMessageToQueue = async (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const { story_id, user_id, editedContent } = requestBody;

    const sqsParams = {
        MessageBody: JSON.stringify({ story_id, user_id, editedContent }),
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/587818610762/EditsQueue', // Replace 'YOUR_SQS_QUEUE_URL' with the actual URL of your SQS queue
    };
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*', // Replace '*' with the actual domain of your frontend
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST', // Replace 'POST' with the allowed methods (e.g., 'GET, POST')
        'Access-Control-Allow-Credentials': true, // If you need to send credentials (cookies, etc.) in the request
    };
    try {
        // Send the message to the SQS queue
        await sqs.sendMessage(sqsParams).promise();

        callback(null, {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify({ message: 'Message sent to SQS queue successfully' }),
        });
    } catch (err) {
        callback(null, {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ message: err.message }),
        });
    }
};
