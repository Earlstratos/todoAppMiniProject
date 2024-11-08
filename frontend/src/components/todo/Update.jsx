import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Update = ({ display, update }) => {
  const [Inputs, setInputs] = useState({
    title: "",
    body: "",
  });
  useEffect(() => {
    setInputs({
      title: update.title || "",
      body: update.body || "",
    });
  }, [update]);

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };
  const submit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v2/updateTask/${update._id}`,
        Inputs
      );
      toast.success(response.data.message);
      display("none");
    } catch (error) {
      toast.error("Error updating the task");
      console.error("Error updating the task:", error);
    }
  };
  return (
    <div className="p-5  d-flex justify-content-center align-items-start flex-column update  ">
      <h3>Update Your Task</h3>
      <input
        type="text"
        className="todo-inputs my-4 w-100 p-3"
        value={Inputs.title}
        name="title"
        onChange={change}
      />
      <textarea
        className="todo-inputs w-100 p-3"
        value={Inputs.body}
        name="body"
        onChange={change}
      />
      <div>
        <button className="btn btn-dark my-4" onClick={submit}>
          UPDATE
        </button>
        <button
          className="btn btn-danger my-4 mx-3"
          onClick={() => {
            display("none");
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Update;
