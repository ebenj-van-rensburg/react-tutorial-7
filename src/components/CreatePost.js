import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { ref, set, push } from 'firebase/database';
import { storage } from '../firebaseConfig';
import { uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';
import { AuthContext } from '../AuthContext';
import { database } from '../firebaseConfig';

const CreatePost = () => {
  const { currentUser } = useContext(AuthContext);
  const [postText, setPostText] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState('');

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      setError('You can only upload up to 4 images.');
    } else {
      setError('');
      setImageFiles(files);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const postRef = push(ref(database, 'posts/' + currentUser.uid));
    const postId = postRef.key;

    const imageUrls = await Promise.all(
      imageFiles.map(async (file, index) => {
        const fileRef = storageRef(storage, `posts/${currentUser.uid}/${postId}/${index}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      })
    );

    const newPost = {
      userId: currentUser.uid,
      username: currentUser.displayName,
      text: postText,
      images: imageUrls,
      timestamp: Date.now()
    };

    await set(postRef, newPost);
    setPostText('');
    setImageFiles([]);
  };

  return (
    <Container>
      <Form onSubmit={handlePostSubmit}>
        <Form.Group controlId="formPostText">
          <Form.Label>Post Text</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={postText}
            onChange={handleTextChange}
            placeholder="What's on your mind?"
          />
        </Form.Group>
        <Form.Group controlId="formPostImages">
          <Form.Label>Upload Images (up to 4)</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          {error && <p className="text-danger">{error}</p>}
        </Form.Group>
        <Button variant="primary" type="submit">
          Post
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePost;