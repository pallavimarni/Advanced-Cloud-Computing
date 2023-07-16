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

const STORY_TABLE_NAME = process.env.STORY_TABLE_NAME;

module.exports.story = async (event, context, callback) => {
    const { author, story, lastEditedId } = JSON.parse(event.body);
    const storyId = uuidv4();
    const currentDate = new Date().toISOString().split('T')[0];


    try {
        const params = {
            TableName: STORY_TABLE_NAME,
            Item: {
                story_id: storyId,
                author,
                story,
                date: currentDate,
                lastEditedId,
            },
            ConditionExpression: 'attribute_not_exists(story_id)',
        };

        await DocumentClient.put(params).promise();
        callback(null, call.statement(201, { story_id: storyId, author, story, date: currentDate, lastEditedId }));
    } catch (err) {
        callback(null, call.statement(500, err.message));
    }
};
