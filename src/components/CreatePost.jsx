import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const CreatePost = () => {
  const [formPost, setFormPost] = useState({
    content: "",
    "tags[0]": "",
    "tags[1]": "",
    "tags[2]": "",
  });

  const [images, setImages] = useState([]);

  const handleFormPost = (e) => {
    const { name, value } = e.target;
    setFormPost({ ...formPost, [name]: value });
  };

  const handleImage = (e) => {
    setImages([...images, ...e.target.files]);
  };

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
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const submitPost = (e) => {
    e.preventDefault();
    const data = {
      formPost,
      images,
    };
    createPost.mutate(data);
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
    </div>
  );
};

export default CreatePost;
