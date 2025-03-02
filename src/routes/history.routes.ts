import express from 'express';
import {
    addHistory,
    deleteHistoryById,
    getAllHistorys,
    getHistoryById
} from "../controllers/history.controller";

const router = express.Router({mergeParams: true});

router.post('/add-history', addHistory);

router.route('/:id').get(getHistoryById).delete(deleteHistoryById);

router.get('/', getAllHistorys);

export default router;
