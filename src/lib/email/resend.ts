import { Resend } from 'resend';
import { RESEND_KEY } from '../constants/env';

export const resend = new Resend(RESEND_KEY);