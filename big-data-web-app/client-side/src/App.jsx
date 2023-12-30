import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import MostUsersTweetsPage from "./Pages/MostUsersTweetsPage";
import { Layout } from "./Layout";
import UserQueryFilter from "./Pages/UserQueryFilter";

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<MostUsersTweetsPage />} />
      <Route path="user-filter" element={<UserQueryFilter />} />
    </Route>
  )
);

function App() {

  return (<RouterProvider router={router} />);
}

export default App;