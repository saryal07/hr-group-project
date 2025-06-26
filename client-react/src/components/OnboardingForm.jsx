import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, MenuItem, Typography, FormControlLabel, Checkbox,
  Alert, InputLabel, Select, FormControl, Grid, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';

const genders = ['male', 'female', 'prefer not to say'];
const visaTypes = ['H1-B', 'L2', 'F1', 'H4', 'Other'];

const OnboardingForm = ({ initialData = {}, status, onSubmitSucess }) => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', middleName: '', preferredName: '',
    email: '', ssn: '', dob: '', gender: '',
    address: { building: '', street: '', city: '', state: '', zip: '' },
    cellPhone: '', workPhone: '',
    car: { make: '', model: '', color: '' },
    isCitizen: false, residencyType: '',
    visa: { type: '', title: '', startDate: '', endDate: '' },
    hasLicense: false, driversLicense: { number: '', expirationDate: '' },
    reference: { firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: '' },
    emergencyContacts: [{ firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: '' }]
  });

  const [files, setFiles] = useState({
    profilePic: null, driverLicense: null, optReceipt: null, workAuth: null
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) setForm((prev) => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');
    setForm((prev) => {
      const updated = { ...prev };
      let pointer = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        pointer[keys[i]] = pointer[keys[i]] || {};
        pointer = pointer[keys[i]];
      }
      pointer[keys.at(-1)] = type === 'checkbox' ? checked : value;
      return updated;
    });
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
  };

  const handleEmergencyChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...form.emergencyContacts];
    updated[index][name] = value;
    setForm((prev) => ({ ...prev, emergencyContacts: updated }));
  };

  const addEmergencyContact = () => {
    setForm((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: '' }]
    }));
  };

  const removeEmergencyContact = (index) => {
    const updated = [...form.emergencyContacts];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, emergencyContacts: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const appendJSON = (key, value) => formData.append(key, JSON.stringify(value));

    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('middleName', form.middleName);
    formData.append('preferredName', form.preferredName);
    formData.append('email', form.email);
    formData.append('ssn', form.ssn);
    formData.append('dob', form.dob);
    formData.append('gender', form.gender);
    appendJSON('address', form.address);
    formData.append('cellPhone', form.cellPhone);
    formData.append('workPhone', form.workPhone);
    appendJSON('car', form.car);
    formData.append('isCitizen', form.isCitizen);
    formData.append('residencyType', form.residencyType);
    appendJSON('visa', form.visa);
    formData.append('hasLicense', form.hasLicense);
    appendJSON('driversLicense', form.driversLicense);
    appendJSON('reference', form.reference);
    appendJSON('emergencyContacts', form.emergencyContacts);

    for (const key in files) {
      if (files[key]) formData.append(key, files[key]);
    }

    try {
      const response = await axios.put('/api/employee/form', formData);
      console.log('Updated employee:', response.data);
      setSuccess(true);
      onSubmitSuccess?.(); // Trigger refresh of document summary
    } catch (err) {
      console.error(err);
      setError('Submission failed.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6">Personal Details</Typography>
      <TextField fullWidth label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required sx={{ mb: 2 }} />
      <TextField fullWidth label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required sx={{ mb: 2 }} />
      <TextField fullWidth label="Middle Name" name="middleName" value={form.middleName} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Preferred Name" name="preferredName" value={form.preferredName} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Email" name="email" value={form.email} disabled sx={{ mb: 2 }} />
      <TextField fullWidth label="SSN" name="ssn" value={form.ssn} onChange={handleChange} required sx={{ mb: 2 }} />
      <TextField fullWidth type="date" label="Date of Birth" name="dob" value={form.dob} onChange={handleChange} InputLabelProps={{ shrink: true }} required sx={{ mb: 2 }} />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Gender</InputLabel>
        <Select name="gender" value={form.gender} onChange={handleChange} required>
          {genders.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
        </Select>
      </FormControl>

      <Typography variant="h6">Address</Typography>
      <TextField fullWidth label="Building/Apt #" name="address.building" value={form.address.building} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Street" name="address.street" value={form.address.street} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="City" name="address.city" value={form.address.city} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="State" name="address.state" value={form.address.state} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Zip" name="address.zip" value={form.address.zip} onChange={handleChange} sx={{ mb: 2 }} />

      <Typography variant="h6">Contact & Car Info</Typography>
      <TextField fullWidth label="Cell Phone" name="cellPhone" value={form.cellPhone} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Work Phone" name="workPhone" value={form.workPhone} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Car Make" name="car.make" value={form.car.make} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Car Model" name="car.model" value={form.car.model} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Car Color" name="car.color" value={form.car.color} onChange={handleChange} sx={{ mb: 2 }} />

      <Typography variant="h6">Work Authorization</Typography>
      <FormControlLabel control={<Checkbox checked={form.isCitizen} onChange={handleChange} name="isCitizen" />} label="U.S. Citizen / Green Card Holder" />
      {form.isCitizen && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Residency Type</InputLabel>
          <Select name="residencyType" value={form.residencyType} onChange={handleChange}>
            <MenuItem value="Citizen">Citizen</MenuItem>
            <MenuItem value="Green Card">Green Card</MenuItem>
          </Select>
        </FormControl>
      )}
      {!form.isCitizen && (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Visa Type</InputLabel>
            <Select name="visa.type" value={form.visa.type} onChange={handleChange}>
              {visaTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
            </Select>
          </FormControl>
          {form.visa.type === 'Other' && (
            <TextField label="Visa Title" name="visa.title" value={form.visa.title} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          )}
          <TextField label="Start Date" name="visa.startDate" type="date" value={form.visa.startDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
          <TextField label="End Date" name="visa.endDate" type="date" value={form.visa.endDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
          {form.visa.type === 'F1' && (
            <Box sx={{ mb: 2 }}>
              <InputLabel>Upload OPT Receipt</InputLabel>
              <input type="file" name="optReceipt" onChange={handleFileChange} accept="application/pdf" />
            </Box>
          )}
        </>
      )}

      <Typography variant="h6">Driver’s License</Typography>
      <FormControlLabel control={<Checkbox checked={form.hasLicense} onChange={handleChange} name="hasLicense" />} label="I have a driver’s license" />
      {form.hasLicense && (
        <>
          <TextField label="License Number" name="driversLicense.number" value={form.driversLicense.number} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Expiration Date" name="driversLicense.expirationDate" type="date" value={form.driversLicense.expirationDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
          <Box sx={{ mb: 2 }}>
            <InputLabel>Upload Driver’s License</InputLabel>
            <input type="file" name="driverLicense" onChange={handleFileChange} accept="application/pdf,image/*" />
          </Box>
        </>
      )}

      <Typography variant="h6">Reference</Typography>
      <TextField fullWidth label="First Name" name="reference.firstName" value={form.reference.firstName} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Last Name" name="reference.lastName" value={form.reference.lastName} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Middle Name" name="reference.middleName" value={form.reference.middleName} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Phone" name="reference.phone" value={form.reference.phone} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Email" name="reference.email" value={form.reference.email} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Relationship" name="reference.relationship" value={form.reference.relationship} onChange={handleChange} sx={{ mb: 2 }} />

      <Typography variant="h6">Emergency Contacts</Typography>
      {form.emergencyContacts.map((contact, i) => (
        <Box key={i} sx={{ mb: 2, border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}><TextField label="First Name" name="firstName" value={contact.firstName} onChange={(e) => handleEmergencyChange(i, e)} fullWidth /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Last Name" name="lastName" value={contact.lastName} onChange={(e) => handleEmergencyChange(i, e)} fullWidth /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Middle Name" name="middleName" value={contact.middleName} onChange={(e) => handleEmergencyChange(i, e)} fullWidth /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Phone" name="phone" value={contact.phone} onChange={(e) => handleEmergencyChange(i, e)} fullWidth /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Email" name="email" value={contact.email} onChange={(e) => handleEmergencyChange(i, e)} fullWidth /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Relationship" name="relationship" value={contact.relationship} onChange={(e) => handleEmergencyChange(i, e)} fullWidth /></Grid>
          </Grid>
          {form.emergencyContacts.length > 1 && (
            <IconButton onClick={() => removeEmergencyContact(i)}><RemoveIcon /></IconButton>
          )}
        </Box>
      ))}
      <Button onClick={addEmergencyContact} startIcon={<AddIcon />} sx={{ mb: 2 }}>Add Emergency Contact</Button>

      <Box sx={{ mt: 3 }}>
        <InputLabel>Upload Profile Picture</InputLabel>
        <input type="file" name="profilePic" onChange={handleFileChange} accept="image/*" />
      </Box>

      <Button type="submit" variant="contained" sx={{ mt: 3 }}>Submit Application</Button>
      {success && <Alert severity="success" sx={{ mt: 2 }}>Submitted successfully!</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default OnboardingForm;