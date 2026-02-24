// Tipos baseados nos DTOs do TrabalhoI (main-service)

export type EventType = 
  | "PALESTRA" 
  | "SHOW" 
  | "TEATRO" 
  | "CURSO" 
  | "WORKSHOP" 
  | "CONFERENCIA" 
  | "SEMINARIO"

export interface EventInterface {
  id: string;
  description: string;
  type: EventType;
  date: string; 
  startSales: string; 
  endSales: string; 
  price: number; 
  createdAt: string; 
  updatedAt: string; 
}

export interface CreateEventRequest {
  description: string;
  type: EventType;
  date: string;
  startSales: string;
  endSales: string;
  price: number;
}