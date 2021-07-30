import React, { useState, useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import axios from 'axios';
import Navbar from './navbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TransactionTable from './transactionTable';
import TickerTable from './tickerTable';

export default function StockList() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/tickers').then(response => {
      console.log("SUCCESS", response);
      setStocks(response.data);
    }).catch(error => {
      console.log(error);
    })
  }, [])

  const data = [
    {"name": "good", "price": "good"}
  ];

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
              <TickerTable data={stocks} />
            </CardContent>
          </Card>
        </Container>
      </div>
    </div>
  );
}