import { PATH_NAME } from "./Pathname";
import SignUp from "../components/pages/SignUp/SignUp";
import SignIn from "../components/pages/SignIn/SignIn";
import StartPage from "../components/pages/StartPage/StartPage";
import Dashboard from "../components/pages/Dashboard/Dashboard";
import NoteGallery from "../components/pages/NoteGallery/NoteGallery";
import SmartLearning from "../components/pages/SmartLearning/SmartLearning";
import Information from "../components/pages/Information/Information";
import Trash from "../components/pages/Trash/Trash";
import Subscription from "../components/pages/Subscription/Subscription";
import CheckOut from "../components/pages/CheckOut/CheckOut";
import HelpCenter from "../components/pages/HelpCenter/HelpCenter";
import NoteCanvas from "../components/pages/NoteCanvas/NoteCanvas";
import AdminDashboard from "../components/pages/AdminDashboard/AdminDashboard";
import AdminUserManagement from "../components/pages/AdminUserManagement/AdminUserManagement";
import AdminSubscription from "../components/pages/AdminSubscription/AdminSubscription";

export const publicRoutes = [
    { path: PATH_NAME.SIGNUP, element: <SignUp /> },
    { path: PATH_NAME.SIGNIN, element: <SignIn /> },
    { path: PATH_NAME.STARTPAGE, element: <StartPage /> },
];

export const privateRoutes = [
    // { path: PATH_NAME.HOME, element: <Home />, roles: ['free', 'learner', 'proUser'] },
    { path: PATH_NAME.DASHBOARD, element: <Dashboard />},
    { path: PATH_NAME.NOTE_GALLERY, element: <NoteGallery />},
    { path: PATH_NAME.SMART_LEARNING, element: <SmartLearning />},
    { path: PATH_NAME.INFORMATION, element: <Information />},
    { path: PATH_NAME.TRASH, element: <Trash />},
    { path: PATH_NAME.SUBSCRIPTION_NOW, element: <Subscription />},
    { path: PATH_NAME.CHECKOUT, element: <CheckOut />},
    { path: PATH_NAME.HELP_CENTER, element: <HelpCenter />},
    { path: PATH_NAME.NOTE_CANVAS, element: <NoteCanvas />},
];

export const adminRoutes = [
    {path: PATH_NAME.ADMIN_DASHBOARD, element: <AdminDashboard /> , isAdmin: true },
    {path: PATH_NAME.ADMIN_USERMANGEMENT, element: <AdminUserManagement /> , isAdmin: true },
    {path: PATH_NAME.ADMIN_SUBSCRIPTION, element: <AdminSubscription /> , isAdmin: true },
];

  