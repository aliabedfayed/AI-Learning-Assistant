"use client"

import Button from '@/components/common/Button'
import EmptyState from '@/components/common/EmptyState'
import Modal from '@/components/common/Modal'
import PageHeader from '@/components/common/PageHeader'
import Spinner from '@/components/common/Spinner'
import FlashCard from '@/components/flashcards/FlashCard'
import { generateFlashcards } from '@/services/aiService'
import { deleteFlashcardSet, getFlashcardsForDocument, reviewFlashcard, toggleStar } from '@/services/flashcardService'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Flashcards() {
    const { id } = useParams<{ id: string }>()
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["flashcards", id],
        queryFn: () => getFlashcardsForDocument(id),
        enabled: !!id,
    })

    const flashcardSet = data?.data?.[0]
    const flashcards = flashcardSet?.cards ?? []

    const generateFlashcardsMutation = useMutation({
        mutationFn: () => generateFlashcards(id),
        onSuccess: async () => {
            toast.success("Flashcards generated successfully!")
            await refetch()
        },
        onError: () => toast.error("Failed to generate flashcards"),
    })

    const reviewFlashcardMutation = useMutation({
        mutationFn: (cardId: string) => reviewFlashcard(cardId),
        onSuccess: () => toast.success("Flashcard reviewed!"),
        onError: () => toast.error("Failed to review flashcard.")
    })

    const toggleStarMutation = useMutation({
        mutationFn: (cardId: string) => toggleStar(cardId),
        onSuccess: async () => {
            toast.success("Flashcard starred status updated!")
            await refetch()
        },
        onError: () => toast.error("Failed to update star status.")
    })

    const deleteSet = useMutation({
        mutationFn: (setId: string) => deleteFlashcardSet(setId),
        onSuccess: async () => {
            toast.success("Flashcard set deleted!")
            setIsDeleteModalOpen(false)
            await refetch()
        },
        onError: (err) => toast.error(err.message || "Failed to delete flashcard set.")
    })

    const handleNextCard = () => {
        const card = flashcards[currentCardIndex]
        if (card) reviewFlashcardMutation.mutate(card._id)
        setCurrentCardIndex((prev) => (prev + 1) % flashcards.length)
    }

    const handlePrevCard = () => {
        const card = flashcards[currentCardIndex]
        if (card) reviewFlashcardMutation.mutate(card._id)
        setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    }

    const renderFlashcardContent = () => {
        if (isLoading) {
            return <Spinner />
        }

        if (flashcards.length === 0) {
            return (
                <EmptyState
                    title="No Flashcards Yet"
                    description="Generate flashcards from your document to start learning."
                />
            )
        }

        const currentCard = flashcards[currentCardIndex]

        return (
            <div className="flex flex-col items-center space-y-6">
                <div className="w-full max-w-md">
                    <FlashCard flashcard={currentCard} onToggleStar={toggleStarMutation.mutate} />
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handlePrevCard}
                        variant="secondary"
                        disabled={flashcards.length <= 1}
                    >
                        <ChevronLeft size={16} /> Previous
                    </Button>
                    <span className="text-sm text-neutral-600">
                        {currentCardIndex + 1} / {flashcards.length}
                    </span>
                    <Button
                        onClick={handleNextCard}
                        variant="secondary"
                        disabled={flashcards.length <= 1}
                    >
                        Next <ChevronRight size={16} />
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div>
                <div className="mb-4">
                    <Link
                        href={`/documents/${id}`}
                        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Document
                    </Link>
                </div>
                <PageHeader title="Flashcards">
                    <div className="flex gap-2">
                        {!isLoading &&
                            (flashcards.length > 0 ? (
                                <>
                                    <Button
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        disabled={deleteSet.isPending}
                                    >
                                        <Trash2 size={16} /> Delete Set
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => generateFlashcardsMutation.mutate()} disabled={generateFlashcardsMutation.isPending}>
                                    {generateFlashcardsMutation.isPending ? (
                                        <Spinner />
                                    ) : (
                                        <>
                                            <Plus size={16} /> Generate Flashcards
                                        </>
                                    )}
                                </Button>
                            ))}
                    </div>
                </PageHeader>

                {renderFlashcardContent()}

                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Confirm Delete Flashcard Set"
                >
                    <div className="space-y-4">
                        <p className="text-sm text-neutral-600">
                            Are you sure you want to delete all flashcards for this document?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={deleteSet.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    if (!flashcardSet) return
                                    deleteSet.mutate(flashcardSet._id)
                                }}
                                disabled={deleteSet.isPending}
                                className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500"
                            >
                                {deleteSet.isPending ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}
