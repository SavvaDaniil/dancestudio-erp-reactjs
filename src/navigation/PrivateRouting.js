import React from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../store/UserContext";
import MainLayout from "../components/layouts/MainLayout";

const PrivateRouting = () => {
    const {user} = React.useContext(UserContext);

    return user.isAuthed ? <MainLayout /> : <Navigate to="/login" />
}

export default PrivateRouting;