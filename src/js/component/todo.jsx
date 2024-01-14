import React, { useState, useEffect } from "react";
import axios from "axios"; // Importar la biblioteca axios

const Todo = () => {
  // Estados para las tareas
  const [tasks, setTasks] = useState([]);
  //Estados para las nuevas tareas
  const [newTask, setNewTask] = useState("");
  //Estados para el alert que aparece al recargar la página
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(false);

  // URLs de la API
  //GET (obtener tareas)
  const getApiUrl = "https://playground.4geeks.com/apis/fake/todos/user";
  //POST, PUT y DELETE (crear, actualizar y eliminar tareas)
  const actionsApi =
    "https://playground.4geeks.com/apis/fake/todos/user/diegogomezgonza";

  // Función para crear un usuario
  const createUser = async () => {
    //Para crear el usuario, hago una petición POST la cual usa un fetch
    //que tiene como parámetros la URL con el endpoint para crear mi usuario.
    //Al ser la primera vez que se llama a la API, el usuario no existe, por lo que se crea
    try {
      const response = await fetch(actionsApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([]),
      });

      //Si la respuesta es correcta, se crea el usuario, sino, se muestra un error.
      if (response.ok) {
        console.log("Usuario creado");
      } else {
        console.error("Error al crear usuario:", response.statusText);
      }
    } catch (error) {
      console.error("Error al crear usuario:", error.message);
    }
  };

  // Función para guardar las tareas en el almacenamiento local (para que no se pierdan al recargar la página)
  // El localStorage solo me permite guardar strings, por lo que tengo que convertir el array de tareas a string
  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Función para obtener las tareas desde el almacenamiento local
  const getTasksFromLocalStorage = () => {
    // Si hay tareas guardadas en el localStorage, las obtengo.
    const storedTasks = localStorage.getItem("tasks");
    // Si no hay tareas guardadas, devuelvo un array vacío.
    return storedTasks ? JSON.parse(storedTasks) : [];
  };

  // Función para eliminar una tarea
  const deleteTask = async (index) => {
    try {
      // Creo un nuevo array de tareas sin la tarea que quiero eliminar (la tarea con el índice index) y lo guardo en una constante updatedTasks
      const updatedTasks = [...tasks];
      // Elimino la tarea del array updatedTasks usando splice.
      updatedTasks.splice(index, 1);

      // Para eliminar una tarea, hago una petición PUT la cual usa un fetch que tiene
      // como parámetros la URL con el endpoint para actualizar las tareas.
      const response = await fetch(actionsApi, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTasks),
      });

      // Si la respuesta es correcta, se elimina la tarea, sino, se muestra un error.
      if (response.ok) {
        console.log("Tarea eliminada exitosamente");
        setTasks(updatedTasks);
        // Si la respuesta es 400, significa que no hay más tareas que eliminar, por lo que se borran todas las tareas
      } else if (response.status === 400) {
        console.log("No hay más tareas que eliminar");
        setTasks([]);
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
      // Si el campo de la nueva tarea no está vacío, agrego la tarea al array de tareas
      if (newTask.trim()) {
        // A updatedTasks le agrego la nueva tarea usando spread operator (replicando el array) y la guardo en una constante updatedTasks
        const updatedTasks = [...tasks, { label: newTask.trim(), done: false }];
        // De nuevo hago el fetch al endpoint que contiene las tareas, esta vez haciendo un PUT para añadirlas.
        const response = await fetch(actionsApi, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTasks),
        });

        // Si la respuesta es correcta, se agrega la tarea, sino, se muestra un error.
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
  useEffect(
    () => {
      const checkUserAndShowAlert = async () => {
        // Verifico la existencia de mi user en la API haciendo un GET al endpoint que contiene
        // los usuarios y guardo su respuesta.
        try {
          const response = await fetch(getApiUrl);

          // Si la respuesta es correcta (200 o 201), verifico si mi user existe en la API, sino, muestro un error.
          if (response.ok) {
            const data = await response.json();
            // Con data.some() verifico si mi user existe en la API y guardo su resultado en userExists
            const userExists = data.some((user) => user === "diegogomezgonza");

            // Si mi user existe en la API, muestro la alerta de bienvenida, sino, creo el usuario.
            if (userExists) {
              setShowWelcomeAlert(true);
              createUser();
            } else {
              createUser();
            }
          } else {
            //StatusText es el mensaje de error que devuelve la API
            console.error(
              "Error al verificar el usuario:",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error al verificar el usuario:", error.message);
        }
      };

      // Llamo a la función para verificar el usuario y mostrar la alerta de bienvenida
      checkUserAndShowAlert();
    },
    //Cada vez que la página se recarga, se vuelve a llamar a la función para verificar el usuario y mostrar la alerta de bienvenida
    [getApiUrl]
  );

  // Efecto para cargar las tareas desde el almacenamiento local al montar el componente
  useEffect(() => {
    // Obtengo las tareas desde el almacenamiento local y las guardo en una constante storedTasks
    const storedTasks = getTasksFromLocalStorage();
    // Actualizo el estado de las tareas con las tareas guardadas en el almacenamiento local
    setTasks(storedTasks);
  }, []);

  // Efecto para guardar las tareas en el almacenamiento local cada vez que cambian
  useEffect(() => {
    // Guardo las tareas en el almacenamiento local
    saveTasksToLocalStorage(tasks);
    // Cada vez que cambian las tareas, se vuelve a guardar en el almacenamiento local
  }, [tasks]);

  // Función para manejar la tecla Enter al agregar una tarea
  const handleEnter = (e) => {
    //Si la tecla Enter se pulsa, se ejecuta addTask()
    if (e.key === "Enter") {
      addTask();
    }
  };

  // Función para eliminar todas las tareas y recargar la página
  const clearAllTasks = async () => {
    try {
      // Hago una petición DELETE al endpoint que contiene las tareas para eliminarlas.
      const response = await fetch(actionsApi, {
        method: "DELETE",
      });

      // Si la respuesta es correcta, se eliminan todas las tareas; sino, se muestra un error.
      if (response.ok) {
        console.log("Todas las tareas eliminadas exitosamente");
        setTasks([]);

        // Como el endpoint que contiene mi usuario y tareas es el mismo, al eliminarlas todas el usuario también se elimina.
        // Cuando la página se recarga, se vuelve a crear el usuario, es por esto que al pulsar el botón de borrar todas las tareas,
        // se eliminan todas las tareas y tambien se recarga la página.
        window.location.reload();
      } else {
        console.error("Error al borrar todas las tareas:", response.statusText);
      }
    } catch (error) {
      console.error("Error al borrar todas las tareas:", error.message);
    }
  };

  // Efecto para ocultar la alerta de bienvenida después de 4 segundos
  useEffect(() => {
    //Con timeout, muestro la alerta de bienvenida durante 4 segundos
    const timeoutId = setTimeout(() => {
      setShowWelcomeAlert(false);
    }, 4000);

    // Para limpiar el timeout, devuelvo una función que se ejecuta cuando se carga la página
    return () => clearTimeout(timeoutId);
  }, [showWelcomeAlert]);

  // Renderizar el componente
  return (
    <div className="text-center">
      <p className="mt-2">Diego Gómez</p>
      <hr className="w-50 mx-auto" />
      {/* Si se cumplen las condiciones para mostrar el alert, se muestra el mensaje del div */}
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
        {/* Botón para eliminar taréas */}
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

      {/* Taréas restantes */}
      <p className="mt-3 mx-auto w-50">{tasks.length} items left</p>
    </div>
  );
};

export default Todo;
