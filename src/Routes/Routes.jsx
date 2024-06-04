import {
  createBrowserRouter,

} from "react-router-dom";
import { Home } from "../Pages/Home/Home";
import { MainLayout } from "../Layout/MainLayout";
import ErrorPage from "../Pages/ErrorPage";
import { AvailableCamp } from "../Pages/AvailableCamp/AvailableCamp";
import { JoinUs } from "../Pages/JoinUs/JoinUs";
import { Register } from "../Pages/Register/Register";
import { DashBoard } from "../Pages/Dashboard/DashBoard";
import { PrivateRoute } from "../Providers/PraivateRoute";
import { MyProfile } from "../Pages/Profile/MyProfile";
import { OrgProfile } from "../Pages/Dashboard/Organizer/OrgProfile";
import { AddCamp } from "../Pages/Dashboard/Organizer/AddCamp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: '/availableCamps',
        element: <AvailableCamp></AvailableCamp>
      },
      {
        path: '/joinUs',
        element: <JoinUs></JoinUs>
      },
      {
        path: '/register',
        element: <Register></Register>
      },
      {
        path: '/myProfile',
        element: <PrivateRoute><MyProfile></MyProfile></PrivateRoute>

      },
      {
        path: '/dashboard',
        element: <PrivateRoute><DashBoard></DashBoard></PrivateRoute>,
        children: [
          {
            path: 'organizerProfile',
            element: <OrgProfile></OrgProfile>
          },
          {
            path: 'addACamp',
            element: <AddCamp></AddCamp>
          }
        ]
      }
    ]
  },

]);

export default router