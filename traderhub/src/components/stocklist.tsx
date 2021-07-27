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

export default function StockList() {
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
                  <h1>All Stocks</h1>
                </CardContent>
              </Card>
            </Col>
          </Row>
          <Card style={{ border: "none", boxShadow: "none" }}>
            <CardContent>
              <TransactionTable />
            </CardContent>
          </Card>
        </Container>
      </div>
    </div>
  );
}