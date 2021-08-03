import React from 'react';
import styles from '../styles/dashboard.module.css';
import Navbar from './navbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TransactionTable from './transactionTable';

export default function Transactions() {

  function getDate() {
    var today = new Date();
    return today.getMonth() + " " + today.getDay() + ", " + today.getFullYear();
  }

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Container fluid>
          <Row>
            <Col>
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardContent>
                  <h1>Transactions</h1>
                  <p className={styles.date}>{getDate()}</p>
                </CardContent>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardContent>
                  <h2>Buys</h2>
                  <TransactionTable action="buy" />
                </CardContent>
              </Card>
            </Col>
            <Col md={6}>
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardContent>
                  <h2>Sells</h2>
                  <TransactionTable action="sell" />
                </CardContent>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}