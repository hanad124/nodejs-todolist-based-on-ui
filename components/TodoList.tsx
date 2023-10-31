import { useState, useEffect } from "react";
import { Cross2Icon, CheckIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TodoList = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [markedTodos, setMarkedTodos] = useState<number[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedTodo, setEditedTodo] = useState<string>("");

  useEffect(() => {
    // Read todos from session storage on component mount
    const storedTodos = window.localStorage.getItem("todos");
    // Read marked todos from session storage on component mount
    const storedMarkedTodos = window.localStorage.getItem("markedTodos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
    if (storedMarkedTodos) {
      setMarkedTodos(JSON.parse(storedMarkedTodos));
    }
  }, []);

  // active todos hander
  const handleActiveTodos = () => {
    const storedTodos = JSON.parse(
      window.localStorage.getItem("todos") || "[]"
    );
    const markedTodos = JSON.parse(
      window.localStorage.getItem("markedTodos") || "[]"
    );

    // Filter unmarked todos
    const unmarkedTodos = storedTodos.filter((todo: string, index: number) => {
      return !markedTodos.includes(index);
    });

    setTodos(unmarkedTodos);
    console.log("active todos:", unmarkedTodos);
  };

  const handleMarkTodo = (index: number) => {
    if (markedTodos.includes(index)) {
      // If the todo is already marked, remove it from the array
      setMarkedTodos((prevMarkedTodos) =>
        prevMarkedTodos.filter((todoIndex) => todoIndex !== index)
      );
      // Remove marked todos from session storage
      const storedMarkedTodos = localStorage.getItem("markedTodos");
      if (storedMarkedTodos) {
        const parsedMarkedTodos = JSON.parse(storedMarkedTodos);
        const updatedMarkedTodos = parsedMarkedTodos.filter(
          (todoIndex: number) => todoIndex !== index
        );
        if (updatedMarkedTodos.length === 0) {
          localStorage.removeItem("markedTodos");
        } else {
          localStorage.setItem(
            "markedTodos",
            JSON.stringify(updatedMarkedTodos)
          );
        }
      }
    } else {
      // Add marked todos to session storage
      const storedMarkedTodos = localStorage.getItem("markedTodos");
      if (storedMarkedTodos) {
        const parsedMarkedTodos = JSON.parse(storedMarkedTodos);
        const updatedMarkedTodos = [...parsedMarkedTodos, index];
        localStorage.setItem("markedTodos", JSON.stringify(updatedMarkedTodos));
      } else {
        localStorage.setItem("markedTodos", JSON.stringify([index]));
      }
      // If the todo is not marked, add it to the array
      setMarkedTodos((prevMarkedTodos) => [...prevMarkedTodos, index]);
    }
  };
  const handleAddTodo = (todo: string) => {
    // Check if todo is empty
    if (todo.trim() === "") {
      return;
    }

    const updatedTodos = [...todos, todo];
    const storedMarkedTodos = localStorage.getItem("markedTodos");

    if (storedMarkedTodos) {
      const parsedMarkedTodos = JSON.parse(storedMarkedTodos);
      const markedIndexes = parsedMarkedTodos.filter(
        (todoIndex: number) => todoIndex < updatedTodos.length
      );
      setMarkedTodos(markedIndexes);
      localStorage.setItem("markedTodos", JSON.stringify(markedIndexes));
    }

    setTodos(updatedTodos);

    // Store updated todos in session storage
    window.localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleDeleteTodo = (index: number) => {
    setTodos((prevTodos) =>
      prevTodos.filter((todo, todoIndex) => todoIndex !== index)
    );
    // Store updated todos in session storage
    window.localStorage.setItem(
      "todos",
      JSON.stringify(todos.filter((todo, todoIndex) => todoIndex !== index))
    );

    // Remove marked todos from session storage
    const storedMarkedTodos = localStorage.getItem("markedTodos");
    if (storedMarkedTodos) {
      const parsedMarkedTodos = JSON.parse(storedMarkedTodos);
      const updatedMarkedTodos = parsedMarkedTodos.filter(
        (todoIndex: number) => todoIndex !== index
      );
      localStorage.setItem("markedTodos", JSON.stringify(updatedMarkedTodos));
    }
  };

  const handleCloseDialog = () => {
    setEditIndex(null);
    setEditedTodo("");
  };

  const handleSaveTodo = () => {
    if (editedTodo.trim() !== "") {
      setTodos((prevTodos) => {
        const updatedTodos = [...prevTodos];
        updatedTodos[editIndex!] = editedTodo;
        window.localStorage.setItem("todos", JSON.stringify(updatedTodos));
        return updatedTodos;
      });
      //   Store updated todos in session storage
      handleCloseDialog();
    }
  };

  return (
    <div className="mx-5 max-w-md md:mx-auto md:max-w-2xl mt-10">
      {/* todolist input */}
      <div className="">
        <div className="focus-within:ring-1 focus-within:ring-violet-400 dark:focus-within:ring-violet-500 w-full h-14 bg-[#fff]/75  dark:bg-[#25273c]/75 backdrop-blur-3xl rounded">
          {/* custom check box */}
          <div className="flex h-full m-5">
            <div className="flex items-center my-auto bg-slate-400 hover:bg-gradient-to-r from-blue-400 to-violet-400  h-7 w-7 rounded-full overflow-hidden p-[1.5px] cursor-pointer">
              <div className="w-full h-full rounded-full bg-[#fff]  dark:bg-[#25273c]/75"></div>
            </div>

            <input
              type="text"
              placeholder="Create a new todo..."
              className="w-full h-full bg-transparent outline-none px-3 text-[#25273c] dark:text-[#fff] caret-violet-400 font-300 tracking-wider"
              onKeyPress={(e) => {
                // check if the input is empty
                if (e.key === "Enter") {
                  if (e.currentTarget.value.trim() === "") return;
                  handleAddTodo(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>{" "}
        {/*  todos  */}
        <div
          className="todos-container mt-4 rounded-t"
          style={{ maxHeight: "380px", overflowY: "auto" }}
        >
          {todos?.map((todo, index) => (
            <div className="" key={index}>
              {" "}
              <div
                className={`group cursor-pointer flex items-center justify-between bg-[#fff] dark:bg-[#25273c] p-5  h-14 border-b ${
                  index !== todos.length - 1
                    ? "border-b-1 border-b-slate-200 dark:border-b-slate-600"
                    : "border-b-1 border-b-slate-200 dark:border-b-slate-600"
                } ${index === 0 ? "rounded-t" : ""} ${
                  index === todos.length - 1 ? "rounded-b-none" : ""
                }`}
                key={index}
                style={{ flexGrow: 1 }}
              >
                <div
                  className="flex items-center flex-1"
                  onClick={() => {
                    handleMarkTodo(index);
                    //   setMarkedTodos
                  }}
                >
                  <div
                    className={`flex items-center my-auto ${
                      markedTodos.includes(index)
                        ? "bg-gradient-to-r from-blue-400 to-violet-400"
                        : "bg-slate-600"
                    }   h-7 w-7 rounded-full overflow-hidden p-[1.5px] cursor-pointer`}
                    //   onClick={() => handleMarkTodo(index)}
                  >
                    <div
                      className={`w-full h-full rounded-full bg-[#fff] flex justify-center items-center ${
                        markedTodos.includes(index)
                          ? "bg-gradient-to-r from-blue-400 to-violet-400"
                          : "dark:bg-[#25273c]"
                      }`}
                    >
                      {markedTodos.includes(index) && (
                        <CheckIcon className="w-4 h-4 text-[#fff] dark:text-[#fff]" />
                      )}
                    </div>
                  </div>
                  <p
                    className={`ml-5 text-[#25273c] font-light dark:text-[#fff] tracking-wider ${
                      markedTodos.includes(index)
                        ? "line-through text-gray-300 dark:text-gray-500"
                        : ""
                    }`}
                  >
                    {todo}
                  </p>
                </div>
                <div className="flex items-center gap-3 ">
                  {" "}
                  <Dialog>
                    <DialogTrigger>
                      {/* Render the edit button */}
                      <button
                        className="text-[#25273c] dark:text-[#fff] hidden group-hover:block"
                        onClick={() => {
                          setEditIndex(index);
                          setEditedTodo(todo);
                        }}
                      >
                        <Pencil1Icon className="w-5 h-5 text-slate-500 dark:text-slate-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Todo</DialogTitle>
                      </DialogHeader>
                      <div className="p-5">
                        <input
                          type="text"
                          value={editedTodo}
                          onChange={(e) => {
                            setEditedTodo(e.target.value);
                          }}
                          placeholder="Edit the todo..."
                          className="w-full h-10 px-3 text-[#25273c] dark:text-[#fff] rounded border border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-violet-400 dark:focus:ring-violet-500 outline-none"
                        />
                        <div className="flex justify-end mt-5 space-x-4">
                          <DialogClose asChild>
                            <button
                              className="px-4 py-2 text-sm font-medium text-gray-500 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                              //   onClick={handleCloseDialog}
                            >
                              Cancel
                            </button>
                          </DialogClose>

                          <DialogClose asChild>
                            <button
                              className="px-4 py-2 text-sm font-medium text-white bg-violet-500 hover:bg-violet-600 rounded"
                              onClick={handleSaveTodo}
                            >
                              Save
                            </button>
                          </DialogClose>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <button
                    className="text-[#25273c] dark:text-[#fff] hidden group-hover:block"
                    onClick={() => {
                      handleDeleteTodo(index);
                    }}
                  >
                    <Cross2Icon className="w-5 h-5 text-slate-500 dark:text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>{" "}
      {/* todos status */}
      {todos.length > 0 ? (
        <div className="flex justify-between px-6 py-4 border-t-[.2px] shadow border-t-slate-200 dark:border-t-slate-600 rounded-b-md bg-white dark:bg-[#25273c]">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            {todos.length - markedTodos.length} items left
          </p>
          <div className="flex items-center gap-3">
            <button
              className="text-sm text-slate-500 dark:text-slate-500"
              onClick={handleActiveTodos}
            >
              Active
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            {markedTodos.length} items completed
          </p>
        </div>
      ) : (
        <div className="flex justify-between items-center h-full w-full mt-16">
          <p className="text-sm mx-auto text-slate-500 dark:text-slate-600 text-center ">
            No todos yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoList;
