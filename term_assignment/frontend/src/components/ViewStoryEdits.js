import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  popup: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    background: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    zIndex: 9999,
  },
};

const ViewStoryEdits = () => {
  const [storyResponses, setStoryResponses] = useState([]);
  const [fetchedStoryEdits, setFetchedStoryEdits] = useState([]);
  const [showPopup, setShowPopup] = useState(false); 
  const [acceptedStory, setAcceptedStory] = useState(null); 

  const userEmail = sessionStorage.getItem('userEmail');

  useEffect(() => {
    const fetchStoryIds = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/dev/getStoriesByAuthorEmail`, {
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

  useEffect(() => {

    const fetchStoryEdits = async () => {
      try {
        const fetchPromises = storyResponses.map(async (story) => {
          const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/dev/findMessagesByStoryID`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              story_id: story.story_id,
            }),
            mode: 'cors', 
          });

          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch story edits');
          }
        });

        const results = await Promise.all(fetchPromises);
        const allStoryEdits = results.flat();

    
        setFetchedStoryEdits((prevStoryEdits) => [...prevStoryEdits, ...allStoryEdits]);
      } catch (error) {
        console.error('Error fetching story edits:', error);
      }
    };

    if (storyResponses.length > 0) {
      fetchStoryEdits();
    }
  }, [storyResponses]);

  const handleAccept = async (story_id, editedContent) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/dev/acceptStories`, {
        story_id: story_id,
        editedContent: editedContent,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      console.log('Accepted story with ID:', story_id);
      console.log('API Response:', response.data);


      setAcceptedStory(response.data.updatedStory);


      setShowPopup(true);

    } catch (error) {
      console.error('Error accepting story:', error);
    }
  };

  return (
    <div style={styles.container}>
      {fetchedStoryEdits.map((story) => (
        <div key={story.messageId} style={styles.card}>
          <p>User ID: {story.user_id}</p>
          <p>Edited Content: {story.editedContent}</p>
          <div style={styles.buttons}>
            <button onClick={() => handleAccept(story.story_id, story.editedContent)}>Accept</button>
          </div>
          <hr />
        </div>
      ))}

      {showPopup && (
        <div style={styles.popup}>
          <h2>Story Accepted!</h2>
          <p>Accepted Story ID: {acceptedStory?.story_id}</p>
          <p>Accepted Story Content: {acceptedStory?.editedContent}</p>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ViewStoryEdits;
