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

    let data = JSON.parse(event.body);
    let story_id = event.pathParameters.story_id;
    try{
        const params ={
            TableName: STORY_TABLE_NAME,
            Key : {story_id},
                  
            
                  UpdateExpression: 'set #date = :date, #story = :story',
                  ExpressionAttributeNames:{
                    '#date' : 'date',
                    '#story' :'story',
                  },
                  ExpressionAttributeValues:{
                    ':date' : data.date,
                    ':story' :data.story,
                  },
                  ConditionExpression: 'attribute_exists(story_id)'
                
                  
                
            };
           
        
        await DocumentClient.update(params).promise();
        callback(null,call.statement(201,data));
    }catch(err){

    
       callback(null,call.statement(500,err.message))
}

}