import Login from './login';
import Signup from './signup';
import Homepage from './homepage';
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
      </Switch>
    </Router>
  );
}