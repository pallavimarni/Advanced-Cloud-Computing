import React, { useState } from 'react';

function FeedPage() {
  const [stories, setStories] = useState([
    {
      id: 1,
      title: 'Story 1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      choices: ['Choice A', 'Choice B'],
      selectedChoice: '',
    },
    {
      id: 2,
      title: 'Story 2',
      content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      choices: ['Choice X', 'Choice Y'],
      selectedChoice: '',
    },
  ]);

  const handleChoiceSelect = (storyId, choice) => {
    const updatedStories = stories.map((story) => {
      if (story.id === storyId) {
        return { ...story, selectedChoice: choice };
      }
      return story;
    });

    setStories(updatedStories);
  };

  return (
    <div className="container">
      <h1>Story Feed</h1>
      <div className="row">
        {stories.map((story) => (
          <div className="col-md-6" key={story.id}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{story.title}</h5>
                <p className="card-text">{story.content}</p>
                <div className="mb-3">
                  <strong>Select Outcome:</strong>
                  {story.choices.map((choice, index) => (
                    <div className="form-check" key={index}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`choice-${story.id}`}
                        id={`choice-${story.id}-${index}`}
                        checked={story.selectedChoice === choice}
                        onChange={() => handleChoiceSelect(story.id, choice)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`choice-${story.id}-${index}`}
                      >
                        {choice}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedPage;
