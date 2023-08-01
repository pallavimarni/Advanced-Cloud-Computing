const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.getStoriesByAuthorEmail = async (event) => {
    const { email } = JSON.parse(event.body);
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Credentials': true,
    };
    if (!email) {
        return {
            statusCode: 400,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'Invalid request body' }),
        };
    }

    const params = {
        TableName: 'storyTable',
        FilterExpression: 'author = :email',
        ExpressionAttributeValues: {
            ':email': email,
        },
        ProjectionExpression: 'author, story_id',
    };

    console.log('Params:', params);

    try {
        const result = await dynamoDB.scan(params).promise();
        const stories = result.Items;

        console.log('Result:', result);

        return {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify(stories),
        };
    } catch (error) {
        console.error('Error fetching stories from DynamoDB:', error);
        return {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
