import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import http from "./services/httpService";
import config from "./config.json";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  state = {
    posts: [],
  };

  async componentDidMount() {
    console.log("in componentDidMount");
    const { data: posts } = await http.get(config.apiEndpoint);
    console.log("done componentDidMount");
    this.setState({ posts });
  }

  handleAdd = async () => {
    console.log("Add");
    const obj = { title: "a", body: "b" };
    const { data: post } = await http.post(config.apiEndpoint, obj);
    console.log(post);
    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  handleUpdate = async (post) => {
    console.log("Updating post-id", post.id);
    post.title = "new_title";
    await http.put(config.apiEndpoint + "/" + post.id, post);
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
      await http.delete("h" + config.apiEndpoint + "/" + post.id);
      //await http.delete(config.apiEndpoint + "/" + post.id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        alert("This post has already been delete");
      this.setState({ posts: originalPosts });
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
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
