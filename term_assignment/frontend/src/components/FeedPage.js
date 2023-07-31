import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const StoryCard = ({ story, onSave, fetchStories }) => {
  const [editableStoryId, setEditableStoryId] = useState(null);
  const [editedStoryContent, setEditedStoryContent] = useState('');

  const isStoryEditable = () => {
    return editableStoryId === story.story_id;
  };

  const handleEditClick = () => {
    if (isStoryEditable()) {
      handleSaveClick();
    } else {
      setEditableStoryId(story.story_id);
      setEditedStoryContent(story.content);
    }
  };

  const handleStoryChange = (event) => {
    setEditedStoryContent(event.target.value);
  };

  const handleSaveClick = async () => {
    if (isStoryEditable() && editedStoryContent.trim() !== '') {
      const requestBody = {
        story_id: story.story_id,
        user_id: sessionStorage.getItem('userEmail'),
        editedContent: editedStoryContent.trim(),
      };

      try {
        await onSave(requestBody);

        try {
          await axios.post(
            `${process.env.REACT_APP_API_ENDPOINT}/dev/sendMessageToQueue`,
            requestBody
          );
          console.log('Message sent to SQS queue successfully.');
        } catch (error) {
          console.error('Error sending message to SQS queue:', error);
        }

        fetchStories();

        alert(
          'Your changes have been sent to the author. Your changes will be reflected if the author accepts them.'
        );
      } catch (error) {
        console.error('Error saving story:', error);
      } finally {
        setEditableStoryId(null);
        setEditedStoryContent('');
      }
    }
  };

  return (
    <Card className="story-card">
      <Card.Body>
        <h6>{story.title}</h6>
        <p>{story.author}</p>
        {isStoryEditable() ? (
          <>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter your story"
              value={editedStoryContent}
              onChange={handleStoryChange}
              className="edit-textarea"
            />
            <br />
            <br />
            <Button variant="primary" onClick={handleSaveClick}>
              Save
            </Button>
          </>
        ) : (
          <>
            <p>{story.content}</p>
            <p className="posted-date">Posted on: {story.date}</p>
            <Button
              variant="outline-primary"
              className="edit-button"
              onClick={handleEditClick}
            >
              {isStoryEditable() ? 'Cancel' : 'Edit'}
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

const FeedPage = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = () => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/dev/storyList/getallstories`)
      .then((response) => {
        setStories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stories:', error);
      });
  };

  const handleSaveStory = async (updatedStory) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/dev/editStory`,
        updatedStory
      );

      fetchStories();

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="container">
      {stories.map((story) => (
        <StoryCard
          key={story.story_id}
          story={story}
          onSave={handleSaveStory}
          fetchStories={fetchStories}
        />
      ))}
    </div>
  );
};

export default FeedPage;
