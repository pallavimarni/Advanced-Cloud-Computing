import React, { useState } from 'react';
import { Typography, makeStyles, Card, CardContent, Button, TextField } from '@material-ui/core';

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

const FeedPage = () => {
  const classes = useStyles();

  const [editableStoryId, setEditableStoryId] = useState(null);
  const [editedStoryContent, setEditedStoryContent] = useState('');

  const stories = [
    {
      id: 1,
      title: 'Story 1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      date: '2023-07-14',
    },
    {
      id: 2,
      title: 'Story 2',
      content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '2023-07-13',
    },
  ];

  const handleEditClick = (storyId, storyContent) => {
    setEditableStoryId(storyId);
    setEditedStoryContent(storyContent);
  };

  const handleStoryChange = (event) => {
    setEditedStoryContent(event.target.value);
  };

  const handleSaveClick = () => {
    // Implement the logic to save the edited story
    console.log('Edited story:', editedStoryContent);

    // Clear the editable story state
    setEditableStoryId(null);
    setEditedStoryContent('');
  };

  return (
      <div className={classes.container}>
        {stories.map((story) => (
            <Card key={story.id} className={classes.card}>
              <CardContent>
                <Typography variant="h6" className={classes.title}>
                  {story.title}
                </Typography>
                <Typography variant="subtitle1" className={classes.author}>
                  {story.author}
                </Typography>
                {editableStoryId === story.id ? (
                    <>
                      <TextField
                          multiline
                          rows={4}
                          variant="outlined"
                          fullWidth
                          value={editedStoryContent}
                          onChange={handleStoryChange}
                      />
                      <br/>
                      <br/>
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
                          onClick={() => handleEditClick(story.id, story.content)}
                      >
                        Edit
                      </Button>
                    </>
                )}
              </CardContent>
            </Card>
        ))}
      </div>
  );
};

export default FeedPage;
