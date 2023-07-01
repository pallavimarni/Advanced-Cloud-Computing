import React from 'react';

function Home() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h1>Create a Story</h1>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input type="text" className="form-control" id="title" />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea className="form-control" id="content" rows="5"></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="choice1">Choice 1</label>
              <input type="text" className="form-control" id="choice1" />
            </div>
            <div className="form-group">
              <label htmlFor="choice2">Choice 2</label>
              <input type="text" className="form-control" id="choice2" />
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
