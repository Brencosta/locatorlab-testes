"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { Button } from "@/components/ui/button";

export function TaskCreateButton({
  testId = "task-create-button",
}: {
  testId?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} data-testid={testId}>
        <Plus aria-hidden="true" />
        Nova tarefa
      </Button>
      <TaskFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
