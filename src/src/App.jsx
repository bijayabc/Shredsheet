import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom'
import Login from "../components/Login"
import Register from "../components/Register"
import Dashboard from '../components/Dashboard';
import Layout from '../components/Layout';
import WorkoutForm from '../components/WorkoutForm';
import RoutinesList from '../components/RoutinesList';
import RoutineForm from '../components/RoutineForm';
import WorkoutsList from '../components/WorkoutsList';
import Profile from '../components/Profile';
import WorkoutInfo from '../components/WorkoutInfo';
import RoutineInfo from '../components/RoutineInfo';
import NotFound from '../components/NotFound';
import Edit from '../components/Edit';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route element={<Layout />}>
          <Route path='profile' element={<Profile />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='workouts' element={<WorkoutsList />} />
          <Route path='workouts/new' element={<WorkoutForm />} />
          <Route path='workouts/:id' element={<WorkoutInfo />} />
          <Route path='routines' element={<RoutinesList />} />
          <Route path='routines/new' element={<RoutineForm />} />
          <Route path='routines/:id' element={<RoutineInfo />} />
          <Route path='routines/edit/:id' element={<Edit />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
}

export default App;


