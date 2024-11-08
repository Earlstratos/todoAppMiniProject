import React from "react";
import "./About.css";
const About = () => {
  return (
    <div className="about d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="d-flex">
          <h1>About Us</h1>
        </div>

        <p>
        At TodoApp, we believe that productivity starts with simplicity. Our mission is to help individuals and teams manage their time, tasks, and priorities in a more efficient way. In today’s fast-paced world, keeping track of daily responsibilities can be overwhelming, which is why we’ve created an intuitive, user-friendly To-Do app that helps you stay organized and focused on what matters most.
        Our team consists of passionate developers, designers, and productivity enthusiasts who understand the challenges of juggling personal and professional tasks. We’ve designed this app with the user in mind, combining ease of use with powerful features that allow you to manage everything from grocery lists to complex projects.
        With our app, we aim to provide a simple yet effective tool that empowers you to achieve your goals, manage deadlines, and improve productivity without the clutter. Whether you’re an individual looking to stay on top of daily tasks or a team in need of a collaborative solution, our To-Do app is built to adapt to your needs.
        Thank you for choosing TodoApp! We’re excited to help you stay organized and accomplish more.
        </p>
      </div>
    </div>
  );
};

export default About;
