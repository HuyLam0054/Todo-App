'use client';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

export default function Column({
  id,
  title,
  tasks,
}: {
  id: string;
  title: string;
  tasks: string[];
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="bg-white shadow-md rounded-lg w-64 p-4 flex-shrink-0">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div ref={setNodeRef} className="flex flex-col gap-3 min-h-10">
        <SortableContext
          id={id}
          items={tasks.map((task) => `${id}:${task}`)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task} id={`${id}:${task}`} content={task} />
            ))
          ) : (
            <div className="text-gray-400 text-center py-2 border border-dashed border-gray-300 rounded">
              Drop here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
