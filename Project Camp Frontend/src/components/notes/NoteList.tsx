
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { noteApi } from "../../services/note.api";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";

export function NoteList() {
    const { projectId } = useParams<{ projectId: string }>();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCreating, setIsCreating] = useState(false);
    const [newNoteContent, setNewNoteContent] = useState("");
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    const { data: notes, isLoading } = useQuery({
        queryKey: ["notes", projectId],
        queryFn: () => noteApi.getProjectNotes(projectId!),
        enabled: !!projectId,
    });

    const createMutation = useMutation({
        mutationFn: (content: string) => noteApi.createNote(projectId!, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes", projectId] });
            setNewNoteContent("");
            setIsCreating(false);
            toast({ title: "Success", description: "Note created successfully" });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to create note",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ noteId, content }: { noteId: string; content: string }) =>
            noteApi.updateNote(projectId!, noteId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes", projectId] });
            setEditingNoteId(null);
            toast({ title: "Success", description: "Note updated successfully" });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to update note",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (noteId: string) => noteApi.deleteNote(projectId!, noteId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes", projectId] });
            toast({ title: "Success", description: "Note deleted successfully" });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to delete note",
            });
        },
    });

    const handleCreate = () => {
        if (!newNoteContent.trim()) return;
        createMutation.mutate(newNoteContent);
    };

    const handleUpdate = (noteId: string) => {
        if (!editContent.trim()) return;
        updateMutation.mutate({ noteId, content: editContent });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Project Notes</h2>
                <Button onClick={() => setIsCreating(!isCreating)} variant={isCreating ? "secondary" : "default"}>
                    {isCreating ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Add Note</>}
                </Button>
            </div>

            {isCreating && (
                <Card className="border-primary/20 bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">New Note</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Write something..."
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button onClick={handleCreate} disabled={createMutation.isPending}>
                            {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Note
                        </Button>
                    </CardFooter>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notes?.data?.map((note: any) => (
                    <Card key={note._id} className="relative group hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={note.createdBy?.avatar} />
                                <AvatarFallback>{note.createdBy?.fullName?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium leading-none">{note.createdBy?.fullName}</span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {editingNoteId === note._id ? (
                                <div className="space-y-4">
                                    <Textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setEditingNoteId(null)}>Cancel</Button>
                                        <Button size="sm" onClick={() => handleUpdate(note._id)} disabled={updateMutation.isPending}>Save</Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                            )}
                        </CardContent>

                        {!editingNoteId && (
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    onClick={() => {
                                        setEditingNoteId(note._id);
                                        setEditContent(note.content);
                                    }}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => deleteMutation.mutate(note._id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {notes?.data?.length === 0 && !isCreating && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No notes found for this project.</p>
                </div>
            )}
        </div>
    );
}
