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
                toast.success('Summary deleted successfully')
            } else {
                throw new Error(result?.message || 'Failed to delete summary')
            }
        } catch (error) {
            toast.error('Error deleting summary', {
                description: error instanceof Error ? error.message : 'An unexpected error occurred'
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="size-9 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors flex items-center justify-center" title="Copy summary">
                    <Trash2 className="h-4 w-4 text-red-700"/>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
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