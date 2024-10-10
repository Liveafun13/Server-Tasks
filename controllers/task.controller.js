import { db } from '../lib/dbConnect.js';
import { ObjectId } from 'mongodb';

const collection = db.collection('tasks');

// Получить задачи пользователя
export const getTaskByUser = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 4;

    const query = { owner: new ObjectId(req.params.id) };
    const { status, orderBy } = req.query;

    if (status) {
      query['status'] = status;
    }

    const sort = orderBy ? { [orderBy]: 1 } : {};
    
    const tasks = await collection
      .find(query)
      .sort(sort)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .toArray();
      
    const taskCount = await collection.count(query);
    res.status(200).json({ tasks, taskCount });

  } catch (error) {
    next({ status: 500, error });
  }
};


// Получить одну задачу по ID
export const getTask = async (req, res, next) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const task = await collection.findOne(query);
    if (!task) {
      return next({ status: 404, message: 'Task not found!' });
    }
    res.status(200).json(task);
  } catch (error) {
    next({ status: 500, error });
  }
};

// Создать новую задачу
export const createTask = async (req, res, next) => {
  try {
    const newTask = {
      ...req.body,
      owner: new ObjectId(req.user.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await collection.insertOne(newTask);

    if (result.insertedId) {
      res.status(200).json({ taskId: result.insertedId, message: 'Задача создана' });
    } else {
      next({ status: 500, message: 'Failed to create task' });
    }
  } catch (error) {
    next({ status: 500, error });
  }
};


// Обновить задачу
export const updateTask = async (req, res, next) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const data = {
      $set: {
        ...req.body,
        owner: new ObjectId(req.body.owner),
        updatedAt: new Date().toISOString(),
      }
    };
    const options = {
      ReturnDocument: 'after',
    };
    const updatedTask = await collection.findOneAndUpdate(query, data,
      options);
    res.status(200).json(updatedTask);
  } catch (error) {
    next({ status: 500, error });
  }
};


// Удалить задачу
export const deleteTask = async (req, res, next) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    await collection.deleteOne(query);
    res.status(200).json('Задача была удалена!!!');
  } catch (error) {
    next({ status: 500, error });
  }
};
