import React, { useState, useEffect } from "react";
import axios from "axios"; // Importar la biblioteca axios

const Todo = () => {
  // Estados para las tareas, nueva tarea, y alerta de bienvenida
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(false);

  // URLs de la API
  const getApiUrl = "https://playground.4geeks.com/apis/fake/todos/user";
  const postPutApiUrl =
    "https://playground.4geeks.com/apis/fake/todos/user/diegogomezgonza";

  // Función para crear un usuario
  const createUser = async () => {
    try {
      const response = await fetch(postPutApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([]),
      });

      if (response.ok) {
        console.log("Usuario creado");
      } else {
        console.error("Error al crear usuario:", response.statusText);
      }
    } catch (error) {
      console.error("Error al crear usuario:", error.message);
    }
  };

  // Función para guardar las tareas en el almacenamiento local
  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Función para obtener las tareas desde el almacenamiento local
  const getTasksFromLocalStorage = () => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  };

  // Función para eliminar una tarea
  const deleteTask = async (index) => {
    try {
      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);

      const response = await fetch(postPutApiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTasks),
      });

      if (response.ok) {
        console.log("Tarea eliminada exitosamente");
        setTasks(updatedTasks);
      } else {
        console.error("Error al eliminar la tarea:", response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar la tarea:", error.message);
    }
  };

  // Función para agregar una nueva tarea
  const addTask = async () => {
    try {
      if (newTask.trim()) {
        const updatedTasks = [...tasks, { label: newTask.trim(), done: false }];
        const response = await fetch(postPutApiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTasks),
        });

        if (response.ok) {
          console.log("Tarea agregada exitosamente");
          setTasks(updatedTasks);
          setNewTask("");
        } else {
          console.error("Error al agregar una tarea:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error al agregar una tarea:", error.message);
    }
  };

  // Efecto para verificar el usuario y mostrar la alerta de bienvenida
  useEffect(() => {
    const checkUserAndShowAlert = async () => {
      try {
        const response = await fetch(getApiUrl);

        if (response.ok) {
          const data = await response.json();
          const userExists = data.some((user) => user === "diegogomezgonza");

          if (userExists) {
            setShowWelcomeAlert(true);
            createUser(); // Opcionalmente, crear el usuario aquí si es necesario
          } else {
            createUser();
          }
        } else {
          console.error("Error al verificar el usuario:", response.statusText);
        }
      } catch (error) {
        console.error("Error al verificar el usuario:", error.message);
      }
    };

    checkUserAndShowAlert();
  }, [getApiUrl]);

  // Efecto para cargar las tareas desde el almacenamiento local al montar el componente
  useEffect(() => {
    const storedTasks = getTasksFromLocalStorage();
    setTasks(storedTasks);
  }, []);

  // Efecto para guardar las tareas en el almacenamiento local cada vez que cambian
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  // Función para manejar la tecla Enter al agregar una tarea
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      addTask(); // Si la tecla presionada es Enter, agregar la tarea
    }
  };

  // Función para eliminar todas las tareas
  const clearAllTasks = async () => {
    try {
      const response = await fetch(postPutApiUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Todas las tareas eliminadas exitosamente");
        setTasks([]);
      } else {
        console.error("Error al borrar todas las tareas:", response.statusText);
      }
    } catch (error) {
      console.error("Error al borrar todas las tareas:", error.message);
    }
  };

  // Efecto para ocultar la alerta de bienvenida después de 4 segundos
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowWelcomeAlert(false);
    }, 4000);

    // Limpiar el temporizador cuando el componente se desmonta o cuando se cierra manualmente la alerta
    return () => clearTimeout(timeoutId);
  }, [showWelcomeAlert]);

  // Renderizar el componente
  return (
    <div className="text-center">
      <p className="mt-2">Diego Gómez</p>
      <hr className="w-50 mx-auto" />
      {showWelcomeAlert && (
        <div className="alert alert-success" role="alert">
          ¡Bienvenido Diego!
        </div>
      )}
      <h1 className="display-1 opacity-25">To do list with Fetch API</h1>

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

      <p className="mt-3 mx-auto w-50">{tasks.length} items left</p>
    </div>
  );
};

export default Todo;
