import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';

const Register = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/auth/token/${token}`)
      .then((res) => setEmail(res.data.email))
      .catch(() => setError('Invalid or expired token'));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post(`/api/auth/register/${token}`, {
        username,
        password
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  if (error && !success) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
      <TextField label="Email" value={email} fullWidth disabled sx={{ mb: 2 }} />
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <Button type="submit" variant="contained" fullWidth>Register</Button>
      {success && <Alert severity="success" sx={{ mt: 2 }}>Registered successfully! Redirecting to login…</Alert>}
    </Box>
  );
};

export default Register;