let story = "";

const getStory =(headers) => {
    story = header.story;
    return story
}
const statement = (statusCode, data) => {
    return {
        statusCode,
        body: JSON.stringify(data),
        headers :{
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': "PUT, POST, DELETE, GET",
            'Access-Control-Allow-Credentials': true,
            'Content-Type': 'application/json',
            'story': story,

        }
    }
};

module.exports ={
    statement,
    story
} 