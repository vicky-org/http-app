import React, { Component } from "react";
import axios from "axios";
import "./App.css";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

axios.interceptors.response.use(null, (error) => {
  console.log("Interceptor called da");
  const expectedError =
    error.response &&
    error.response.status >= 404 &&
    error.response.status < 500;
  if (!expectedError) {
    console.log("Logging an unexpected  error", error);
    alert("An unexpected error occured");
  }
  return Promise.reject(error);
});

const apiEndpoint = "https://jsonplaceholder.typicode.com/posts";

class App extends Component {
  state = {
    posts: [],
  };

  async componentDidMount() {
    console.log("in componentDidMount");
    const { data: posts } = await axios.get(apiEndpoint);
    console.log("done componentDidMount");
    this.setState({ posts });
  }

  handleAdd = async () => {
    console.log("Add");
    const obj = { title: "a", body: "b" };
    const { data: post } = await axios.post(apiEndpoint, obj);
    console.log(post);
    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  handleUpdate = async (post) => {
    console.log("Updating post-id", post.id);
    post.title = "new_title";
    await axios.put(apiEndpoint + "/" + post.id, post);
    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = { ...post };
    this.setState({ posts });
  };

  handleDelete = async (post) => {
    //pessimistic update - first make BE call and then update UI with updated state
    //optimistic update - first update UI with new state and make BE call, if error revert UI
    const originalPosts = this.state.posts;
    console.log("Deleting post-id", post.id);
    const posts = this.state.posts.filter((p) => p.id !== post.id);
    this.setState({ posts });
    try {
      await axios.delete(apiEndpoint + "/hello" + post.id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        alert("This po st has already been delete");
      this.setState({ posts: originalPosts });
    }
  };

  render() {
    return (
      <React.Fragment>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
