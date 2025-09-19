import cron from 'node-cron';
import main from './promptGen.js';

cron.schedule("34 18 * * *", main );