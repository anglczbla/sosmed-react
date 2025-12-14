import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

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
  const [images, setImages] = useState([]);

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

  const submitPost = (e) => {
    e.preventDefault();
    const data = { formPost, images };
    createPost.mutate(data);
  };

  const deletePost = (postId) => {
    deletePostAPI.mutate(postId);
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
            {data.posts.map((d) => (
              <div key={d._id}>
                <p>{d.content}</p>
                <p>
                  {d.images.map((i) => (
                    <img src={i.url} alt="" />
                  ))}
                </p>
                <p>Created By: {d.author.account.username}</p>
                <p>Created at: {d.createdAt}</p>
                <p>Likes: {d.likes}</p>
                <p>Comment: {d.comments}</p>
                <p>{d.tags.forEach((t) => t)}</p>
                <button onClick={() => deletePost(d._id)}>
                  Delete Post
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
