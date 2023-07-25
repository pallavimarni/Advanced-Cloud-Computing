const AWS = require('aws-sdk');

const sqs = new AWS.SQS();

const pollQueue = async (queueUrl) => {
    try {
        const response = await sqs.receiveMessage({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 10,    // Maximum number of messages to receive in one API call
            VisibilityTimeout: 60,      // Adjust this value based on your requirements
            WaitTimeSeconds: 20         // Adjust this value based on your requirements
        }).promise();

        return response.Messages || [];
    } catch (error) {
        console.error(`Error receiving messages from SQS: ${error}`);
        return [];
    }
};

exports.findMessagesByStoryID = async (event) => {
    const { body } = event;
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*', // Replace '*' with the actual domain of your frontend
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST', // Replace 'POST' with the allowed methods (e.g., 'GET, POST')
        'Access-Control-Allow-Credentials': true, // If you need to send credentials (cookies, etc.) in the request
    };
    let story_id_to_find;

    try {
        const requestBody = JSON.parse(body);
        story_id_to_find = requestBody.story_id;
    } catch (error) {
        return {
            statusCode: 400,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'Invalid request body' }),
        };
    }

    const sqs_queue_url = 'https://sqs.us-east-1.amazonaws.com/587818610762/EditsQueue';

    try {
        const messages = await pollQueue(sqs_queue_url);

        const found_messages = [];

        for (const message of messages) {
            try {
                const body = JSON.parse(message.Body);
                if (body.story_id && body.story_id === story_id_to_find) {
                    found_messages.push({
                        messageId: message.MessageId, // Add the MessageId to the response
                        ...body,
                    });
                }
            } catch (e) {
                console.error(`Error processing message: ${e}`);
            }
        }

        return {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify(found_messages),
        };
    } catch (error) {
        console.error(`Error fetching story edits from SQS: ${error}`);
        return {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
