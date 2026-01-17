import axiosInstance from '../utilities/axiosInstance';
import { API_PATHS } from '../utilities/apiPaths';
import { Documents } from '@/interfaces/documents/document';
import { UploadDocument } from '@/interfaces/documents/uploadDocuments';
import { DeleteDocument } from '@/interfaces/documents/deleteDocument';
import { DocumentById } from '@/interfaces/documents/documentById';

export const getDocuments = async (): Promise<Documents> => {
    const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
    return response.data;
};

export const uploadDocument = async (formData: FormData): Promise<UploadDocument> => {
    const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD,
        formData
    );
    return response.data;
};

export const deleteDocument = async (id: string): Promise<DeleteDocument> => {
    const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id));
    return response.data;
};

export const getDocumentById = async (id: string): Promise<DocumentById> => {
    const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id));
    return response.data;
};