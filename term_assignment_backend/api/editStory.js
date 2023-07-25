const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const SNSClient = new AWS.SNS({
    region: 'us-east-1',
});

const STORY_EDITS_TABLE_NAME = process.env.STORY_EDITS_TABLE_NAME;

exports.editStory = async (event, context, callback) => {
    const { story_id, user_id, editedContent } = JSON.parse(event.body);
    const editedTimestamp = new Date().toISOString();
    const editId = uuidv4();
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*', // Replace '*' with the actual domain of your frontend
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST', // Replace 'POST' with the allowed methods (e.g., 'GET, POST')
        'Access-Control-Allow-Credentials': true, // If you need to send credentials (cookies, etc.) in the request
    };
    const params = {
        TableName: STORY_EDITS_TABLE_NAME,
        Item: {
            editId: editId,
            story_id: story_id,
            user_id: user_id,
            editedContent: editedContent,
            editedTimestamp: editedTimestamp,
        },
    };

    try {

        console.log('Creating or getting SNS topic ARN...');
        const topicName = `story-topic-${story_id}`;
        const createTopicResponse = await SNSClient.createTopic({ Name: topicName }).promise();
        const topicArn = createTopicResponse.TopicArn;
        console.log('Successfully created SNS topic:', topicArn);

        // Subscribe the user to the SNS topic
        console.log('Subscribing user to the SNS topic...');
        const subscribeParams = {
            TopicArn: topicArn,
            Protocol: 'email', // Assuming the user_id is the email address
            Endpoint: user_id,
        };
        const subscriptionResponse = await SNSClient.subscribe(subscribeParams).promise();
        console.log('Successfully subscribed to the SNS topic:', subscriptionResponse.SubscriptionArn);

        callback(null, {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify({ message: 'Edit saved successfully' }),
        });
    } catch (err) {
        console.error('Error processing edit:', err);
        callback(null, {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ message: err.message }),
        });
    }
};
