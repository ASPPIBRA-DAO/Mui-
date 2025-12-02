
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  createdAt: text("created_at"),
});

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id").notNull().references(() => users.id),
  createdAt: text("created_at"),
});

export const organizationMembers = sqliteTable("organization_members", {
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  userId: text("user_id").notNull().references(() => users.id),
  role: text("role", { enum: ["admin", "member"] }).notNull(),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  createdAt: text("created_at"),
});

export const projectMembers = sqliteTable("project_members", {
  projectId: text("project_id").notNull().references(() => projects.id),
  userId: text("user_id").notNull().references(() => users.id),
});

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["todo", "in_progress", "done", "canceled"] }).notNull(),
  priority: text("priority", { enum: ["low", "medium", "high"] }).notNull(),
  projectId: text("project_id").notNull().references(() => projects.id),
  creatorId: text("creator_id").notNull().references(() => users.id),
  dueDate: text("due_date"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const taskAssignees = sqliteTable("task_assignees", {
  taskId: text("task_id").notNull().references(() => tasks.id),
  userId: text("user_id").notNull().references(() => users.id),
});

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  taskId: text("task_id").notNull().references(() => tasks.id),
  userId: text("user_id").notNull().references(() => users.id),
  createdAt: text("created_at"),
});

export const attachments = sqliteTable("attachments", {
  id: text("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  taskId: text("task_id").notNull().references(() => tasks.id),
  uploadedById: text("uploaded_by_id").notNull().references(() => users.id),
  createdAt: text("created_at"),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: text("created_at"),
});

export const userSettings = sqliteTable("user_settings", {
  userId: text("user_id").primaryKey().references(() => users.id),
  theme: text("theme").default("light"),
  notificationsEnabled: integer("notifications_enabled", { mode: "boolean" }).default(true),
});
