/* eslint-disable no-unused-vars */
import React from "react";
import LandingPage from "./LandingPage";
import PersonalizedHomePage from "./PersonalizedHomePage";

const HomeWrapper = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <PersonalizedHomePage />;
  }

  return <LandingPage />;
};

export default HomeWrapper;
