import React, { useContext, useState, useEffect } from 'react';
import { ref, set, get, remove } from 'firebase/database';
import { AuthContext } from '../AuthContext';
import { database, storage } from '../firebaseConfig';
import { uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';
import { Container, Form, Button, Image } from 'react-bootstrap';

const Settings = () => {
    const { currentUser } = useContext(AuthContext);
    const [profile, setProfile] = useState({
        username: '',
        gender: '',
        age: '',
        about: '',
        profilePicture: '',
        bannerImage: ''
    });
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [bannerImageFile, setBannerImageFile] = useState(null);

    useEffect(() => {
        if (currentUser) {
            const userRef = ref(database, 'users/' + currentUser.uid);
            get(userRef).then(snapshot => {
                if (snapshot.exists()) {
                    setProfile(snapshot.val());
                }
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'profilePicture') {
            setProfilePictureFile(files[0]);
        } else if (name === 'bannerImage') {
            setBannerImageFile(files[0]);
        }
    };

    const uploadFile = async (file, path) => {
        const fileRef = storageRef(storage, path);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
    };

    const handleSave = async () => {
        if (currentUser) {
            let profilePictureURL = profile.profilePicture;
            let bannerImageURL = profile.bannerImage;

            if (profilePictureFile) {
                profilePictureURL = await uploadFile(profilePictureFile, `profilePictures/${currentUser.uid}`);
            }

            if (bannerImageFile) {
                bannerImageURL = await uploadFile(bannerImageFile, `bannerImages/${currentUser.uid}`);
            }

            const updatedProfile = {
                ...profile,
                profilePicture: profilePictureURL,
                bannerImage: bannerImageURL
            };

            const userRef = ref(database, 'users/' + currentUser.uid);
            await set(userRef, updatedProfile);
            alert('Profile updated successfully!');
        }
    };

    const handleDelete = async () => {
        const confirmation = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (confirmation) {
            if (currentUser) {
                const userRef = ref(database, 'users/' + currentUser.uid);
                await remove(userRef);
                await currentUser.delete();
                alert('Account deleted successfully!');
            }
        }
    };

    return (
        <Container>
            <Form>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" value={profile.username} onChange={handleChange} placeholder="Enter username" />
                </Form.Group>
                <Form.Group controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control type="text" name="gender" value={profile.gender} onChange={handleChange} placeholder="Enter gender" />
                </Form.Group>
                <Form.Group controlId="formAge">
                    <Form.Label>Age</Form.Label>
                    <Form.Control type="number" name="age" value={profile.age} onChange={handleChange} placeholder="Enter age" />
                </Form.Group>
                <Form.Group controlId="formAbout">
                    <Form.Label>About Me</Form.Label>
                    <Form.Control as="textarea" name="about" value={profile.about} onChange={handleChange} placeholder="Tell us about yourself" />
                </Form.Group>
                {profile.profilePicture && (
                    <div className="mt-3">
                        <h5>Current Profile Picture:</h5>
                        <Image src={profile.profilePicture} roundedCircle style={{ width: '150px', height: '150px' }} />
                    </div>
                )}
                <Form.Group controlId="formProfilePicture">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control type="file" name="profilePicture" onChange={handleFileChange} />
                </Form.Group>
                {profile.bannerImage && (
                    <div className="mt-3">
                        <h5>Current Banner Image:</h5>
                        <Image src={profile.bannerImage} fluid style={{ width: '100%', height: '200px' }} />
                    </div>
                )}
                <Form.Group controlId="formBannerImage">
                    <Form.Label>Banner Image</Form.Label>
                    <Form.Control type="file" name="bannerImage" onChange={handleFileChange} />
                </Form.Group>
                <Button variant="primary" onClick={handleSave}>Save</Button>
                <Button variant="danger" onClick={handleDelete}>Delete Account</Button>
            </Form>
        </Container>
    );
};

export default Settings;