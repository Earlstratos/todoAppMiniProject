import React, { useEffect, useState } from "react";
import "./Todo.css";
import TodoCards from "./TodoCards";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Update from "./Update";
import axios from "axios";
import { useSelector } from "react-redux";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

let toUpdateArray = [];

const Todo = () => {
  const [inputs, setInputs] = useState({ title: "", body: "" });
  const [dueDate, setDueDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const id = sessionStorage.getItem("id");

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  };

  // Show system notification
  const showNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  useEffect(() => {
    requestNotificationPermission(); // Request permission when component mounts
    fetchTasks(); // Fetch tasks on mount
  }, []);

  // Alert logic for due tasks
  useEffect(() => {
    const alertDueTasks = () => {
      const currentTime = new Date();
      tasks.forEach((task) => {
        const taskDueDate = new Date(task.dueDate);
        if (taskDueDate <= currentTime && !task.isNotified) {
          toast.warning(`Task "${task.title}" is due!`);
          showNotification(`Task Due: ${task.title}`, `Your task "${task.title}" is due!`);
          // Mark the task as notified
          task.isNotified = true;
        }
      });
    };

    const interval = setInterval(alertDueTasks, 60000); // Check every minute
    return () => clearInterval(interval); // Cleanup on unmount
  }, [tasks]); // Depend on tasks to re-check when they change

  const show = () => {
    document.getElementById("textarea").style.display = "block";
  };

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const submit = async () => {
    if (inputs.title === "" || inputs.body === "" || !dueDate) {
      toast.error("Title, Body, and Due Date are required");
    } else {
      if (id) {
        try {
          await axios.post("http://localhost:3000/api/v2/addTask", {
            title: inputs.title,
            body: inputs.body,
            dueDate: dueDate, // Send due date
            id: id,
          });
          fetchTasks(); // Fetch tasks after adding
          setInputs({ title: "", body: "" });
          
          setDueDate(null); // Reset due date
          toast.success("Task Added");
        } catch (error) {
          toast.error("Error Adding Task");
          console.error(error);
        }
      } else {
        toast.error("Please Sign Up to Save Tasks");
      }
    }
  };

  const fetchTasks = async () => {
    console.log("Fetching tasks with ID:", id); // Log the ID being used
    if (id) {
      try {
        const response = await axios.get(`http://localhost:3000/api/v2/getTask/${id}`);
        console.log("API Response:", response.data); // Log the response data

        const tasksWithNotification = (response.data.list || []).map(task => ({
          ...task,
          isNotified: false // Initialize isNotified property
        }));

        console.log("Tasks fetched:", tasksWithNotification); // Log fetched tasks
        setTasks(tasksWithNotification);
      } catch (error) {
        toast.error("Error Fetching Tasks");
        console.error(error);
      }
    } else {
      console.warn("ID is undefined");
    }
};

  const del = async (Cardid) => {
    if (id) {
      try {
        await axios.delete(`http://localhost:3000/api/v2/deleteTask/${Cardid}`, {
          data: { id: id },
        });
        toast.success("Task Deleted Successfully");
        fetchTasks(); // Fetch tasks after deletion
      } catch (error) {
        toast.error("Error Deleting Task");
        console.error(error);
      }
    } else {
      toast.error("Please Sign Up First!!");
    }
  };

  const dis = (value) => {
    document.getElementById("todo-update").style.display = value;
  };

  const update = (value) => {
    toUpdateArray = tasks[value];
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setTasks([]);
      sessionStorage.clear();
    }
  }, [isLoggedIn]);

  return (
    <>
      <div className="todo">
        <ToastContainer />
        <div className="todo-main container d-flex justify-content-center align-items-center my-4 flex-column">
          <div className="d-flex flex-column todo-inputs-div w-lg-50 w-100 p-1">
            <input
              type="text"
              placeholder="TITLE"
              className="my-2 p-2 todo-inputs"
              onClick={show}
              name="title"
              value={inputs.title}
              onChange={change}
            />
            <textarea
              type="text"
              placeholder="BODY"
              id="textarea"
              name="body"
              className="p-2 todo-inputs"
              value={inputs.body}
              onChange={change}
            />
            <br />
            <Datetime 
              value={dueDate}
              onChange={(value) => setDueDate(value)} // Correctly set dueDate
            />
          </div>
          <div className="w-50 w-100 d-flex justify-content-end my-3">
            <button className="home-btn px-2 py-1" onClick={submit}>
              Add Todo
            </button>
          </div>
        </div>
        <div className="todo-body">
          <div className="container-fluid">
            <div className="row">
              {tasks &&
                tasks.map((item, index) => (
                  <div
                    key={index}
                    className="col-lg-3 col-11 mx-lg-5 mx-3 my-2"
                  >
                    <TodoCards
                      title={item.title}
                      body={item.body}
                      dueDate={item.dueDate} // Display due date if needed
                      id={item._id}
                      delid={del}
                      display={dis}
                      updateId={index}
                      toBeUpdate={update}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="todo-update" id="todo-update">
        <div className="container update">
          <Update display={dis} update={toUpdateArray} />
        </div>
      </div>
    </>
  );
};

export default Todo;
