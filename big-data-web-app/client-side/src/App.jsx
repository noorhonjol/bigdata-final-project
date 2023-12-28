import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import MostUsersTweetsPage from "./MostUsersTweetsPage";
import { Layout } from "./Layout";
import UserQueryFilter from "./UserQueryFilter";

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