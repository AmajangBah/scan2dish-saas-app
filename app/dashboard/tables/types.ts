export type TableStatus = "available" | "occupied" ;

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  location: string;
  qrAssigned: boolean;
  qrScans: number;
}
