const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.getStoriesByAuthorEmail = async (event) => {
    const { email } = JSON.parse(event.body);
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*', // Replace '*' with the actual domain of your frontend
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST', // Replace 'POST' with the allowed methods (e.g., 'GET, POST')
        'Access-Control-Allow-Credentials': true, // If you need to send credentials (cookies, etc.) in the request
    };
    if (!email) {
        return {
            statusCode: 400,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'Invalid request body' }),
        };
    }

    const params = {
        TableName: 'storyTable', // Replace with the actual table name
        FilterExpression: 'author = :email',
        ExpressionAttributeValues: {
            ':email': email,
        },
        ProjectionExpression: 'author, story_id',
    };

    console.log('Params:', params); // Add this logging statement to check the parameters

    try {
        const result = await dynamoDB.scan(params).promise();
        const stories = result.Items;

        console.log('Result:', result); // Add this logging statement to check the scan result

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
