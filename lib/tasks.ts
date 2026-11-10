
export type TaskStep = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  deadline: string;
  steps: TaskStep[];
  createdAt: string;
};

export type TaskInput = {
  title: string;
  deadline: string;
  steps: TaskStep[];
};

const API_URL = "http://localhost:8080/api/tasks";

// GET ALL TASKS
export async function getTasks(): Promise<Task[]> {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to retrieve tasks");
    }

    return await response.json();
  } catch (error) {
    console.error("Get tasks error:", error);
    throw error;
  }
}

// CREATE TASK
export async function createTask(task: TaskInput): Promise<Task> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    const data = await response.json();

    return data.task;
  } catch (error) {
    console.error("Create task error:", error);
    throw error;
  }
}

// UPDATE TASK
export async function updateTask(
  id: string,
  task: TaskInput
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }
  } catch (error) {
    console.error("Update task error:", error);
    throw error;
  }
}

// DELETE TASK
export async function deleteTask(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
  } catch (error) {
    console.error("Delete task error:", error);
    throw error;
  }
}

// GET JWT TOKEN
function getToken(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("token") || "";
}
