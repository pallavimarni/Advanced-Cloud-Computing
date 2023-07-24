import React, { useState } from 'react';
import { TextField, Button, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(4),
    },
    heading: {
        marginBottom: theme.spacing(2),
    },
    textField: {
        width: '70%',
        marginBottom: theme.spacing(1),
        padding: '12px', // Add padding to create space between text and border
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px', // Add rounded corners
          '& fieldset': {
            borderColor: '#CCCCCC', // Add border color
          },
        },
        '& .MuiInputLabel-root': {
          color: '#666666', // Add label color
        },
        '&:hover .MuiOutlinedInput-root': {
          borderColor: '#999999', // Change border color on hover
        },
        '& .Mui-focused .MuiOutlinedInput-root': {
          borderColor: '#007bff', // Change border color on focus
        },
      },
      submitButton: {
        width: '150px',
      },
 
    submitButton: {
        width: '150px',
    },
}));

function PostStory() {
    const classes = useStyles();
    const [title, setTitle] = useState('');
    const [storyContent, setStoryContent] = useState('');  
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
    const handleTitleChange = (event) => {
      setTitle(event.target.value);
    };
  
    const handleStoryContentChange = (event) => {
      setStoryContent(event.target.value);
    };
  
    const handleSubmit = async () => {
      // Retrieve email from the session storage
      const email = sessionStorage.getItem('userEmail');
  
      // Prepare the request data
      const requestData = {
        author: email, // Include the email in the request
        title,
        story: storyContent,
      };
  
      try {
        // Send a POST request to the API
        const response = await axios.post(
          'https://7s1z4yffh5.execute-api.us-east-1.amazonaws.com/dev/storyList',
          requestData
        );
  
        // Log the response (for demonstration purposes)
        console.log('API Response:', response.data);
        setShowSuccessMessage(true);
        // Clear the input fields
        setTitle('');
        setStoryContent('');

        setTimeout(() => {
            setShowSuccessMessage(false);
          }, 3000);
      

      } catch (error) {
        // Handle any errors here
        console.error('Error:', error);
      }
    };

    return (
        <div className={classes.container}>
            <Typography variant="h5" className={classes.heading}>
                Post a Story
            </Typography>
            <TextField
                id="story-title"
                label="Title"
                variant="outlined"
                className={classes.textField}
                value={title}
                onChange={handleTitleChange}
            />
            <br/>
            <TextField
                id="story-content"
                label="Enter your story"
                multiline
                rows={12} // Increase the number of rows to adjust the height
                variant="outlined"
                className={classes.textField}
                value={storyContent}
                onChange={handleStoryContentChange}
            />
            <Button
                variant="contained"
                color="primary"
                className={classes.submitButton}
                onClick={handleSubmit}
            >
                Submit
            </Button>
            <br/>
            {showSuccessMessage && (
        <div className="success-message">
          Story was added successfully! You can see your story in the feed.
        </div>
      )}
        </div>
    );
}

export default PostStory;
