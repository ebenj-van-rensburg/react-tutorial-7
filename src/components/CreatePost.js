import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { ref, set, push } from 'firebase/database';
import { storage } from '../firebaseConfig';
import { uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../firebaseConfig';

const CreatePost = () => {
  const [user] = useAuthState(auth);
  const [postText, setPostText] = useState('');
  const [error, setError] = useState('');

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const postRef = push(ref(database, 'posts/' + user.uid));

    const newPost = {
      userId: user.uid,
      username: user.displayName,
      text: postText,
      timestamp: Date.now()
    };

    await set(postRef, newPost);
    setPostText('');
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
        <p />
        <Button variant="primary" type="submit">
          Post
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePost;