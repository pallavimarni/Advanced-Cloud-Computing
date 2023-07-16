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

    try {
        // Retrieve the user record from DynamoDB based on the email
        const params = {
            TableName: CREDENTIALS_TABLE_NAME,
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email,
            },
        };

        const result = await DocumentClient.query(params).promise();

        // Check if the user exists and the password matches
        if (result.Count === 0) {
            callback(null, {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid credentials' }),
            });
        } else {
            const storedPassword = result.Items[0].password;

            // Compare the stored password with the provided password
            if (password === storedPassword) {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Login successful' }),
                });
            } else {
                callback(null, {
                    statusCode: 401,
                    body: JSON.stringify({ message: 'Invalid credentials' }),
                });
            }
        }
    } catch (err) {
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({ message: err.message }),
        });
    }
};
