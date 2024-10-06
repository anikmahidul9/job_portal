
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './components/auth/Signup'
import Login from './components/auth/Login'
import Home from './components/Home'
import JobsDescription from './components/JobsDescription'
import Browse from './components/Browse'
import UserProfile from './components/UserProfile'


const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home/>,
  },
  {
    path:'/signup',
    element:<Signup/>,
  },
  {
    path:'/login',
    element:<Login/>,
  },
  {
    path:'/job',
    element:<JobsDescription/>
  },
  {
    path:'/browse',
    element:<Browse/>,
  },
  {
    path:'/profile',
    element:<UserProfile/>,
  }
])
function App() {


  return (
    <>
    <RouterProvider router={appRouter} />
    </>
  )
}

export default App
