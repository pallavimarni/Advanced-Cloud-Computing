import React, { useEffect, useState } from 'react';

const ViewStoryEdits = () => {
  const [storyResponses, setStoryResponses] = useState([]);
  const userEmail = sessionStorage.getItem('userEmail');

  useEffect(() => {
    // Function to fetch story_id values from the first API
    const fetchStoryIds = async () => {
      try {
        const response = await fetch('https://8cgdnk54o0.execute-api.us-east-1.amazonaws.com/dev/getStoriesByAuthorEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
          }),
        });
        const data = await response.json();
        setStoryResponses(data);
      } catch (error) {
        console.error('Error fetching story_ids:', error);
      }
    };

    if (userEmail) {
      fetchStoryIds();
    }
  }, [userEmail]);

  const [storyEdits, setStoryEdits] = useState([]);

  useEffect(() => {
    // Function to fetch story edits for each story_id
    const fetchStoryEdits = async () => {
      try {
        const fetchPromises = storyResponses.map(async (story) => {
          const response = await fetch('https://8cgdnk54o0.execute-api.us-east-1.amazonaws.com/dev/findMessagesByStoryID', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              story_id: story.story_id,
            }),
          });
          return response.json();
        });

        const results = await Promise.all(fetchPromises);
        const allStoryEdits = results.flat();
        setStoryEdits(allStoryEdits);
      } catch (error) {
        console.error('Error fetching story edits:', error);
      }
    };

    if (storyResponses.length > 0) {
      fetchStoryEdits();
    }
  }, [storyResponses]);

  const handleAccept = (story_id) => {
    console.log('Accepted story with ID:', story_id);
    // Implement logic to accept the story with the given story_id
  };

  const handleDiscard = (story_id) => {
    console.log('Discarded story with ID:', story_id);
    // Implement logic to discard the story with the given story_id
  };

  return (
    <div style={styles.container}>
   
      {storyEdits.map((story) => (
        <div key={story.story_id} style={styles.card}>
          <p>User ID: {story.user_id}</p>
          <p>Edited Content: {story.editedContent}</p>
          <div style={styles.buttons}>
            <button onClick={() => handleAccept(story.story_id)}>Accept</button>
            <button onClick={() => handleDiscard(story.story_id)}>Discard</button>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ViewStoryEdits;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    width: '300px',
    margin: '10px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '10px',
  },
};
