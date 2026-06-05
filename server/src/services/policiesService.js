'use strict';

const fs = require('fs');
const path = require('path');
const { REGIONAL_FRAMEWORKS } = require('./regionalFrameworks');

const DATA_DIR  = path.join(__dirname, '../data');
const FILE_PATH = path.join(DATA_DIR, 'policies.json');

const DEFAULT_CONFIG = { region: 'Global', customPolicies: [] };

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadPolicies() {
  ensureDataDir();

  if (!fs.existsSync(FILE_PATH)) {
    savePolicies(DEFAULT_CONFIG);
    return { ...DEFAULT_CONFIG, customPolicies: [] };
  }

  let raw;
  try {
    raw = fs.readFileSync(FILE_PATH, 'utf-8');
  } catch (e) {
    const err = new Error(`Cannot read policies file: ${e.message}`);
    err.code = 'POLICIES_ERROR';
    throw err;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      region: typeof parsed.region === 'string' ? parsed.region : 'Global',
      customPolicies: Array.isArray(parsed.customPolicies) ? parsed.customPolicies : [],
    };
  } catch {
    const err = new Error('policies.json contains invalid JSON. Delete the file to reset.');
    err.code = 'POLICIES_ERROR';
    throw err;
  }
}

function savePolicies(data) {
  ensureDataDir();
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    const err = new Error(`Cannot write policies file: ${e.message}`);
    err.code = 'POLICIES_ERROR';
    throw err;
  }
}

function getConfig() {
  return loadPolicies();
}

function setRegion(region) {
  if (!region || typeof region !== 'string' || !region.trim()) {
    const err = new Error('region must be a non-empty string');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  const data = loadPolicies();
  data.region = region.trim();
  savePolicies(data);
  return data;
}

function addCustomPolicy(name, description) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    const err = new Error('name must be a non-empty string');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  if (!description || typeof description !== 'string' || !description.trim()) {
    const err = new Error('description must be a non-empty string');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  const data = loadPolicies();
  const newPolicy = {
    id: `cp_${Date.now()}`,
    name: name.trim(),
    description: description.trim(),
  };
  data.customPolicies.push(newPolicy);
  savePolicies(data);
  return newPolicy;
}

function removeCustomPolicy(id) {
  const data = loadPolicies();
  const before = data.customPolicies.length;
  data.customPolicies = data.customPolicies.filter(p => p.id !== id);
  savePolicies(data);
  return data.customPolicies.length < before;
}

function getActiveFrameworks() {
  const data = loadPolicies();
  return REGIONAL_FRAMEWORKS[data.region] || REGIONAL_FRAMEWORKS['Global'];
}

module.exports = {
  getConfig,
  setRegion,
  addCustomPolicy,
  removeCustomPolicy,
  getActiveFrameworks,
  loadPolicies,
};
