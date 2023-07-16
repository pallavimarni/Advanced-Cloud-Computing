import React, { useState } from 'react';
import { TextField, Button, makeStyles, Typography } from '@material-ui/core';

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
    },
    submitButton: {
        width: '150px',
    },
}));

function PostStory() {
    const classes = useStyles();
    const [title, setTitle] = useState('');
    const [storyContent, setStoryContent] = useState('');

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleStoryContentChange = (event) => {
        setStoryContent(event.target.value);
    };

    const handleSubmit = () => {
        // Handle submission logic here (e.g., API call to save the story)
        console.log('Submitted story:', { title, storyContent });
        // Clear the input fields
        setTitle('');
        setStoryContent('');
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
        </div>
    );
}

export default PostStory;
