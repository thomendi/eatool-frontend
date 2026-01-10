

import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Outlet />
    </div>
  )
};

export default AuthLayout;
