import { JwtPayload } from 'jsonwebtoken';
import { ROLES } from '../config/roles';

export interface UserPayload extends JwtPayload {
  role: ROLES;
  user_id: number;
  email: string;
}
