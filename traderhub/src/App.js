import './App.css';
import Navbar from './components/navbar';
import Login from './components/login';
import React from 'react';
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
    axios.get('http://localhost:5000').then(response => {
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
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Sign Up/Login &rarr;</h2>
            <p>New to TraderHub? Create your free account today to access realtime predictions
              and recommendations made by dedicated Stock Bots.
            </p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/ansunsujoe/deep-trader"
            className={styles.card}
          >
            <h2>Source &rarr;</h2>
            <p>View the source code for the Deep-Trader application. Contributions are appreciated!</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </div>
    </Router>
  );
}

export default App;
