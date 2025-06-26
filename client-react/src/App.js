import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import PersonalInformation from './pages/PersonalInformation';
import Housing from './pages/Housing';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/personal-information" element={<PersonalInformation />} />
            <Route path="/housing" element={<Housing />} />
            <Route path="/" element={<PersonalInformation />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
