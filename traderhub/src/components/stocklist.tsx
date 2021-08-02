import React, { useState, useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import Navbar from './navbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TickerTable from './tickerTable';
import Button from '@material-ui/core/Button';
import axios from 'axios';

export default function StockList() {
  const [admin, setAdmin] = useState(false);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:5001/currentuser').then(response => {
      setAdmin(response.data.admin);
    }).catch(error => {
      console.log(error);
    })
  }, []);

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
              <TickerTable />
            </CardContent>
          </Card>
          {admin ? (
            <Button variant="contained" color="primary" className="m-3">Add Stock</Button>
          ) : undefined}
        </Container>
      </div>
    </div>
  );
}