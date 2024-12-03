import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

function LoginForm () {
  // States to hold form data and errors
  const [formData, setFormData] = useState({username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const[succesMessage, setSuccessMessage] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  // Navigating to different routes
  const navigate = useNavigate();

  // Handle changes to form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setErrorMessage('Both fields are required.');
      return;
    }

    try {
      // Fetch login details
      const response = await axios.post('/login', formData);
      const data = await response.data;

      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/home'); 
      } else {
        setErrorMessage(data.message || 'incorrect password');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Incorrect Password');
    }
  };

  // Handle signup form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!signupData.username || !signupData.password) {
      setErrorMessage('Both fields are required for registration.');
      return;
    }

    try {

      const response = await axios.post('/register', signupData);
      const data = await response.data;

      if (data.success) {
        setErrorMessage('Registration successful! Please log in.');
        setShowModal(false); 
      } else {
        setErrorMessage(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Registration failed.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center">Login</h2>
          {/* Login form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username" 
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password" 
              />
            </Form.Group>

            {/* Display error messages */}
            {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}

            <Button variant="primary" type="submit" className="mt-3 w-100">
              Login
            </Button>
          </Form>

           {/* Link to show signup form */}
           <p className="mt-3 text-center">
            Register here: 
            <a href="#signup" onClick={() => setShowSignup(!showSignup)}> Register</a>
          </p>

          {/* Signup form */}
          {showSignup && (
            <div id="signup">
              <h2 className="text-center mt-5">Sign Up</h2>
              <Form onSubmit={handleSignupSubmit}>
                <Form.Group controlId="formSignupUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={signupData.username}
                    onChange={handleSignupChange}
                    placeholder="Enter username"
                  />
                </Form.Group>

                <Form.Group controlId="formSignupPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    placeholder="Enter password"
                  />
                </Form.Group>

                {/* Display error messages */}
                {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}

                <Button variant="primary" type="submit" className="mt-3 w-100">
                  Register
                </Button>
              </Form>
              </div>
          )}
         </Col>
         </Row>
    </Container>
  );
};

export default LoginForm;
