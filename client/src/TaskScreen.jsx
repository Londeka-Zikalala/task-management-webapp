import React, { useState, useEffect } from "react";
import { Button, Form, Table, Modal, Alert } from "react-bootstrap";
import axios from "axios";
import {jwt_decode} from "jwt-decode";
import "../src/tasks.css";

export default function TaskScreen(){
    // states for the tasks view and creating a new task
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
      id: null,
      title: "",
      description: "",
      due_date: "",
      status: false,
    });

    //  state for deleting a task
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

   // Fetch tasks 
   useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/tasks/user");
        setTasks(response.data); 
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Decode the token to get the user_id
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.id; 

      // Set the user_id in newTask
      newTask.id = userId;
    if (newTask.id && newTask.title && newTask.description && newTask.due_date) {
      try {
        const response = await axios.post("/tasks/create", newTask);

        // Update task list with newly created task
        setTasks([...tasks, response.data]);

        // Show success validation message
        setValidationMessage("Task created");
        setShowAlert(true);

        // Hide the alert after 2 seconds
        setTimeout(() => setShowAlert(false), 2000);

        // Clear the form
        setNewTask({ user_id: null, title: "", description: "", due_date: "", status: false });
      
      }catch (error) {
        console.error("Error creating task:", error);
      }
     }
     } 
    }
  

  // Delete a task
  const deleteTask = () => {
    axios
      .post("/tasks/delete", { id: taskToDelete })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== taskToDelete));
        setShowDeleteModal(false);
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  // Update task status (checkbox)
  const toggleTaskStatus = (id, status) => {
    axios
      .post("/tasks/update", { id, status: !status })
      .then(() => {
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, status: !status } : task
        );
        setTasks(updatedTasks);
        if (!status) {
          alert("Task completed");
        }
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  return (
    <div className="task-container">
      <h2 className="task-title">Task Manager</h2>

      {/* Task Creation Section */}
      <div className="task-create-section">
        <h4>Create a Task</h4>
        {showAlert && (
          <Alert variant="success">{validationMessage}</Alert>
        )}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              placeholder="Enter task title"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              placeholder="Enter task description"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="due_date"
              value={newTask.due_date}
              onChange={(e) =>
                setNewTask({ ...newTask, due_date: e.target.value })
              }
            />
          </Form.Group>
          <Button variant="primary" onClick={addTask}>
            Add Task
          </Button>
        </Form>
      </div>

      {/* Task List Section */}
      <div className="task-list-section">
        <h4>Task List</h4>
        <Table striped bordered hover responsive>
          <thead>
            <tr className="task-table-header">
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.due_date}</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={task.status}
                    onChange={() => toggleTaskStatus(task.id, task.status)}
                    className={`status-checkbox ${
                      task.status ? "completed" : ""
                    }`}
                  />
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setShowDeleteModal(true);
                      setTaskToDelete(task.id);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteTask}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};



