import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import { AuthContext } from '../AuthContext';
import { Container, Image, Card, Row, Col } from 'react-bootstrap';
import CreatePost from './CreatePost';

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (userId) {
      const userRef = ref(database, 'users/' + userId);
      onValue(userRef, (snapshot) => {
        setUser(snapshot.val());
      });

      const postsRef = ref(database, 'posts/' + userId);
      onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        const postsList = data ? Object.values(data) : [];
        setPosts(postsList);
      });
    }
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div>
        <Image src={user.bannerImage} alt="Banner" fluid style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      </div>
      <div className="text-center" style={{ marginTop: '-75px' }}>
        <Image src={user.profilePicture} alt="Profile" roundedCircle style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white' }} />
      </div>
      <h1>{user.username}</h1>
      <p>Email: {user.email}</p>
      <p>Gender: {user.gender}</p>
      <p>Age: {user.age}</p>
      <p>About Me: {user.about}</p>

      {currentUser && currentUser.uid === userId && <CreatePost />}

      <h2>Posts</h2>
      {posts.map((post) => (
        <Card key={post.timestamp} className="mb-3">
          <Card.Body>
            <Card.Text>{user.username}:</Card.Text>
            <Card.Text>{post.text}</Card.Text>
            <small className="text-muted">{new Date(post.timestamp).toLocaleString()}</small>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Profile;