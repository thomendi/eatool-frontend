import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { HomePage } from './general/pages/home/HomePage'
import { GeneralLayout } from './general/layouts/GeneralLayout'
import { ArtifactPage } from './general/pages/artifact/ArtifactPage'
import { ModelsPage } from './general/pages/models/ModelsPage'
import { LoginPage } from './auth/pages/login/LoginPage'
import { RecoveryPage } from './auth/pages/recovery/RecoveryPage'
import { DashboardPage } from './admin/pages/dashboard/DashboardPage'
import { AdminArtefactsPage } from './admin/pages/artefacts/AdminArtifactsPage'
import { AdminArtefactPage } from './admin/pages/artefact/AdminArtifactPage'
import { ProcessPage } from './general/pages/process/ProcessPage'
import { ProcessEditPage } from './general/pages/process/ProcessEditPage'



const AuthLayout = lazy(()=> import('./auth/layouts/AuthLayout'));
const AdminLayouts = lazy(()=> import('./admin/layouts/AdminLayout'));


export const appRouter = createBrowserRouter ([
    // Main routes
    {
       path: '/',
       element: <GeneralLayout />,
       children: [
        {
           index: true,
           element: <HomePage />,
        },
        {
           path: 'artifact/:idSlug',
           element: <ArtifactPage />,
        },
        {
            path: 'models',
            element: <ModelsPage/>,   //<ModelsPage ProcessEditPage/>
        },
        {
            path: 'process',
            element: <ProcessPage />
        },

       ],
    },

    // Auth Routes
    {
        path:  '/auth',
        element: <AuthLayout />,
        children: [
            {
               index: true,
               element: <Navigate to="/auth/login" />,
            },
            {
               path: 'login',
               element: <LoginPage />,
            },
            {
                path: 'recovery',
                element: <RecoveryPage />,
            },
        ]
    },
    // Admin Routes
    {
        path: '/admin',
        element: <AdminLayouts />,
        children: [
            {
                index:true,
                element: <DashboardPage />,
            },
            {
                path: 'artifacts',
                element: <AdminArtefactsPage />,
            },
            {
                path: 'artifact/:id',
                element: <AdminArtefactPage />,
            },
        ]

    },
    {
        path: '*',
        element: <Navigate to="/" />,
    },
]) ;
