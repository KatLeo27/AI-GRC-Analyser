'use strict';

const express = require('express');
const {
  getConfig,
  setRegion,
  addCustomPolicy,
  removeCustomPolicy,
} = require('../services/policiesService');

const router = express.Router();

// GET /api/policies
router.get('/', (_req, res, next) => {
  try {
    return res.json({ success: true, data: getConfig() });
  } catch (err) {
    next(err);
  }
});

// POST /api/policies/region  { region: "India" }
router.post('/region', (req, res, next) => {
  try {
    const { region } = req.body;
    if (!region) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'region is required' },
      });
    }
    return res.json({ success: true, data: setRegion(region) });
  } catch (err) {
    next(err);
  }
});

// POST /api/policies/custom  { name, description }
router.post('/custom', (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'name and description are required' },
      });
    }
    return res.status(201).json({ success: true, data: addCustomPolicy(name, description) });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/policies/custom/:id
router.delete('/custom/:id', (req, res, next) => {
  try {
    const removed = removeCustomPolicy(req.params.id);
    if (!removed) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `No custom policy found with id: ${req.params.id}` },
      });
    }
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
