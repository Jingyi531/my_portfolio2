import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container mt-5">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
     

       <Link
          to="/"
          className="btn btn-custom"
          aria-label="Go to the home page"
        >
          Go Home
        </Link>
            
      
    </div>
  );
};

export default NotFound;