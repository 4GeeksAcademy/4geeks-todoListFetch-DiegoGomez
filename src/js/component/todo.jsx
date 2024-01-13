import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/todo.css";

const Todo = () => {
  const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
  const [newTask, setNewTask] = useState(""); // Estado para la nueva tarea

  const apiUrl = "http://localhost:3000/todos/user/diegogomezgonza"; // URL de la API

  // Función para crear una nueva lista de tareas
  const createTodoList = async () => {
    try {
      const response = await axios.post(apiUrl, []); // Enviar una solicitud POST para crear una nueva lista de tareas

      if (response.data.result === "ok") {
        console.log("Lista de tareas creada exitosamente");
      } else {
        console.error("Error al crear la lista de tareas:", response.data);
      }
    } catch (error) {
      console.error("Error al crear la lista de tareas:", error.message);
    }
  };

  // Función para obtener las tareas desde el servidor
  const fetchTasks = async () => {
    try {
      const response = await axios.get(apiUrl); // Obtener las tareas desde la API
      setTasks(response.data); // Actualizar el estado con las tareas obtenidas
    } catch (error) {
      console.error("Error al obtener las tareas:", error.message);
    }
  };

  useEffect(() => {
    const initializeTodoList = async () => {
      try {
        const response = await axios.get(apiUrl); // Verificar si la lista de tareas existe haciendo una solicitud GET

        if (response.data.length === 0) {
          await createTodoList(); // Si la lista no existe, crearla
        }

        fetchTasks(); // Obtener las tareas después de asegurarse de que la lista de tareas existe
      } catch (error) {
        console.error("Error al verificar la lista de tareas:", error.message);
      }
    };

    initializeTodoList();
  }, [apiUrl]);

  // Función para agregar una nueva tarea
  const addTask = async () => {
    try {
      if (newTask.trim()) {
        const updatedTasks = [...tasks, { label: newTask.trim(), done: false }]; // Crear una nueva lista de tareas con la tarea agregada

        await axios.put(apiUrl, updatedTasks); // Enviar una solicitud PUT para actualizar la lista de tareas en el servidor

        setTasks(updatedTasks); // Actualizar el estado con la nueva lista de tareas
        setNewTask(""); // Limpiar el campo de nueva tarea
      }
    } catch (error) {
      console.error("Error al agregar una tarea:", error.message);
    }
  };

  // Función para manejar la tecla Enter al agregar una tarea
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      addTask(); // Si la tecla presionada es Enter, agregar la tarea
    }
  };

  // Función para eliminar todas las tareas
  const clearAllTasks = async () => {
    await axios.delete(apiUrl); // Enviar una solicitud DELETE para eliminar todas las tareas en el servidor
    setTasks([]); // Actualizar el estado con una lista vacía de tareas
  };

  return (
    <div className="text-center">
      <p className="mt-2">Diego Gómez</p>
      <hr className="w-50 mx-auto" />
      <h1 className="display-1 opacity-25">Lista de tareas</h1>

      <div className="mt-3">
        <div className="input-group mb-3 mx-auto w-50 input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder="Estudiar React"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleEnter}
          />
        </div>
        <button className="btn btn-danger mt-3" onClick={clearAllTasks}>
          Borrar todas las tareas
        </button>
      </div>

      <ul className="list-group mt-3 mx-auto w-50">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center list-item"
          >
            {task.label}
            <span
              className="badge badge-danger badge-pill"
              style={{ cursor: "pointer" }}
              onClick={() => deleteTask(index)}
            >
              <i className="fa-solid fa-x" style={{ color: "#c20000" }}></i>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 mx-auto w-50">{tasks.length} elementos restantes</p>
    </div>
  );
};

export default Todo;
