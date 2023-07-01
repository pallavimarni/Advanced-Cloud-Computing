var DynamoDB = require('aws-sdk/clients/dynamodb');
var call = require('./call');

var DocumentClient = new DynamoDB.DocumentClient({
    region: "us-east-1",
    maxRetries: 3,
    httpOptions : {
        timeout:5000,
    }
});

const STORY_TABLE_NAME = process.env.STORY_TABLE_NAME;

module.exports.story = async (event, context, callback) => {
    let data = JSON.parse(event.body);
    let story_id = event.pathParameters.story_id;
    try {
        const params = {
            TableName: STORY_TABLE_NAME,
            Key: {
                story_id
            },
            UpdateExpression: 'set #delete = :delete',
            ExpressionAttributeNames: {
                '#delete': 'delete',
            },
            ExpressionAttributeValues: {
                ':delete': data.delete,
            },
            ConditionExpression: 'attribute_exists(story_id)',
        };
        
        await DocumentClient.update(params).promise();
        callback(null, call.statement(201, data));
    } catch (err) {
        callback(null, call.statement(500, err.message));
    }
}
