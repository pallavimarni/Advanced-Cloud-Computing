const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ region: 'us-east-1' }); // Replace 'us-east-1' with your desired region

exports.sendMessageToQueue = async (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const { story_id, user_id, editedContent, author } = requestBody;



    const sqsParams = {
        MessageBody: JSON.stringify({ story_id, user_id, editedContent, author }),
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/712307421426/EditsQueue",
    };

    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Credentials': true,
    };

    try {

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
