import { UserModel } from 'src/app/shared/models/user.model';
import { ApartmentStatus } from './apartment-status';

export interface ApartmentModel {
  address: string;
  created: string;
  description: string;
  floorAreaSize: number;
  latitude: number;
  longitude: number;
  name: string;
  numberOfRooms: number;
  pricePerMonth: number;
  realtor: UserModel;
  status: ApartmentStatus;
  _id?: string;
}
