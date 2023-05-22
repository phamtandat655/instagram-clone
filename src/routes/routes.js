import config from '../config/index';

// Pages
import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home/Home'));
const Explore = lazy(() => import('../pages/Explore/Explore'));
const Inbox = lazy(() => import('../pages/Inbox/Inbox'));
const Reels = lazy(() => import('../pages/Reels/Reels'));
const PersonalPage = lazy(() => import('../pages/PersonalPage/PersonalPage'));
const AccountEdit = lazy(() => import('../pages/AccountEdit/AccountEdit'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));
const RecommendUsers = lazy(() => import('../pages/RecommendUsers/RecommendUsers'));

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.explore, component: Explore },
    { path: config.routes.reels, component: Reels },
    { path: config.routes.inbox, component: Inbox },
    { path: config.routes.personalPage, component: PersonalPage },
    { path: config.routes.accountEdit, component: AccountEdit },
    { path: config.routes.notFound, component: NotFound },
    { path: config.routes.recommendUsers, component: RecommendUsers },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

// {
/* <Route
    path="/"
    element={
        <React.Suspense fallback={<Loader />}>
            <Home />
        </React.Suspense>
    }
/>
<Route
    path="/explore"
    element={
        <React.Suspense fallback={<Loader />}>
            <Explore />
        </React.Suspense>
    }
/>
<Route
    path="/videos"
    element={
        <React.Suspense fallback={<Loader />}>
            <Reels />
        </React.Suspense>
    }
/>
<Route
    path="/inbox"
    element={
        <React.Suspense fallback={<Loader />}>
            <Inbox />
        </React.Suspense>
    }
/>
<Route
    path="/personalPage/:email"
    element={
        <React.Suspense fallback={<Loader />}>
            <PersonalPage />
        </React.Suspense>
    }
/>
<Route
    path="/account/edit"
    element={
        <React.Suspense fallback={<Loader />}>
            <AccountEdit />
        </React.Suspense>
    }
/>
<Route
    path="/*"
    element={
        <React.Suspense fallback={<Loader />}>
            <NotFound />
        </React.Suspense>
    }
/> */
// }
