import Login from './login';
import Signup from './signup';
import Homepage from './homepage';
import Dashboard from './dashboard';
import Transactions from './transactions';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Homepage} exact />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/transactions" component={Transactions} />
      </Switch>
    </Router>
  );
}