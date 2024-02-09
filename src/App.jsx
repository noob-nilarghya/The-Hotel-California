import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import GlobalStyles from "./styles/GlobalStyles";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./ui/AppLayout";

import { Toaster } from "react-hot-toast";
import SingleBooking from "./pages/SingleBooking";
import Checkin from "./pages/Checkin";
import ProtectedRoute from "./ui/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";

// creating a queryClient instance for setting up react-query for managing remote state
const queryClient= new QueryClient({ 
  defaultOptions: {
    queries: {
      staleTime: 0 * 1000 // for how long data should be cached (or staled)
    }
  }
});

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}> {/* react-query provider function (similar to contextAPI) */}
        <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools> {/* for setting up react-query dev tools */}

        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            {/* layout-route [NESTED ROUTE] */}
            <Route element={ 
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }> 
              <Route index element={<Navigate replace to="dashboard" />} /> {/* default (or index) route*/}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="booking/:bookingId" element={<SingleBooking />} />
              <Route path="checkin/:bookingId" element={<Checkin />} />
              <Route path="cabins" element={<Cabins />} />
              <Route path="create-user" element={<Users />} />
              <Route path="settings" element={<Settings />} />
              <Route path="account" element={<Account />} />
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>

        {/* setting up Toaster (3rd party lib) for displaying nice alert message in notification form */}
        <Toaster 
          position="top-center" 
          gutter={12} 
          containerStyle={{margin: "8px"}}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)"
            }
          }}>
        </Toaster>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
// 67atfPi8NebcHtfD