import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import emailjs from '@emailjs/browser';
import axios from 'axios';

const AdminInvite = () => {
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState('');

  const sendInviteEmail = async (email, token) => {
    const registrationLink = `http://localhost:3000/register/${token}`;

    const templateParams = {
      to_email: email,
      registration_link: registrationLink,
      from_name: 'Team Sajan',
    };

    try {
      await emailjs.send(
        'service_coil04s',   // EmailJS service ID
        'template_lmo14vv',  // EmailJS template ID
        templateParams,
        '6uIIkOCqP5DkczqWy'  // EmailJS public key
      )
      .then((res) => {
        console.log('Email sent!', res);
        })
      .catch((err) => {
        console.error(' Email failed:', err);
        });
    } catch (err) {
      throw new Error('Failed to send email.');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setError('');

    try {
      // Call backend to generate token for this email
      const res = await axios.post('/api/hr/invite', { email });
      const token = res.data.token;

      // Send email with EmailJS
      await sendInviteEmail(email, token);

      setStatusMsg(`Invite sent successfully to ${email}`);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    }
  };

  return (
    <Box maxWidth="sm" mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Send Registration Invite
      </Typography>
      <form onSubmit={handleInvite}>
        <TextField
          label="Employee Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Send Invite
        </Button>
      </form>

      {statusMsg && <Alert severity="success" sx={{ mt: 2 }}>{statusMsg}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default AdminInvite;