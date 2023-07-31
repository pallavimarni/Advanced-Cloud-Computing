const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const STORY_TABLE_NAME = process.env.STORY_TABLE_NAME;
const STORY_EDITS_TABLE_NAME = process.env.STORY_EDITS_TABLE_NAME;

exports.getAllStories = async (event, context, callback) => {
    try {

        const responseHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Credentials': true,
        };
        const scanParams = {
            TableName: STORY_TABLE_NAME,
        };

        const scanResult = await dynamoDB.scan(scanParams).promise();
        const stories = scanResult.Items;

        const updatedStories = await Promise.all(
            stories.map(async (story) => {
                if (story.lastEditedId) {
                    const getParams = {
                        TableName: STORY_EDITS_TABLE_NAME,
                        Key: {
                            editId: story.lastEditedId,
                        },
                    };
                    const getResult = await dynamoDB.get(getParams).promise();
                    const editedContent = getResult.Item.editedContent;
                    return { ...story, content: editedContent };
                } else {
                    return { ...story, content: story.story };
                }
            })
        );

        callback(null, {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify(updatedStories),
        });
    } catch (err) {
        callback(null, {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ message: err.message }),
        });
    }
};
