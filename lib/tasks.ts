
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
  console.log("========== CREATE TASK START ==========");

  console.log("API URL:", API_URL);
  console.log("Task being submitted:", task);
  console.log("JWT Token exists:", !!getToken());

  try {
    console.log("Sending POST request...");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(task),
    });

    console.log("========== SERVER RESPONSE ==========");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("Response OK:", response.ok);

    // Read the response body
    const responseText = await response.text();

    console.log("Raw server response:", responseText);

    let data: any = {};

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      console.error("Server returned invalid JSON:", responseText);
    }

    console.log("Parsed server response:", data);

    if (!response.ok) {
      console.error("CREATE TASK FAILED:", {
        status: response.status,
        statusText: response.statusText,
        response: data,
      });

      throw new Error(
        data.message ||
        data.error ||
        `Request failed with status ${response.status}`
      );
    }

    console.log("TASK CREATED SUCCESSFULLY:", data);
    console.log("========== CREATE TASK END ==========");

    return data.task;

  } catch (error) {
    console.error("========== CREATE TASK ERROR ==========");
    console.error("Error:", error);
    console.error("========== CREATE TASK END ==========");

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
