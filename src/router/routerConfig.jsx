import { PATH_NAME } from "./Pathname";
import SignUp from "../components/pages/SignUp/SignUp";
import SignIn from "../components/pages/SignIn/SignIn";
import Dashboard from "../components/pages/Dashboard/Dashboard";
import NoteGallery from "../components/pages/NoteGallery/NoteGallery";
import SmartLearning from "../components/pages/SmartLearning/SmartLearning";
import Information from "../components/pages/Information/Information";
import Trash from "../components/pages/Trash/Trash";
import Subscription from "../components/pages/Subscription/Subscription";
import HelpCenter from "../components/pages/HelpCenter/HelpCenter";

export const publicRoutes = [
    { path: PATH_NAME.SIGNUP, element: <SignUp /> },
    { path: PATH_NAME.SIGNIN, element: <SignIn /> },
];

export const privateRoutes = [
    // { path: PATH_NAME.HOME, element: <Home />, roles: ['free', 'learner', 'proUser'] },
    { path: PATH_NAME.DASHBOARD, element: <Dashboard />},
    { path: PATH_NAME.NOTE_GALLERY, element: <NoteGallery />},
    { path: PATH_NAME.SMART_LEARNING, element: <SmartLearning />},
    { path: PATH_NAME.INFORMATION, element: <Information />},
    { path: PATH_NAME.TRASH, element: <Trash />},
    { path: PATH_NAME.SUBSCRIPTION_NOW, element: <Subscription />},
    { path: PATH_NAME.HELP_CENTER, element: <HelpCenter />},
];