import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { ProtectedRoute } from './auth/components/ProtectedRoute';
import { HomePage } from './general/pages/home/HomePage'
import { GeneralLayout } from './general/layouts/GeneralLayout'
import { ArtifactPage } from './general/pages/artifact/ArtifactPage'
import { LoginPage } from './auth/pages/login/LoginPage'
import { RecoveryPage } from './auth/pages/recovery/RecoveryPage'
import { DashboardPage } from './admin/pages/dashboard/DashboardPage'
import { AdminArtefactsPage } from './admin/pages/artefacts/AdminArtifactsPage'
import { AdminArtefactPage } from './admin/pages/artefact/AdminArtifactPage'
import { ProcessPage } from './general/pages/process/ProcessPage'

import { DataPage } from './general/pages/data/dataPage'
import { ProcessViewerPage } from './general/pages/process/ProcessViewerPage'
import ModelProcessPage from './general/pages/process/ModelProcessPage'

import { Applications } from './general/pages/apps/Applications'
import { Roles } from './general/pages/roles/Roles'
import { Risks } from './general/pages/risks/Risks'
import { ValueChainPage } from './general/pages/value-chain/ValueChainPage'

const AuthLayout = lazy(() => import('./auth/layouts/AuthLayout'));
const AdminLayouts = lazy(() => import('./admin/layouts/AdminLayout'));

export const appRouter = createBrowserRouter([
    // Protected Routes (Wrapped in ProtectedRoute)
    {
        element: <ProtectedRoute />,
        children: [
            // General Application Routes
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
                        element: <ModelProcessPage />,
                    },
                    {
                        path: 'models/:id',
                        element: <ModelProcessPage />,
                    },
                    {
                        path: 'process',
                        element: <ProcessPage />
                    },
                    {
                        path: 'process-viewer/:id',
                        element: <ProcessViewerPage />
                    },
                    {
                        path: 'data',
                        element: <DataPage />
                    },
                    {
                        path: 'apps',
                        element: <Applications />
                    },
                    {
                        path: 'roles',
                        element: <Roles />
                    },
                    {
                        path: 'risks',
                        element: <Risks />
                    },
                    {
                        path: 'value-chain',
                        element: <ValueChainPage />
                    },
                ],
            },
            // Admin Routes
            {
                path: '/admin',
                element: <AdminLayouts />,
                children: [
                    {
                        index: true,
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
            }
        ]
    },

    // Public Routes (Auth) - MUST be outside ProtectedRoute
    {
        path: '/auth',
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

    // Catch-all
    {
        path: '*',
        element: <Navigate to="/" />,
    },
]);
