import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../styles/dashboard.module.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import SearchBar from "material-ui-search-bar";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from "axios";
import { useHistory } from "react-router-dom";

interface Column {
  id: 'name' | 'price' | 'status';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'name', label: 'Ticker', minWidth: 170 },
  {
    id: 'price',
    label: 'Price',
    minWidth: 100,
    format: (value: number) => value.toFixed(2)
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100
  }
];

interface Ticker {
  name: string;
  price: number;
  status: string;
}

function createData(name: string, price: number, statusBool: boolean): Ticker {
  var status = statusBool ? "Active" : "Deleted"
  return { name, price, status };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});


export default function TickerTable({ admin }) {
  const classes = useStyles();
  let history = useHistory();
  const [page, setPage] = useState(0);
  const [searched, setSearched] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [originalRows, setOriginalRows] = useState<Ticker[]>([]);
  const [rows, setRows] = useState<Ticker[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tickerDesc, setTickerDesc] = useState("");
  const [editedTicker, setEditedTicker] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Filter controls
  const [upperPrice, setUpperPrice] = useState(0);
  const [lowerPrice, setLowerPrice] = useState(10000);
  const [activeChecked, setActiveChecked] = useState(true);
  const [deletedChecked, setDeletedChecked] = useState(false);


  axios.defaults.withCredentials = true;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = (id: string) => {

    // Make axios call to get ID of ticker
    axios.get('http://localhost:5001/stockid', {
      params: {
        ticker: id
      }
    }).then(response => {
      console.log("SUCCESS", response);
      history.push("/stock/" + response.data)
    }).catch(error => {
      console.log(error);
    })
  }

  const handleStatusClick = (ticker: string, status: string) => {
    const data = {
      ticker: ticker,
      status: status
    };

    axios.put('http://localhost:5001/tickers/status', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log("SUCCESS", response);
      initialize();
    }).catch(error => {
      console.log(error);
    })
  }

  const requestSearch = (searchedVal: string) => {
    const filteredRows = originalRows.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const handleDialogOpen = (name) => {
    setEditedTicker(name);
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleDescChange = (e) => {
    setTickerDesc(e.target.value);
  }

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const data = {
      ticker: editedTicker,
      desc: tickerDesc
    }
    axios.put('http://localhost:5001/tickers/description', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log("SUCCESS", response);
      setDialogOpen(false);
      initialize();
    }).catch(error => {
      console.log(error);
    })
  }

  const handleActiveChecked = (e) => {
    setActiveChecked(e.target.checked);
  }

  const handleDeletedChecked = (e) => {
    setDeletedChecked(e.target.checked);
  }

  const handleUpperChange = (e) => {
    if (!isNaN(+e.target.value)) {
      setUpperPrice(+e.target.value);
    }
  }

  const handleLowerChange = (e) => {
    if (!isNaN(+e.target.value)) {
      setLowerPrice(+e.target.value);
    }
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  }

  function statusMatch(status, active, deleted) {
    var statusBool = false;
    if (status === "Active") {
      statusBool = true;
    }
    if (statusBool && active) {
      return true;
    }
    else if (!statusBool && deleted) {
      return true;
    }
    else {
      return false;
    }
  }

  useEffect(() => {
    const filteredRows = originalRows.filter((row) => {
      return row.price > lowerPrice && row.price < upperPrice && statusMatch(row.status, activeChecked, deletedChecked);
    });
    setRows(filteredRows);
  }, [lowerPrice, upperPrice, deletedChecked, activeChecked])

  function initialize() {
    axios.get('http://localhost:5001/tickers').then(response => {
      console.log("SUCCESS", response);
      setOriginalRows(response.data.stocks.map((entry: any) => createData(entry.name, entry.price, entry.status)));
      setRows(response.data.stocks.map((entry: any) => createData(entry.name, entry.price, entry.status)));
    }).catch(error => {
      console.log(error);
    })
  }

  useEffect(() => {
    initialize();
  }, [])

  return (
    <Paper className={classes.root} style={{ border: "none", boxShadow: "none" }}>
      <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Ticker</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter new details for the stock {editedTicker}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Description"
            type="name"
            fullWidth
            onChange={handleDescChange}
          />
          <Button
            variant="contained"
            component="label"
            color="primary"
          >
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
      <Card variant="outlined" className="mb-3">
        <CardContent>
          <p className={styles.subtitle}>Filter</p>
          <Row className="mt-3">
            <Col>
              <p>Price</p>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Greater Than"
                type="name"
                fullWidth
                onChange={handleLowerChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Less Than"
                type="name"
                fullWidth
                onChange={handleUpperChange}
              />
            </Col>
            <Col>
              <p>Status</p>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox checked={activeChecked} name="Active" color="primary" onChange={handleActiveChecked} />}
                  label="Active"
                />
                <FormControlLabel
                  control={<Checkbox checked={deletedChecked} name="Deleted" color="primary" onChange={handleDeletedChecked} />}
                  label="Deleted"
                />
              </FormGroup>
            </Col>
          </Row>
        </CardContent>
      </Card>
      <SearchBar
        value={searched}
        onChange={(searchVal) => requestSearch(searchVal)}
        onCancelSearch={() => cancelSearch()}
      />
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              {admin ? (
                <TableCell>
                  Edit
                </TableCell>
              ) : undefined}
              {admin ? (
                <TableCell>
                  Delete
                </TableCell>
              ) : undefined}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align} onClick={() => handleClick(row.name)}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  {admin ? (
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(row.name)}>Edit</Button>
                    </TableCell>
                  ) : undefined}
                  {admin ? (
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleStatusClick(row.name, row.status)}
                      >
                        {row.status === "Active" ? "Delete" : "Activate"}
                      </Button>
                    </TableCell>
                  ) : undefined}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}