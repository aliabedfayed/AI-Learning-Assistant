"use client"
import { FlashcardSet, Flashcards } from '@/interfaces/flashcards/flashcards';
import { generateFlashcards } from '@/services/aiService';
import { deleteFlashcardSet, getFlashcardsForDocument, reviewFlashcard, toggleStar } from '@/services/flashcardService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react'
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';
import { ArrowLeft, Brain, ChevronLeft, ChevronRight, Plus, Sparkles, Trash2 } from 'lucide-react';
import FlashCard from './FlashCard';
import moment from 'moment';
import Modal from '../common/Modal';

export default function FlashcardManager({ documentId }: { documentId: string }) {
    const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null)
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
    const [setToDelete, setSetToDelete] = useState<FlashcardSet | null>(null)

    const { data, isLoading, refetch } = useQuery<Flashcards>({
        queryKey: ["flashcards", documentId],
        queryFn: () => getFlashcardsForDocument(documentId),
        enabled: !!documentId
    })

    const generateMutation = useMutation({
        mutationFn: () => generateFlashcards(documentId),
        onSuccess: () => {
            toast.success("Flashcards generated successfully!")
            setSelectedSet(null)
            setCurrentCardIndex(0)
            refetch()
        }, onError: (err) => toast.error(err.message || "Failed to generate flashcards.")
    })

    const reviewMutation = useMutation({
        mutationFn: ({ cardId, index }: { cardId: string, index: number }) => reviewFlashcard(cardId, index),
        onSuccess: () => toast.success("Flashcard reviewed!"),
        onError: () => toast.error("Failed to review flashcard.")
    })

    const toggleStarMutation = useMutation({
        mutationFn: (cardId: string) => toggleStar(cardId),
        onSuccess: (_, cardId) => {
            if (!selectedSet) return

            setSelectedSet((prev) => {
                if (!prev) return prev

                return {
                    ...prev,
                    cards: prev.cards.map((card) =>
                        card._id === cardId
                            ? { ...card, isStarred: !card.isStarred }
                            : card
                    )
                }
            })

            toast.success("Flashcard starred status updated!")
        },
        onError: () => toast.error("Failed to update star status."),
    })

    const deleteMutation = useMutation({
        mutationFn: (setId: string) => deleteFlashcardSet(setId),
        onSuccess: () => {
            toast.success("Flashcard set deleted successfully!")
            setIsDeleteModalOpen(false)
            setSetToDelete(null)
            setSelectedSet(null)
            setCurrentCardIndex(0)
            refetch()
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to delete flashcard set.")
        }
    })

    const handleNextCard = () => {
        if (!selectedSet) return

        const card = selectedSet.cards[currentCardIndex]
        reviewMutation.mutate({ cardId: card._id, index: currentCardIndex })

        setCurrentCardIndex(
            (prev) => (prev + 1) % selectedSet.cards.length
        )
    }

    const handlePrevCard = () => {
        if (!selectedSet) return

        const card = selectedSet.cards[currentCardIndex]
        reviewMutation.mutate({ cardId: card._id, index: currentCardIndex })

        setCurrentCardIndex(
            (prev) => (prev - 1 + selectedSet.cards.length) % selectedSet.cards.length
        )
    }

    const handleSelectSet = (set: FlashcardSet) => {
        setSelectedSet(set)
        setCurrentCardIndex(0)
    }

    const handleDeleteRequest = (e: React.MouseEvent, set: FlashcardSet) => {
        e.stopPropagation()
        setSetToDelete(set)
        setIsDeleteModalOpen(true)
    }

    const renderFlashcardViewer = () => {
        if (!selectedSet) return null
        const currentCard = selectedSet.cards[currentCardIndex]

        return (
            <div className="space-y-8">
                <button onClick={() => setSelectedSet(null)}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors duration-200"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" strokeWidth={2} />
                    Back to Sets
                </button>

                <div className="flex flex-col items-center space-y-8">
                    <div className="w-full max-w-2xl">
                        <FlashCard flashcard={currentCard} onToggleStar={toggleStarMutation.mutate} />
                    </div>

                    <div className="flex items-center gap-6">
                        <button onClick={handlePrevCard} disabled={!selectedSet || selectedSet.cards.length <= 1}
                            className="group flex items-center gap-2 px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-100">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200"
                                strokeWidth={2.5} />
                            Previous
                        </button>

                        <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-sm font-semibold text-slate-700">
                                {currentCardIndex + 1}{" "}
                                <span className="text-slate-400 font-normal">/</span>{" "}
                                {selectedSet?.cards.length}
                            </span>
                        </div>

                        <button onClick={handleNextCard} disabled={!selectedSet || selectedSet.cards.length <= 1}
                            className="group flex items-center gap-2 px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-100">
                            Next
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
                                strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const renderSetList = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Spinner />
                </div>
            )
        }

        if (data?.data?.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 mb-6">
                        <Brain className="w-8 h-8 text-emerald-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        No Flashcards Yet
                    </h3>
                    <p className="text-sm text-slate-500 mb-8 text-center max-w-sm">
                        Generate flashcards from your document to start learning and reinforce your knowledge.
                    </p>
                    <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}
                        className="group inline-flex items-center gap-2 px-6 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100">
                        {generateMutation.isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" strokeWidth={2} />
                                Generate Flashcards
                            </>
                        )}
                    </button>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            Your Flashcard Sets
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            {data?.data?.length}{" "}
                            {data?.data?.length === 1 ? "set" : "sets"} available
                        </p>
                    </div>
                    <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}
                        className="group inline-flex items-center gap-2 px-5 h-11 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100">
                        {generateMutation.isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" strokeWidth={2.5} />
                                Generate New Set
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.data?.map((set) => (
                        <div key={set._id} onClick={() => handleSelectSet(set)}
                            className="group relative bg-white/80 backdrop-blur-xl border-2 border-slate-200 hover:border-emerald-300 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10"
                        >
                            <button onClick={(e) => handleDeleteRequest(e, set)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" strokeWidth={2} />
                            </button>

                            <div className="space-y-4">
                                <div
                                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100">
                                    <Brain className="w-6 h-6 text-emerald-600" strokeWidth={2} />
                                </div>

                                <div>
                                    <h4 className="text-base font-semibold text-slate-900 mb-1">
                                        Flashcard Set
                                    </h4>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Created {moment(set.createdAt).format("MMM D, YYYY")}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                    <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                                        <span className="text-sm font-semibold text-emerald-700">
                                            {set.cards.length}{" "}
                                            {set.cards.length === 1 ? "card" : "cards"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            <div
                className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
                {selectedSet ? renderFlashcardViewer() : renderSetList()}
            </div>

            <Modal isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Flashcard Set?"
            >
                <div className="space-y-6">
                    <p className="text-sm text-slate-600">
                        Are you sure you want to delete this flashcard set? This action cannot be undone and all cards will be permanently removed.
                    </p>
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleteMutation.isPending}
                            className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button onClick={() =>
                            setToDelete &&
                            deleteMutation.mutate(setToDelete._id)
                        }
                            disabled={deleteMutation.isPending}
                            className="px-5 h-11 bg-linear-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100">
                            {deleteMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Deleting...
                                </span>
                            ) : (
                                "Delete Set"
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </ >
    )
}
