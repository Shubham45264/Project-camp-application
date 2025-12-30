
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { Task } from "./TaskItem";
import { createSubTask, deleteSubTask, updateSubTaskStatus } from "@/services/task.api";
import axios from "axios";

// Copying manual fetch for getTaskById to avoid importing from service if it's not exported nicely or just direct use
// Actually I can import the service.
// check if getTaskById is exported from task.api.ts... 
// It was not present in the original task.api.ts view! I only saw list/create/delete/updateStatus.
// I need to ADD getTaskById to task.api.ts first!

interface Subtask {
    _id: string;
    title: string;
    isCompleted: boolean;
}

interface TaskDetail extends Task {
    subtasks: Subtask[];
    description?: string;
    assignedTo?: any;
}

interface TaskDetailModalProps {
    taskId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function TaskDetailModal({ taskId, isOpen, onClose }: TaskDetailModalProps) {
    const [task, setTask] = useState<TaskDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [subtaskTitle, setSubtaskTitle] = useState("");
    const [addingSubtask, setAddingSubtask] = useState(false);

    useEffect(() => {
        if (isOpen && taskId) {
            fetchTaskDetails();
        } else {
            setTask(null);
        }
    }, [isOpen, taskId]);

    const fetchTaskDetails = async () => {
        if (!taskId) return;
        setLoading(true);
        try {
            // Using direct fetch here since I might have missed adding it to api service
            const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${taskId}`, {
                credentials: "include"
            });
            const data = await response.json();
            setTask(data.data);
        } catch (error) {
            console.error("Failed to load task details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubtask = async () => {
        if (!subtaskTitle.trim() || !taskId) return;
        setAddingSubtask(true);
        try {
            await createSubTask(taskId, subtaskTitle);
            setSubtaskTitle("");
            fetchTaskDetails(); // Refresh to show new subtask
        } catch (e) {
            console.error(e);
        } finally {
            setAddingSubtask(false);
        }
    };

    const handleToggleSubtask = async (subtaskId: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setTask(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    subtasks: prev.subtasks.map(s => s._id === subtaskId ? { ...s, isCompleted: !currentStatus } : s)
                };
            });

            await updateSubTaskStatus(subtaskId, !currentStatus);
        } catch (e) {
            console.error(e);
            fetchTaskDetails(); // Revert on error
        }
    };

    const handleDeleteSubtask = async (subtaskId: string) => {
        try {
            setTask(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    subtasks: prev.subtasks.filter(s => s._id !== subtaskId)
                };
            });
            await deleteSubTask(subtaskId);
        } catch (e) {
            console.error(e);
            fetchTaskDetails();
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{loading ? "Loading..." : task?.title}</DialogTitle>
                    {task?.description && (
                        <DialogDescription>{task.description}</DialogDescription>
                    )}
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                ) : (
                    <div className="space-y-6 mt-4">
                        {/* Subtasks Section */}
                        <div>
                            <h3 className="text-sm font-medium mb-3">Subtasks</h3>

                            <div className="space-y-2 mb-4">
                                {task?.subtasks?.map(subtask => (
                                    <div key={subtask._id} className="flex items-center group justify-between p-2 rounded-md hover:bg-muted/50 border border-transparent hover:border-border/50">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={subtask._id}
                                                checked={subtask.isCompleted}
                                                onCheckedChange={() => handleToggleSubtask(subtask._id, subtask.isCompleted)}
                                            />
                                            <label
                                                htmlFor={subtask._id}
                                                className={`text-sm ${subtask.isCompleted ? 'line-through text-muted-foreground' : ''}`}
                                            >
                                                {subtask.title}
                                            </label>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDeleteSubtask(subtask._id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                                {task?.subtasks?.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic pl-2">No subtasks yet.</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a subtask..."
                                    value={subtaskTitle}
                                    onChange={(e) => setSubtaskTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                                    className="bg-background text-foreground"
                                />
                                <Button size="icon" onClick={handleAddSubtask} disabled={addingSubtask}>
                                    {addingSubtask ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
