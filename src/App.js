
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import Login from './components/Login';
import Home from './container/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='*' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
