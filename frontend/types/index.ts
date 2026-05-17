// types/index.ts

export interface News {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  thumbnail?: string;
  category?: string;
  author?: string;
  status: 'PUBLISHED' | 'DRAFT';
  views?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Gallery {
  id: string | number;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  isPublic: boolean;
  createdAt: string;
}

export interface PpdbRegistration {
  id: string | number;
  registrationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'ACCEPTED' | string;
  createdAt: string;
  noPendaftaran?: string;
  nisn?: string;
  namaLengkap?: string;
  catatan?: string;
}

export interface Consultation {
  id: string
  name: string
  email: string
  question: string
  category: string
  isPublic: boolean
  isModerated: boolean
  isHidden: boolean
  createdAt: string
  replies: ConsultationReply[]
}

export interface ConsultationReply {
  id: string
  consultationId: string
  adminId: string
  reply: string
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    data: T[];
    total: number;
    page: number;
    lastPage: number;
  };
}
