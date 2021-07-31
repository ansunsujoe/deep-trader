import React, { useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import axios from 'axios';
import Navbar from './navbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TransactionTable from './transactionTable';
import {
  Link
} from "react-router-dom";

export default function Transactions() {
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:5001').then(response => {
      console.log("SUCCESS", response);
      alert("Successfully got update from App");
    }).catch(error => {
      console.log(error);
    })
  }, [])

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Container fluid>
          <Row>
            <Col>
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardContent>
                  <h1>Ansun's Transactions</h1>
                  <p className={styles.date}>July 27, 2021</p>
                </CardContent>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardContent>
                  <h2>Buys</h2>
                  <TransactionTable />
                </CardContent>
              </Card>
            </Col>
            <Col md={6}>
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardContent>
                  <h2>Sells</h2>
                  <TransactionTable />
                </CardContent>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}