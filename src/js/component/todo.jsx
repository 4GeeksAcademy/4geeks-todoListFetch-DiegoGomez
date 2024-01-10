import React, { useState, useEffect } from "react";
import "../../css/todo.css";

const Todo = () => {
  // Estado para las taréas
  const [tasks, setTasks] = useState([]);

  // Estado para las nuevas tareas
  const [newTask, setNewTask] = useState("");

  // Función para añadir una nueva tarea
  const addTask = () => {
    // Compruebo si la tarea no es un string vacío/si hay algo escrito. Utilizo trim porque así me aseguro de
    //eliminar espacios en blanco.
    if (newTask.trim()) {
      // Si hay una tarea/se ha escrito, añádela a la nueva lista (...tasks). El poner los
      //tres puntos al lado de la lista indica que creo una nueva con el mismo contenido.
      //A esta lista nueva, le añado la nueva tarea.
      setTasks([...tasks, newTask.trim()]);

      // Limpio el campo para las nuevas taréas.
      setNewTask("");
    }
  };

  // Función para eliminar taréas, se eliminan segun el index
  const deleteTask = (indexToDelete) => {
    // Creo una lista vacía
    const finalTasks = [];

    //Recorro todas las tareas de la lista original de tareas (tasks)
    for (let i = 0; i < tasks.length; i++) {
      //Si el índice actual es diferente al de la tarea que se va a eliminar, se añade al array
      //finalTasks, el cual contiene las taréas que se muestran.
      if (i !== indexToDelete) {
        finalTasks.push(tasks[i]);
      }
    }

    // Actualizo el estado de las tareas para que contenga las finales.
    setTasks(finalTasks);
  };

  // Función para gestionar al pulsar la tecla enter
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      // Si enter se pulsa, ejecuta la función para añadir la taréa
      addTask();
    }
  };

  //Uso useEffect para hacer funcionar la transición que ocurre al añadir taréas.
  useEffect(() => {
    //Con setTimeOut, retraso la aparición de la opacidad 100 milisegundos
    const timeoutId = setTimeout(() => {
      //Selecciono todos los elementos que tengan la clase list-item aplicando una opacidad de 1 para
      //hacer las tareas visibles.
      document.querySelectorAll(".list-item").forEach((item) => {
        item.style.opacity = 1;
      });
    }, 100);

    //clearTimeOut se ejecutar cada vez que el array tasks cambia, de forma que con cada tarea
    //añadida habrá una nueva transición.
    return () => clearTimeout(timeoutId);
  }, [tasks]);

  return (
    <div className="text-center">
      <p className="mt-2">Diego Gómez</p>
      <hr className="w-50 mx-auto" />
      <h1 className="display-1 opacity-25">To do list</h1>

      <div className="mt-3">
        <div className="input-group mb-3 mx-auto w-50 input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder="Study React"
            //El contenido que se escriba en el input se guardará en newTask
            value={newTask}
            //Cada vez que el contenido del input cambie, se ejecuta esta función la cual actualiza el valor
            //de newTask.
            onChange={(e) => setNewTask(e.target.value)}
            //Con onKeyDown consigo que la función para que se añada la taréa al pulsar enter funcione
            onKeyDown={handleEnter}
          />
        </div>
      </div>

      <ul className="list-group mt-3 mx-auto w-50">
        {/* Hago un map de las tareas, mientras que task es la tarea que muestro en el contenido del li,
         index será el indice que use para recorrer las tareas*/}
        {tasks.map((task, index) => (
          <li
            //El key que tienen los objetos de mi lista es el índice que recorre las taréas, de esta forma me
            //aseguro de que cada tarea sea única
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center list-item"
          >
            {task}
            <span
              className="badge badge-danger badge-pill"
              style={{ cursor: "pointer" }}
              //El onclick que le asigno a la x elimina la tarea, para esto ejecuto la función deleteTask
              onClick={() => deleteTask(index)}
            >
              <i class="fa-solid fa-x" style={{ color: "#c20000" }}></i>
            </span>
          </li>
        ))}
      </ul>

      {/* Para mostrar cuantas tareas quedan, muestro su .length */}
      <p className="mt-3 mx-auto w-50">{tasks.length} items left</p>
    </div>
  );
};

export default Todo;
