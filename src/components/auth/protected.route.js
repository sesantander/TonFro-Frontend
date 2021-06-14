import React from "react";
import { Route, Redirect } from "react-router-dom";
//import auth from "./auth";
import Admin from '../admin/Admin';

const token = localStorage.getItem('token');
         
export const ProtectedRoute = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (token && token!=='') {
          return (<Admin><Component {...props} /></Admin>);
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                
              }}
            />
          );
        }
      }}
    />
  );
};
