const AWS = require('aws-sdk');

const sqs = new AWS.SQS();

const pollQueue = async (queueUrl) => {

    try {
        const response = await sqs.receiveMessage({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 10,
            VisibilityTimeout: 60,
            WaitTimeSeconds: 10
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Credentials': true,
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

    const sqs_queue_url = 'https://sqs.us-east-1.amazonaws.com/712307421426/EditsQueue';

    try {
        const messages = await pollQueue(sqs_queue_url);

        const found_messages = [];

        for (const message of messages) {
            try {
                const body = JSON.parse(message.Body);
                if (body.story_id && body.story_id === story_id_to_find) {
                    found_messages.push({
                        messageId: message.MessageId,
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
