import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Layout from './components/Layout';

function App() {
  const token = localStorage.getItem('token');
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard"/> : <Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;