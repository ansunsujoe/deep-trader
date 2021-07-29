import React from 'react';
import styles from '../styles/home.module.css';
import axios from 'axios';
import {
  Link
} from "react-router-dom";

export default function Homepage() {

  return (
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
    </div>
  );
}