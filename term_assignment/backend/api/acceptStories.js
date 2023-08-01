const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();
const sns = new AWS.SNS();

exports.acceptStories = async (event) => {
    const { story_id, editedContent, messageId } = JSON.parse(event.body);
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Credentials': true,
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

        const snsTopicArn = 'arn:aws:sns:us-east-1:587818610762:story-topic-' + story_id;
        const snsMessage = 'There has been an update on the story you worked on. Go check it out!';
        await sns.publish({ TopicArn: snsTopicArn, Message: snsMessage }).promise();

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
