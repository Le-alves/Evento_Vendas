import { EventInterface } from "./events";



export type PurchaseStatus = 
  | "EM_ABERTO" 
  | "PAGO" 
  | "CANCELADO" 
  | "ESTORNADO"

export interface SaleInterface {
  id: string;
  userId: string; 
  event: EventInterface;
  purchaseDate: string; 
  purchaseStatus: PurchaseStatus;
  createdAt: string; 
  updatedAt: string; 
}

export interface CreateSaleRequest {
  userId: string;
  eventId: string;
  purchaseDate: string;
  purchaseStatus: PurchaseStatus;
}

export interface UpdateSaleStatusRequest {
  purchaseStatus: PurchaseStatus;
}