"use client"

import EmptyState from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import Spinner from '@/components/common/Spinner'
import FlashcardSetCard from '@/components/flashcards/FlashcardSetCard'
import { FlashcardSet } from '@/interfaces/flashcards/allFlashcards'
import { getAllFlashcardSets } from '@/services/flashcardService'
import { useQuery } from '@tanstack/react-query'

export default function FlashcardsList() {
    const { data, isLoading } = useQuery<FlashcardSet[]>({
        queryKey: ["flashcard-sets"],
        queryFn: async () => {
            const res = await getAllFlashcardSets()
            return res.data
        }
    })

    const renderContent = () => {
        if (isLoading) {
            return <Spinner />
        }

        if (data?.length === 0) {
            return (
                <EmptyState
                    title="No Flashcard Sets Found"
                    description="You haven't generated any flashcards yet. Go to a document to create your first set."
                />
            )
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data?.map((set: FlashcardSet) => (
                    <FlashcardSetCard key={set._id} flashcardSet={set} />
                ))}
            </div>
        )
    }

    return (
        <div>
            <PageHeader title="All Flashcard Sets" />
            {renderContent()}
        </div>
    )
}
