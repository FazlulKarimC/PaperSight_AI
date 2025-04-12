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
                <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                </Button>
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