import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import CommentList from "./CommentList";

const CreatePost = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [formPost, setFormPost] = useState({
    content: "",
    "tags[0]": "",
    "tags[1]": "",
    "tags[2]": "",
  });
  const [editPost, setEditPost] = useState({
    content: "",
    "tags[0]": "",
  });
  const [editImages, setEditImages] = useState([]);
  const [images, setImages] = useState([]);
  const [showEditForm, setShowEditForm] = useState(null);
  const [comment, setComment] = useState({
    content: "",
  });
  const [activeCommentId, setActiveCommentId] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", page, limit],
    queryFn: async () => {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://api.freeapi.app/api/v1/social-media/posts?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.data;
    },
    staleTime: Infinity,
  });

  const createPost = useMutation({
    mutationFn: (data) => {
      const { formPost: newPost, images } = data;
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("content", newPost.content);
      images.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("tags[0]", newPost["tags[0]"]);
      formData.append("tags[1]", newPost["tags[1]"]);
      formData.append("tags[2]", newPost["tags[2]"]);
      return axios.post(
        "https://api.freeapi.app/api/v1/social-media/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      alert("success add post");
      queryClient.invalidateQueries({ queryKey: ["post"] });
      setFormPost({
        content: "",
        "tags[0]": "",
        "tags[1]": "",
        "tags[2]": "",
      });
      setImages(null);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const updatePostAPI = useMutation({
    mutationFn: (newData) => {
      const { editPost, editImages, id } = newData;
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("content", editPost.content);
      editImages.forEach((i) => formData.append("images", i));
      formData.append("tags[0]", editPost["tags[0]"]);
      return axios.patch(
        `https://api.freeapi.app/api/v1/social-media/posts/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      alert("success update post");
      queryClient.invalidateQueries({ queryKey: ["post"] });
      setEditPost({
        content: "",
        "tags[0]": "",
      });
      setEditImages(null);
      setShowEditForm(null);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const deletePostAPI = useMutation({
    mutationFn: (postId) => {
      const accessToken = localStorage.getItem("accessToken");
      return axios.delete(
        `https://api.freeapi.app/api/v1/social-media/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      alert("success delete post");
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const commentAPI = useMutation({
    mutationFn: (data) => {
      const { postId, comment } = data;
      const accessToken = localStorage.getItem("accessToken");
      return axios.post(
        `https://api.freeapi.app/api/v1/social-media/comments/post/${postId}`,
        comment,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      alert("success add comment");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setComment({
        content: "",
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  if (isLoading) return "Loading...";
  if (isError) return "An error has occurred";

  console.log("isi data", data);

  const handleFormPost = (e) => {
    const { name, value } = e.target;
    setFormPost({ ...formPost, [name]: value });
  };

  const handleImage = (e) => {
    setImages([...images, ...e.target.files]);
  };

  const handleEditPost = (e) => {
    const { name, value } = e.target;
    setEditPost({ ...editPost, [name]: value });
  };

  const handleEditImage = (e) => {
    setEditImages([...editImages, ...e.target.files]);
  };

  const handleChangeComment = (e) => {
    const { name, value } = e.target;
    setComment({ ...comment, [name]: value });
  };

  const toggleShowEditPost = (index) => {
    setShowEditForm(index);
  };

  const submitPost = (e) => {
    e.preventDefault();
    const data = { formPost, images };
    createPost.mutate(data);
  };

  const deletePost = (postId) => {
    deletePostAPI.mutate(postId);
  };

  const updatePost = (editPost, editImages, id) => {
    const newPost = { editPost, editImages, id };
    updatePostAPI.mutate(newPost);
  };

  const addComment = (postId, comment) => {
    const data = { postId, comment };
    commentAPI.mutate(data);
  };

  const toggleComments = (id) => {
    setActiveCommentId(activeCommentId === id ? null : id);
  };

  return (
    <div>
      <form onSubmit={submitPost}>
        <input
          type="text"
          name="content"
          value={formPost.content}
          onChange={handleFormPost}
          placeholder="input content"
        />
        <input
          type="file"
          multiple={true}
          name="images"
          accept="image/*"
          onChange={handleImage}
        />
        <input
          type="text"
          name="tags[0]"
          value={formPost["tags[0]"]}
          onChange={handleFormPost}
          placeholder="input tags"
        />
        <input
          type="text"
          name="tags[1]"
          value={formPost["tags[1]"]}
          onChange={handleFormPost}
          placeholder="input tags2"
        />
        <input
          type="text"
          name="tags[2]"
          value={formPost["tags[2]"]}
          onChange={handleFormPost}
          placeholder="input tags 3"
        />
        <button type="submit">Create Post</button>
      </form>
      {data == 0 ? (
        <p>No post </p>
      ) : (
        <div>
          <h1>Explore Post</h1>
          <div>
            {data.posts.map((d, index) => (
              <div key={d._id}>
                <p>Content: {d.content}</p>
                <p>
                  {d.images.map((i) => (
                    <img src={i.url} alt="" />
                  ))}
                </p>
                {/* <p>Created By: {d.author.account?.username}</p> */}
                <p>Created at: {d.createdAt}</p>
                <p>Likes: {d.likes}</p>
                <p>Comment: {d.comments}</p>
                <button onClick={() => toggleComments(d._id)}>
                  {activeCommentId === d._id ? "Hide Comments" : "See Comments"}
                </button>
                {activeCommentId === d._id && <CommentList postId={d._id} />}
                <p>{d.tags.forEach((t) => t)}</p>
                <button onClick={() => deletePost(d._id)}>Delete Post</button>
                <input
                  type="text"
                  name="content"
                  onChange={handleChangeComment}
                  placeholder="add comment"
                />
                <button onClick={() => addComment(d._id, comment)}>
                  Add Comment
                </button>
                <button onClick={() => toggleShowEditPost(index)}>
                  Edit Post
                </button>
                {showEditForm == index ? (
                  <div>
                    <input
                      type="text"
                      name="content"
                      value={editPost.content}
                      placeholder="add content"
                      onChange={handleEditPost}
                    />
                    <input
                      type="text"
                      name="tags[0]"
                      value={editPost["tags[0]"]}
                      placeholder="add tags"
                      onChange={handleEditPost}
                    />
                    <input
                      type="file"
                      multiple={true}
                      name="editImages"
                      accept="image/*"
                      placeholder="send new image"
                      onChange={handleEditImage}
                    />
                    <button
                      onClick={() => updatePost(editPost, editImages, d._id)}
                    >
                      Update Post
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
