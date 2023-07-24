import React, { useState, useEffect } from 'react';
import { Typography, makeStyles, Card, CardContent, Button, TextField } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  card: {
    marginBottom: theme.spacing(2),
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  author: {
    marginBottom: theme.spacing(1),
  },
  content: {
    marginBottom: theme.spacing(1),
  },
  editButton: {
    marginLeft: theme.spacing(1),
  },
}));

const StoryCard = ({ story, onSave, fetchStories }) => {
  const classes = useStyles();

  const [editableStoryId, setEditableStoryId] = useState(null);
  const [editedStoryContent, setEditedStoryContent] = useState('');

  const isStoryEditable = () => {
    return editableStoryId === story.story_id;
  };

  const handleEditClick = () => {
    if (isStoryEditable()) {
      // Clicking on the same "Edit" button again will save the edit
      handleSaveClick();
    } else {
      // Clicking on a different "Edit" button will make that story editable
      setEditableStoryId(story.story_id);
      setEditedStoryContent(story.content);
    }
  };

  const handleStoryChange = (event) => {
    setEditedStoryContent(event.target.value); // Update the edited content state
  };

  const handleSaveClick = async () => {
    if (isStoryEditable() && editedStoryContent.trim() !== '') {
      const requestBody = {
        story_id: story.story_id,
        user_id: sessionStorage.getItem('userEmail'),
        editedContent: editedStoryContent.trim(),
      };

      try {
        // Call the onSave function to send the edited content to the API
        await onSave(requestBody);

        // Send the edited content to the SQS queue using the sendMessageToQueue Lambda
        try {
          await axios.post(
            'https://7s1z4yffh5.execute-api.us-east-1.amazonaws.com/dev/sendMessageToQueue',
            requestBody
          );
          console.log('Message sent to SQS queue successfully.');
        } catch (error) {
          console.error('Error sending message to SQS queue:', error);
        }

        // Fetch the updated stories from the API after successful edit
        fetchStories();

        // Show a message to the user that changes have been sent
        alert('Your changes have been sent to the author. Your changes will be reflected if the author accepts them.');

      } catch (error) {
        console.error('Error saving story:', error);
      } finally {
        // Clear the editable story state after saving
        setEditableStoryId(null);
        setEditedStoryContent('');
      }
    }
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          {story.title}
        </Typography>
        <Typography variant="subtitle1" className={classes.author}>
          {story.author}
        </Typography>
        {isStoryEditable() ? (
          <>
            <TextField
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={editedStoryContent} // Bind the value to the edited content state
              onChange={handleStoryChange} // Call handleStoryChange on text change
            />
            <br />
            <br />
            <Button variant="contained" color="primary" onClick={handleSaveClick}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1" className={classes.content}>
              {story.content}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Posted on: {story.date}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              className={classes.editButton}
              onClick={handleEditClick}
            >
              {isStoryEditable() ? 'Cancel' : 'Edit'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const FeedPage = () => {
  const classes = useStyles();

  const [stories, setStories] = useState([]);

  useEffect(() => {
    // Fetch the stories from the API when the component mounts
    fetchStories();
  }, []);

  const fetchStories = () => {
    axios
      .get('https://7s1z4yffh5.execute-api.us-east-1.amazonaws.com/dev/storyList/getallstories')
      .then((response) => {
        setStories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stories:', error);
      });
  };

  const handleSaveStory = async (updatedStory) => {
    try {
      // Send the edited content to the API using updatedStory
      const response = await axios.post(
        'https://7s1z4yffh5.execute-api.us-east-1.amazonaws.com/dev/editStory',
        updatedStory
      );

      // Fetch the updated stories from the API after successful edit
      fetchStories();

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className={classes.container}>
      {stories.map((story) => (
        <StoryCard key={story.story_id} story={story} onSave={handleSaveStory} fetchStories={fetchStories} />
      ))}
    </div>
  );
};

export default FeedPage;
