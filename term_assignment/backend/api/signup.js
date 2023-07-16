const DynamoDB = require('aws-sdk/clients/dynamodb');
const call = require('./call');
const { v4: uuidv4 } = require('uuid');

const DocumentClient = new DynamoDB.DocumentClient({
    region: 'us-east-1',
    maxRetries: 3,
    httpOptions: {
        timeout: 5000,
    },
});

const CREDENTIALS_TABLE_NAME = process.env.CREDENTIALS_TABLE_NAME;

module.exports.signup = async (event, context, callback) => {
    const { name, email, password, confirmPassword } = JSON.parse(event.body);
    const userId = uuidv4();

    try {
        if (password !== confirmPassword) {
            callback(null, {
                statusCode: 400,
                body: JSON.stringify({ message: 'Passwords do not match' }),
            });
        } else {
            // Save user details to the credentials table in DynamoDB
            const params = {
                TableName: CREDENTIALS_TABLE_NAME,
                Item: {
                    user_id: userId,
                    email: email,
                    name: name,
                    password: password,
                },
                ConditionExpression: 'attribute_not_exists(user_id)',
            };

            await DocumentClient.put(params).promise();
            callback(null, {
                statusCode: 201,
                body: JSON.stringify({ message: 'Signup successful', user_id: userId, email, name }),
            });
        }
    } catch (err) {
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({ message: err.message }),
        });
    }
};
