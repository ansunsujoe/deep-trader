import React, { useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import axios from 'axios';
import Navbar from './navbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NetWorthChart from './networth';
import Button from '@material-ui/core/Button';
import {
  useParams
} from "react-router-dom";

export default function Stock() {

  type StockParams = {
    id: string;
  };

  const { id } = useParams<StockParams>();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:5001').then(response => {
      console.log("SUCCESS", response);
      alert("Successfully got update from App");
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
                  <h1>ID {id}</h1>
                  <p className={styles.date}>July 27, 2021</p>
                </CardContent>
              </Card>
              <Row>
                <Col>
                  <Card variant="outlined" style={{ border: "none", boxShadow: "none" }}>
                    <CardContent>
                      <Container fluid>
                        <Row>
                          <Col md={4}>
                            <h1 className={styles.number}>$31,487</h1>
                            <p className={styles.subtitle}>Total</p>
                          </Col>
                          <Col md={4}>
                            <h1 className={styles.number}>$7,711</h1>
                            <p className={styles.subtitle}>Invested</p>
                          </Col>
                          <Col md={2} xs={6}>
                            <Button variant="contained" size="large" fullWidth>Buy</Button>
                          </Col>
                          <Col md={2} xs={6}>
                            <Button variant="contained" size="large" fullWidth>Sell</Button>
                          </Col>
                        </Row>
                      </Container>
                    </CardContent>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card variant="outlined">
                    <CardContent>
                      <NetWorthChart />
                    </CardContent>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}