import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteSummaryAction } from "@/actions/summary"
import { toast } from "sonner"

interface DeleteSummaryProps {
    summaryId: string;
    onDelete: (id: string) => void;
}

export const DeleteSummary = ({ summaryId, onDelete }: DeleteSummaryProps) => {
    const handleDelete = async () => {
        try {
            const result = await deleteSummaryAction(summaryId)
            if (result?.success) {
                onDelete(summaryId) // Update parent state
                toast.success('Summary Deleted', {
                    description: 'The summary has been permanently removed.'
                })
            } else {
                throw new Error(result?.message || 'Failed to delete summary')
            }
        } catch (error) {
            toast.error('Delete Failed', {
                description: error instanceof Error ? error.message : 'An unexpected error occurred'
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="size-9 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-all duration-200 flex items-center justify-center hover:scale-105" title="Delete summary">
                    <Trash2 className="h-4 w-4 text-destructive" />
                </button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        This action cannot be undone. This will permanently delete the summary
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}