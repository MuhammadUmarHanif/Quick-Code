import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import './App.css';
import FAQ from './components/FAQ';
import Cards from './components/Cards';
import Footer from './components/Footer';
import Editor from './components/Editor';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              theme: {
                primary: '#4aed88',
              },
            },
          }}
        />
      </div>
      <Router>
        <div className="App">
         
          <Routes>
            <Route
              path="/"
              element={
                <>
                 <Header />
                  <HeroSection />
                  <FAQ />
                  <Cards />
                  <Footer />
                </>
              }
            />
            <Route path="/editor/:roomId" element={<Editor />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;