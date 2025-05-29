import { initDb } from "./db";
import TaskModel from "./task";

export async function init() {
    try {
        await initDb();
        TaskModel.createTable();
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    }
}