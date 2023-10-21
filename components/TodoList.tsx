import { useState } from "react";
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

  const handleMarkTodo = (index: number) => {
    if (markedTodos.includes(index)) {
      // If the todo is already marked, remove it from the array
      setMarkedTodos((prevMarkedTodos) =>
        prevMarkedTodos.filter((todoIndex) => todoIndex !== index)
      );
    } else {
      // If the todo is not marked, add it to the array
      setMarkedTodos((prevMarkedTodos) => [...prevMarkedTodos, index]);
    }
  };
  const handleAddTodo = (todo: string) => {
    // setIsMarked(false);
    setTodos((prevTodos) => [...prevTodos, todo]);
  };

  const handleDeleteTodo = (index: number) => {
    setTodos((prevTodos) =>
      prevTodos.filter((todo, todoIndex) => todoIndex !== index)
    );
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
        return updatedTodos;
      });
      handleCloseDialog();
    }
  };

  return (
    <div className="mx-5 max-w-md md:mx-auto md:max-w-2xl mt-10">
      {/* todolist input */}
      <div className="focus-within:ring-1 focus-within:ring-violet-400 dark:focus-within:ring-violet-500 w-full h-14 bg-[#fff]/75  dark:bg-[#25273c]/75 backdrop-blur-3xl rounded">
        {/* custom check box */}
        <div className="flex h-full m-5">
          <div className="flex items-center my-auto bg-slate-700 hover:bg-gradient-to-r from-blue-400 to-violet-400  h-7 w-7 rounded-full overflow-hidden p-[1.5px] cursor-pointer">
            <div className="w-full h-full rounded-full bg-[#fff] dark:bg-[#25273c]"></div>
          </div>

          <input
            type="text"
            placeholder="Create a new todo..."
            className="w-full h-full bg-transparent outline-none px-3 text-[#25273c] dark:text-[#fff] caret-violet-400"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddTodo(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
          />
        </div>
      </div>
      {/*  todos  */}

      <div className="mt-5">
        {todos.map((todo, index) => (
          <div className="">
            {" "}
            <div
              className={`group cursor-pointer flex items-center justify-between bg-[#fff] dark:bg-[#25273c] p-5  h-14 border-b ${
                index !== todos.length - 1
                  ? "border-b-1 border-b-slate-200 dark:border-b-slate-600"
                  : ""
              } ${index === 0 ? "rounded-t" : ""} ${
                index === todos.length - 1 ? "rounded-b" : ""
              }`}
              key={index}
            >
              <div className="flex items-center">
                <div
                  className={`flex items-center my-auto bg-slate-600 hover:bg-gradient-to-r from-blue-400 to-violet-400 h-7 w-7 rounded-full overflow-hidden p-[1.5px] cursor-pointer`}
                  onClick={() => handleMarkTodo(index)}
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
                  className={`ml-5 text-[#25273c] dark:text-[#fff] ${
                    markedTodos.includes(index)
                      ? "line-through dark:text-slate-500"
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
    </div>
  );
};

export default TodoList;
