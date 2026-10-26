---
title: Using Mylyn 3.23 with Eclipse ADT
date: 2022-09-26
summary: Mylyn is a task management system that is integrated in the Eclipse tooling. As a tool it is highly recommended for the purpose of automatic organisation of Eclipse ADT workspace.
tags: [code, sap, tutorial]
---

**Mylyn** is a task management system that is integrated in the Eclipse tooling. As a tool it is highly recommended for the purpose of automatic organisation of Eclipse ADT workspace.

Install the plugin via Eclipse Marketplace: input “_mylyn_” as search term and then choose **Mylyn 3.23** (currently latest version, it’s not the first result so scroll down a bit).

![](mylyn01-1536x960.png "Screenshot 1 – Task List icon.")

After restarting Eclipse access the Task List via _Window / Show View / Task List_, or via shortcut to the right (Screenshot 1).

![](mylyn02-1536x960.png "Screenshot 2 – Create a new task.")

Create a new task as either a local task or a task connected to one of the supported issue tracking tools such as JIRA – NB, I have only tested the local task functionality so far. Fill out the requested fields and save the task (Screenshot 2).

![](mylyn03-1536x960.png "Screenshot 3 – Activate task.")

Now, access the Task List again, right click on one of the tasks and select Activate (Screenshot 3). Activating the task for the first time will close the ABAP project in the Project Explorer to the left.

The purpose of **Mylyn** is automatically monitoring the files the developer accesses during work on a particular task so that once focus switches to that task again all unnecessary data stays hidden. Any files accessed while a task is active will be marked as “important” for the task and will thus be revealed any time the task is accessed.

Using the **+** sign button next to the project name in Project Explorer will reveal all the project files. Closing and opening the project again will once more reveal only the files **Mylyn** recognised as important for the active task.
