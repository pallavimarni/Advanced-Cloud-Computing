var DynamoDB = require('aws-sdk/clients/dynamodb');
const call = require('./call');

var DocumentClient = new DynamoDB.DocumentClient({
    region: "us-east-1",
    maxRetries: 3,
    httpOptions : {
        timeout:5000,
    }


});

const STORY_TABLE_NAME = process.env.STORY_TABLE_NAME;

module.exports.story = async(event,context,callback) => {
    let story_id = event['queryStringParameters']['story_id'];
    try{
        if(story_id){
            story_id=story_id;
        }
        else{
            story_id = send.getstoryID(event.headers);
        }
        const params ={
            TableName: STORY_TABLE_NAME,
            FilterExpression: 'story_id = :story_id' ,
            ExpressionAttributeValues: {':story_id': story_id}
        };
       
        let data = await DocumentClient.scan(params).promise();
        callback(null,call.statement(201,data));
    }catch(err){  
       callback(null,call.statement(500,err.message))
}

}