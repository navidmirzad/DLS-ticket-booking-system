export interface Event {
    id: string;
    title: string;
    image: string;
    description: string;
    location: string;
    date: Date;
    created_at: Date;
    updated_at: Date;
    capacity: number;
    tickets_available?: number;
    tickets?: Ticket[];
}

export interface Ticket {
    id?: string;
    price: number;
    type: string;
}
  