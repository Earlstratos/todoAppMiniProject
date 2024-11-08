const router = require("express").Router();
const User = require("../Modals/user");
const List = require("../Modals/list");

// Create a new task
router.post("/addTask", async (req, res) => {
  const { title, body, id, dueDate } = req.body;

  try {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new list entry
    const list = new List({ title, body, dueDate, user: existingUser._id }); // Ensure we store the user's ID
    await list.save();

    // Associate the task with the user
    existingUser.list.push(list._id); // Push the task ID into the user's list
    await existingUser.save(); // Await the save to ensure it's done before responding

    return res.status(201).json({ message: "Task added successfully", list });
  } catch (error) {
    console.error("Error during add task:", error);
    return res.status(500).json({ message: "Error adding task" });
  }
});

// Update a task
router.put("/updateTask/:id", async (req, res) => {
  const { title, body, dueDate } = req.body; // Assuming you also want to update dueDate

  try {
    const updatedList = await List.findByIdAndUpdate(
      req.params.id,
      { title, body, dueDate },
      { new: true } // Return the updated document
    );

    if (!updatedList) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task updated", updatedList });
  } catch (error) {
    console.error("Error during updating task:", error);
    return res.status(500).json({ message: "Error updating task" });
  }
});

// Delete a task
router.delete("/deleteTask/:id", async (req, res) => {
  const { id: userId } = req.body;

  try {
    const existingUser = await User.findByIdAndUpdate(userId, {
      $pull: { list: req.params.id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedTask = await List.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error during deleting task:", error);
    return res.status(500).json({ message: "Error deleting task" });
  }
});

// Get tasks for a user
router.get("/getTask/:id", async (req, res) => {
  try {
    const list = await List.find({ user: req.params.id }).sort({ createdAt: -1 });
    if (list.length === 0) {
      return res.status(200).json({ message: "No Tasks" });
    }
    return res.status(200).json({ list });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Error fetching tasks" });
  }
});

module.exports = router;
