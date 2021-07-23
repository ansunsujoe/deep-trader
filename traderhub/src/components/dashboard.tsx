import React, { useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import axios from 'axios';
import Navbar from './navbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  Link
} from "react-router-dom";

export default function Dashboard() {
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
            <Col md={8}>
              <Row>
                <Col>
                  <Card>
                    <CardContent>
                      <p>Good</p>
                    </CardContent>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <CardContent>
                      <p>Good</p>
                    </CardContent>
                  </Card>
                </Col>
              </Row>
              <Card>
                <CardContent>
                  <p>Good</p>
                </CardContent>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <CardContent>
                  <p>Good</p>
                </CardContent>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}