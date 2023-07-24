const AWS = require('aws-sdk');
const DynamoDB = require('aws-sdk/clients/dynamodb');
const { v4: uuidv4 } = require('uuid');

const DocumentClient = new DynamoDB.DocumentClient({
    region: 'us-east-1',
    maxRetries: 3,
    httpOptions: {
        timeout: 5000,
    },
});

const STORY_EDITS_TABLE_NAME = process.env.STORY_EDITS_TABLE_NAME;
const STORY_TABLE_NAME = process.env.STORY_TABLE_NAME;

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

        await DocumentClient.put(params).promise();

        // Update the lastEditedId in the storyTable
        const updateParams = {
            TableName: STORY_TABLE_NAME,
            Key: {
                story_id: story_id,
            },
            UpdateExpression: 'SET lastEditedId = :editId',
            ExpressionAttributeValues: {
                ':editId': editId,
            },
            ReturnValues: 'UPDATED_NEW',
        };
        const updateStoryParams = {
            TableName: STORY_TABLE_NAME,
            Key: {
                story_id: story_id,
            },
            UpdateExpression: 'SET story = :editedContent',
            ExpressionAttributeValues: {
                ':editedContent': editedContent,
            },
            ReturnValues: 'UPDATED_NEW',
        };
        await DocumentClient.update(updateStoryParams).promise();

        await DocumentClient.update(updateParams).promise();

        callback(null, {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify({ message: 'Edit saved successfully' }),
        });

    } catch (err) {
        callback(null, {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ message: err.message }),
        });
    }
};
