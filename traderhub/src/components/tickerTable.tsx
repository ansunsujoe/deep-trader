import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import {useHistory} from "react-router-dom";

interface Column {
  id: 'name' | 'price';
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
  }
];

interface Ticker {
  name: string;
  price: number;
}

function createData(name: string, price: number): Ticker {
  return { name, price };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});


export default function TickerTable() {
  const classes = useStyles();
  let history = useHistory();
  const [page, setPage] = useState(0);
  const [searched, setSearched] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [originalRows, setOriginalRows] = useState<Ticker[]>([]);
  const [rows, setRows] = useState<Ticker[]>([]);
  axios.defaults.withCredentials = true;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = (id: string) => {
    const data = {
      ticker: id
    };
    // Make axios call to get ID of ticker
    axios.get('http://localhost:5001/tickers', {params: data}).then(response => {
      console.log("SUCCESS", response);
      history.push("/stocks/" + response.data)
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

  useEffect(() => {
    axios.get('http://localhost:5001/tickers').then(response => {
      console.log("SUCCESS", response);
      setOriginalRows(response.data.stocks.map((entry: any) => createData(entry.name, entry.price)));
      setRows(response.data.stocks);
    }).catch(error => {
      console.log(error);
    })
  }, [])

  return (
    <Paper className={classes.root}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align} onClick={() => handleClick(column.id)}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
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