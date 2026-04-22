/**
 * server.js – Express backend for Mike Brouse Reverse Mortgage
 * Routes:
 *   POST /api/leads          – Save a lead (from wizard form)
 *   GET  /api/leads          – Return all leads (admin, password-protected)
 *   DELETE /api/leads/:id    – Delete a lead (admin)
 *   GET  /                   – Serve landing page
 *   GET  /admin              – Serve admin panel
 */

require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const path      = require('path');

const app = express();

/* ── Middleware ── */
app.use(cors());
app.use(express.json());

// Serve static files — works locally (__dirname) and on Vercel (process.cwd())
const staticDir = path.join(__dirname).includes('.vercel')
  ? process.cwd()
  : __dirname;
app.use(express.static(staticDir));


/* ════════════════════════════════════
   MongoDB – Lead Schema
════════════════════════════════════ */
const leadSchema = new mongoose.Schema({
  // wizard data
  goal:            { type: String },
  propertyType:    { type: String },
  timeline:        { type: String },
  homeValue:       { type: Number },
  hasMortgage:     { type: String },
  mortgageBalance: { type: Number, default: 0 },
  zipCode:         { type: String },
  // contact
  name:            { type: String, required: true },
  email:           { type: String, required: true },
  phone:           { type: String },
  // meta
  createdAt:       { type: Date, default: Date.now },
  status:          { type: String, enum: ['new', 'contacted', 'qualified', 'closed'], default: 'new' },
  notes:           { type: String, default: '' },
});
const Lead = mongoose.model('Lead', leadSchema);

/* ════════════════════════════════════
   Admin auth middleware
════════════════════════════════════ */
function adminAuth(req, res, next) {
  const pw = req.headers['x-admin-password'] || req.query.pw;
  if (pw === process.env.ADMIN_PASSWORD) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

/* ════════════════════════════════════
   API Routes
════════════════════════════════════ */

// POST /api/leads — save new lead from wizard
app.post('/api/leads', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({ success: true, id: lead._id });
  } catch (err) {
    console.error('Save lead error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/leads — fetch all leads (admin)
app.get('/api/leads', adminAuth, async (req, res) => {
  try {
    const { status, search, sort = '-createdAt', page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ name: re }, { email: re }, { phone: re }, { zipCode: re }];
    }
    const leads = await Lead.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Lead.countDocuments(filter);
    res.json({ leads, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/leads/:id — update status / notes (admin)
app.patch('/api/leads/:id', adminAuth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ error: 'Not found' });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/leads/:id — delete lead (admin)
app.delete('/api/leads/:id', adminAuth, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/stats — dashboard stats (admin)
app.get('/api/stats', adminAuth, async (req, res) => {
  try {
    const total     = await Lead.countDocuments();
    const newLeads  = await Lead.countDocuments({ status: 'new' });
    const contacted = await Lead.countDocuments({ status: 'contacted' });
    const qualified = await Lead.countDocuments({ status: 'qualified' });
    const closed    = await Lead.countDocuments({ status: 'closed' });
    // leads per day last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recent = await Lead.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    res.json({ total, new: newLeads, contacted, qualified, closed, recent7Days: recent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ════════════════════════════════════
   Page routes
════════════════════════════════════ */
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/admin', (_req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

/* ════════════════════════════════════
   MongoDB – lazy connection (works in serverless + local)
════════════════════════════════════ */
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

// Run connectDB before every request so cold-starts work on Vercel
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    next(err);
  }
});

/* ════════════════════════════════════
   Local dev  →  start HTTP server
   Vercel     →  export the app
════════════════════════════════════ */
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  connectDB()
    .then(() => {
      app.listen(PORT, () =>
        console.log(`🚀  Server running → http://localhost:${PORT}`)
      );
    })
    .catch(err => {
      console.error('❌  MongoDB connection failed:', err.message);
      process.exit(1);
    });
}

module.exports = app;

