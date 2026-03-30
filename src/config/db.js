import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DIRECT_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg( pool );
const prisma = new PrismaClient({ adapter });

export default prisma;