import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import CreateEvent from "./pages/events/CreateEvent";
import ListEvents from "./pages/events/ListEvents";
import ListSales from "./pages/sales/ListSales";
import CreateSale from "./pages/sales/CreateSale";
import UpdateSaleStatus from "./pages/sales/UpdateSaleStatus";

export default function AppRoutes() {

    return(

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<App />}
                />

                <Route
                    path="/events/create"
                    element={<CreateEvent />}
                />

                <Route
                    path="/events"
                    element={<ListEvents />}
                />

                <Route
                    path="/sales"
                    element={<ListSales />}
                />

                <Route
                    path="/sales/create"
                    element={<CreateSale />}
                />

                <Route
                    path="/sales/update-status"
                    element={<UpdateSaleStatus />}
                />

            </Routes>

        </BrowserRouter>

    )

}