export interface IServiceData {
  _id: string;
  title: string;
  shortDesc: string;
  description: string;
  features: {
    title: string;
    description: string;
  }[];
  pricing: string;
  color: string;
  icon: string;
  order: number;
  active: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
