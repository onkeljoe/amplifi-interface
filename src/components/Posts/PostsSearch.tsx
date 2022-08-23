import React, { Component } from "react";
import PostsList from "./PostsList";

class PostsSearch extends Component {
  state = {
    searchQuery: "",
  };

  handleSubmit = (event: any) => event.preventDefault();

  handleInputChange = (event: any) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { state, handleSubmit, handleInputChange } = this;
    const { searchQuery } = state;

    return (
      <div className='posts-search'>
        <form
          style={{ padding: "40px" }}
          className='posts-search__form'
          onSubmit={handleSubmit}
        >
          <input
            style={{ fontWeight: "bolder", padding: "20px" }}
            type='text'
            className='posts-search__search-field'
            name='searchQuery'
            value={searchQuery}
            onChange={handleInputChange}
            placeholder='Search For Content'
          />
        </form>
        {searchQuery && (
          <div className='results'>
            <PostsList searchQuery={searchQuery} />
          </div>
        )}
      </div>
    );
  }
}

export default PostsSearch;
