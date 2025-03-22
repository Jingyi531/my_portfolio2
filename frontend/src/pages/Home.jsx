import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    fetch(`${apiBaseUrl}/weather`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading weather...</p>;
  if (error) return <p>Error: {error.message}</p>;


  return (

    
    <div className="container mt-5">
      
   
      <h1 className="text-center mb-4" id="main-content">Welcome to My Portfolio</h1>

      <div className="row">

        
        
        <div className="col-md-8 mx-auto">
        {weather ? (
        <div className="card mb-5">
          <div className="card-body">
            <h5 className="card-title">Weather in {weather.city}</h5>
            <p className="card-text">Temperature: {weather.temperature.current}°C</p>
            <p className="card-text">Humidity: {weather.humidity}%</p>
          </div>
        </div>
        ) : (
          <p>No weather data available.</p>
        )}
        
          
              <p className="lead">
                Hi, I'm Jingyi Yang, a passionate computer science student at Dalhousie University.
                I specialize in full-stack development and problem-solving.
              </p>
              <p>
                Explore my portfolio to learn more about my projects, skills, and experience.
              </p>
              

              <Link
                to="/about"
                className="btn btn-custom"
                aria-label="Learn more about me"
              >
                Learn More
              </Link>
            
      
        </div>
      </div>
    </div>
  );
};

export default Home;