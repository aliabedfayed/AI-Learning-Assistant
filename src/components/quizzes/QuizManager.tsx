import { Quiz } from '@/interfaces/ai/generateQuiz'
import { generateQuiz } from '@/services/aiService'
import { deleteQuiz, getQuizzesForDocument } from '@/services/quizService'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../common/Button'
import { Plus } from 'lucide-react'
import Modal from '../common/Modal'
import Spinner from '../common/Spinner'
import QuizCard from './QuizCard'
import EmptyState from '../common/EmptyState'
import * as Yup from "yup"
import { useFormik } from 'formik'

export default function QuizManager({ documentId }: { documentId: string }) {
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)

    const { data, isLoading, refetch } = useQuery<Quiz[]>({
        queryKey: ["quizzes", documentId],
        queryFn: async () => {
            const res = await getQuizzesForDocument(documentId)
            return res.data
        },
        enabled: !!documentId
    })

    const generateMutation = useMutation({
        mutationFn: (values: { numQuestions: number }) => generateQuiz(documentId, values),
        onSuccess: () => {
            toast.success("Quiz generated successfully!")
            formik.resetForm()
            setIsGenerateModalOpen(false)
            refetch()
        },
        onError: (err: any) =>
            toast.error(err?.message || "Failed to generate quiz.")
    })

    const handleDeleteRequest = (quiz: Quiz) => {
        setSelectedQuiz(quiz)
        setIsDeleteModalOpen(true)
    }

    const deleteMutation = useMutation({
        mutationFn: (quizId: string) => deleteQuiz(quizId),
        onSuccess: () => {
            toast.success("Quiz deleted successfully!")
            setIsDeleteModalOpen(false)
            setSelectedQuiz(null)
            refetch()
        },
        onError: (err: any) =>
            toast.error(err?.message || "Failed to delete quiz.")
    })

    const generateQuizSchema = Yup.object({
        numQuestions: Yup.number()
            .min(1, "Minimum 1 question")
            .required("Number of questions is required")
    })

    const formik = useFormik({
        initialValues: {
            numQuestions: 5,
        },
        validationSchema: generateQuizSchema,
        validateOnMount: true,
        onSubmit: (values) => {
            generateMutation.mutate(values);
        },
    });

    function renderQuizContent() {
        if (isLoading) {
            return <Spinner />
        }

        if (!data || data.length === 0) {
            return (
                <EmptyState
                    title="No Quizzes Yet"
                    description="Generate a quiz from your document to test your knowledge."
                />
            )
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data?.map((quiz) => (
                    <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
                ))}
            </div>
        )
    }
    return (
        <>
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
                <div className="flex justify-end gap-2 mb-4">
                    <Button onClick={() => setIsGenerateModalOpen(true)}>
                        <Plus size={16} />
                        Generate Quiz
                    </Button>
                </div>

                {renderQuizContent()}

                <Modal
                    isOpen={isGenerateModalOpen}
                    onClose={() => setIsGenerateModalOpen(false)}
                    title="Generate New Quiz"
                >
                    <form onSubmit={formik.handleSubmit}
                        className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                Number of Questions
                            </label>
                            <input
                                type="number"
                                name="numQuestions"
                                value={formik.values.numQuestions}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full h-9 px-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent"
                            />
                            {formik.touched.numQuestions && formik.errors.numQuestions && (
                                <p className="mt-1 text-xs text-red-500">
                                    {formik.errors.numQuestions}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsGenerateModalOpen(false)}
                                disabled={generateMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={generateMutation.isPending || !formik.isValid}>
                                {generateMutation.isPending ? 'Generating...' : 'Generate'}
                            </Button>
                        </div>
                    </form>
                </Modal>

                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Confirm Delete Quiz"
                >
                    <div className="space-y-4">
                        <p className="text-sm text-neutral-600">
                            Are you sure you want to delete the quiz: <span className="font-semibold text-neutral-900">{selectedQuiz?.title || 'this quiz'}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={deleteMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() =>
                                    selectedQuiz &&
                                    deleteMutation.mutate(selectedQuiz._id)
                                }
                                disabled={deleteMutation.isPending}
                                className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500"
                            >
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div >
        </>
    )
}
