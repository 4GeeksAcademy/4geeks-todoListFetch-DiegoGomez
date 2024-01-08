import React, { useState } from "react";

const Todo = () => {
  // Estado para las taréas
  const [tasks, setTasks] = useState([]);

  // Estado para las nuevas tareas
  const [newTask, setNewTask] = useState("");

  // Función para añadir una nueva tarea
  const addTask = () => {
    // Comprobar si la tarea no está vacia
    if (newTask.trim()) {
      // Añadir la taréa a la lista
      setTasks([...tasks, newTask.trim()]);
      // Setear vacío las tareas para limpiar el input
      setNewTask("");
    }
  };

  // Función para eliminar taréas, se eliminan segun el index
  const removeTask = (index) => {
    // Filtrar las taréas con el index
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Función para gestionar al pulsar la tecla enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Si enter se pulsa, ejecuta la función para añadir la taréa
      addTask();
    }
  };

  return (
    <div className="text-center">
      <p className="mt-2">Diego Gómez</p>
      <hr className="w-75" />
      <h1 className="display-1 opacity-25">todos</h1>

      <div className="mt-3">
        <div className="input-group mb-3 mx-auto w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Wash my hands"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <ul className="list-group mt-3 mx-auto w-50">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {task}
            <span
              className="badge badge-danger badge-pill"
              style={{ cursor: "pointer" }}
              onClick={() => removeTask(index)}
            >
              X
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 mx-auto w-50">{tasks.length} items left</p>
    </div>
  );
};

export default Todo;
