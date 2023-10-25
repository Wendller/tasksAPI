import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-params.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "missing required: [title, description]",
          })
        );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date(),
        updated_at: null,
        completed_at: null,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const search = req.query?.search
        ? { title: req.query.search, description: req.query.search }
        : null;

      const tasks = database.select("tasks", search);

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const search = id ? { id: id } : null;
      const selectedTask = database.select("tasks", search)[0];

      if (!selectedTask) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "task not found" }));
      }

      const title = req.body?.title || null;
      const description = req.body?.description || null;

      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "missing required: [title, description]",
          })
        );
      }

      const updateBody = {
        title: title ?? selectedTask.title,
        description: description ?? selectedTask.description,
        updated_at: new Date(),
      };

      database.update("tasks", id, updateBody);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const search = id ? { id: id } : null;
      const selectedTask = database.select("tasks", search)[0];

      if (!selectedTask) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "task not found" }));
      }

      database.delete("tasks", id);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const search = id ? { id: id } : null;
      const selectedTask = database.select("tasks", search)[0];

      if (!selectedTask) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "task not found" }));
      }

      const updateBody = {
        completed_at: new Date(),
      };

      database.update("tasks", id, updateBody);

      return res.writeHead(204).end();
    },
  },
];
