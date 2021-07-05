import './App.css';
import Login from './components/login';
import React, {useEffect} from 'react';
import styles from './styles/home.module.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import axios from 'axios';


function App() {

  useEffect(() => {
    axios.get('http://localhost:5001').then(response => {
      console.log("SUCCESS", response);
      alert("Successfully got update from App");
    }).catch(error => {
      console.log(error);
    })
  }, [])

  return (
    <Router>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Welcome to the Trader Hub!
        </h1>

        <p className={styles.description}>
          A free autonomous portfolio management system guided by Deep Learning and Pattern Recognition
        </p>

        <div className={styles.grid}>
          <Link to="/signup" className={styles.card}>
            <h2>Sign Up &rarr;</h2>
            <p>New to TraderHub? Create your free account today to access realtime predictions
              and recommendations made by dedicated Stock Bots.
            </p>
          </Link>

          <Link to="/login" className={styles.card}>
            <h2>Login &rarr;</h2>
            <p>
              Access your account dashboard.
            </p>
          </Link>

          <a href="https://github.com/ansunsujoe/deep-trader" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about TraderHub and all of its benefits to both professional and amateur traders.</p>
          </a>

          <a
            href="https://github.com/ansunsujoe/deep-trader"
            className={styles.card}
          >
            <h2>Source &rarr;</h2>
            <p>View the source code for the Deep-Trader application. Contributions are appreciated!</p>
          </a>
        </div>

        <Switch>
          <Route path="/signup">
            <Login />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
