import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

function PostStory() {
  const [title, setTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [open, setOpen] = useState(false);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleStoryContentChange = (event) => {
    setStoryContent(event.target.value);
  };

  const handleSubmit = async () => {
    const email = sessionStorage.getItem('userEmail');

    const requestData = {
      author: email,
      title,
      story: storyContent,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/dev/storyList`,
        requestData
      );

      console.log('API Response:', response.data);
      setShowSuccessMessage(true);
      setOpen(true);
      setTitle('');
      setStoryContent('');

      setTimeout(() => {
        setShowSuccessMessage(false);
        setOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="container">
      <h5>Post a Story</h5>
      <Form.Group controlId="story-title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={handleTitleChange}
        />
      </Form.Group>

      <Form.Group controlId="story-content">
        <Form.Label>Enter your story</Form.Label>
        <Form.Control
          as="textarea"
          rows={12}
          placeholder="Enter your story"
          value={storyContent}
          onChange={handleStoryContentChange}
        />
      </Form.Group>

      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>

      {/* Pop-up Modal */}
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Story was added successfully! You can see your story in the feed.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostStory;
