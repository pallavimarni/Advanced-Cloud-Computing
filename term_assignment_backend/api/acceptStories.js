const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

exports.acceptStories = async (event) => {
    const { story_id, editedContent, messageId } = JSON.parse(event.body);
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*', // Replace '*' with the actual domain of your frontend
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST', // Replace 'POST' with the allowed methods (e.g., 'GET, POST')
        'Access-Control-Allow-Credentials': true, // If you need to send credentials (cookies, etc.) in the request
    };
    const params = {
        TableName: 'storyTable',
        Key: {
            story_id: story_id,
        },
        UpdateExpression: 'SET story = :editedContent',
        ExpressionAttributeValues: {
            ':editedContent': editedContent,
        },
        ReturnValues: 'ALL_NEW',
    };

    try {
        const result = await dynamodb.update(params).promise();
        const updatedStory = result.Attributes;

        return {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify({ message: 'Story accepted successfully', updatedStory }),
        };
    } catch (error) {
        console.error('Error updating story:', error);

        return {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
