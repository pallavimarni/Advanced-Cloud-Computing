const DynamoDB = require('aws-sdk/clients/dynamodb');

const DocumentClient = new DynamoDB.DocumentClient({
    region: 'us-east-1',
    maxRetries: 3,
    httpOptions: {
        timeout: 5000,
    },
});


const CREDENTIALS_TABLE_NAME = process.env.CREDENTIALS_TABLE_NAME;

module.exports.login = async (event, context, callback) => {
    const { email, password } = JSON.parse(event.body);

    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Credentials': true,
    };
    try {


        const params = {
            TableName: CREDENTIALS_TABLE_NAME,
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email,
            },
        };

        const result = await DocumentClient.query(params).promise();


        if (result.Count === 0) {
            callback(null, {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid credentials' }),
            });
        } else {
            const storedPassword = result.Items[0].password;


            if (password === storedPassword) {
                callback(null, {
                    statusCode: 200,
                    headers: responseHeaders,
                    body: JSON.stringify({ message: 'Login successful' }),
                });
            } else {
                callback(null, {
                    headers: responseHeaders,
                    statusCode: 401,
                    body: JSON.stringify({ message: 'Invalid credentials' }),
                });
            }
        }
    } catch (err) {
        callback(null, {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ message: err.message }),
        });
    }
};
