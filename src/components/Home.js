import React, { useContext, useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import { AuthContext } from '../AuthContext';
import { Container, Form, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersList = data ? Object.values(data) : [];
      setUsers(usersList);
    });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = searchTerm
    ? users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Container>
      <Form>
        <Form.Group controlId="formSearch">
          <Form.Label>Search by Username</Form.Label>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter username"
          />
        </Form.Group>
      </Form>
      {searchTerm && (
        <ListGroup>
          {filteredUsers.map(user => (
            <ListGroup.Item key={user.userId}>
              <Link to={`/profile/${user.userId}`}>{user.username}</Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default Home;