'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove
} from '@dnd-kit/sortable';
import Column from '@/components/Column';

export default function HomePage() {
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'To Do', tasks: ['Task 1', 'Task 2'] },
    { id: 'inprogress', title: 'In Progress', tasks: ['Task 3'] },
    { id: 'done', title: 'Done', tasks: ['Task 4'] },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const [sourceColumnId, sourceTask] = active.id.split(':');
    const [targetColumnId] = over.id.split(':');

    if (sourceColumnId === targetColumnId) {
      setColumns((cols) =>
        cols.map((col) =>
          col.id !== sourceColumnId
            ? col
            : {
                ...col,
                tasks: arrayMove(
                  col.tasks,
                  col.tasks.indexOf(sourceTask),
                  col.tasks.indexOf(over.id.split(':')[1])
                ),
              }
        )
      );
    } else {
      setColumns((cols) => {
        const sourceCol = cols.find((col) => col.id === sourceColumnId)!;
        const targetCol = cols.find((col) => col.id === targetColumnId)!;

        const oldIndex = sourceCol.tasks.indexOf(sourceTask);
        const newSourceTasks = [...sourceCol.tasks];
        newSourceTasks.splice(oldIndex, 1);

        const newTargetTasks = [...targetCol.tasks];
        newTargetTasks.unshift(sourceTask);

        return cols.map((col) => {
          if (col.id === sourceColumnId) return { ...col, tasks: newSourceTasks };
          if (col.id === targetColumnId) return { ...col, tasks: newTargetTasks };
          return col;
        });
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <main className="flex gap-6 p-6 overflow-x-auto bg-gray-100 min-h-screen">
        {columns.map((col) => (
          <Column key={col.id} id={col.id} title={col.title} tasks={col.tasks} />
        ))}
      </main>
    </DndContext>
  );
}
