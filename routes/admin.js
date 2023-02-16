const express = require('express');

const adminController = require('../controller/adminController');

const router = express.Router();


router.get('/add-event', adminController.getAddEvent);

router.post('/add-event', adminController.postAddEvent);

router.get("/edit-event/:id",adminController.getEditEvent);

router.post('/edit-event/:id', adminController.postEditEvent);

router.get('/events', adminController.getEvents);

router.get('/', adminController.getCalendar);

router.get('/add-appointment', adminController.getAddAppointment);

router.post('/add-appointment', adminController.postAddAppointment);

router.get('/error', adminController.getError);

router.get('/cancel-appointment', adminController.getCancelAppointment);

router.post('/cancel-appointment', adminController.postCancelAppointment);

module.exports= router;