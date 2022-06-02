import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import AuthPage from './AuthPage';
import React, { useState, useEffect } from 'react';
import { getUser } from './services/supabase-utils';
import Deck from './Deck.js';
import AboutUs from './AboutUs';
import DraftPage from './DraftPage';
import DecksPage from './DecksPage';
import Header from './Header';
import Footer from './Footer';

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [deleteCard, setDeleteCard] = useState();

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user);
  }, []);

  return (
    <Router>
      <Header />
      <div className="App">
        <Switch>
          <Route exact path="/">
            {currentUser ? (
              <Redirect to="/DecksPage" />
            ) : (
              <AuthPage setCurrentUser={setCurrentUser} />
            )}
          </Route>
          <Route exact path="/DecksPage">
            {currentUser ? <DecksPage /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/DraftPage">
            {currentUser ? (
              <DraftPage deleteCard={deleteCard} setDeleteCard={setDeleteCard} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route exact path="/Deck/:id">
            {currentUser ? (
              <Deck deleteCard={deleteCard} setDeleteCard={setDeleteCard} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route exact path="/AboutUs">
            {currentUser ? (
              <AboutUs/>
            ) : (
              <AuthPage setCurrentUser={setCurrentUser} />
            )}
          </Route>
        </Switch>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
