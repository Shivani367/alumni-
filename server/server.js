const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from root or server directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'eec-alumni-portal-super-secret-key-12345';

app.use(cors());
app.use(bodyParser.json());

const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Default Seed Data
const defaultData = {
  users: [],
  blogs: [
    {
      id: "blog-1",
      title: "Navigating Your Career Transition from College to Corporate",
      excerpt: "Essential tips and advice from senior alumni on how to adapt to corporate life, handle responsibilities, and succeed.",
      content: "Transitioning from the structured environment of a college campus to the dynamic corporate world can be daunting. In this article, several alumni share their personal journeys and key learnings. Key takeaways include: 1. Continuous learning is vital; 2. Building strong interpersonal relationships (networking) accelerates your career; 3. Don't be afraid to ask questions; and 4. Manage your time effectively. Read on to discover specific strategies that will help you shine in your first year.",
      email_id: "arun@eec.com",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "blog-2",
      title: "Rising Trends in AI and Machine Learning: 2026 Overview",
      excerpt: "A deep dive into how generative AI and automation are reshaping software engineering, and what skills you should focus on.",
      content: "Artificial Intelligence has evolved rapidly, transitioning from experimentation to core operations. Today, generative coding assistants, automated pipeline analysis, and localized AI models are standard. For students and young alumni, focusing on core software engineering principles, system design, and AI model orchestration is key. Industry experts recommend getting hands-on experience with vector databases, LLM tuning, and cloud hosting architectures to stay ahead.",
      email_id: "john.doe@eec.com",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  events: [
    {
      id: "event-1",
      title: "Annual Alumni Networking Meet 2026",
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: "Main Auditorium, EEC Campus",
      description: "Join us for our annual homecoming! Reconnect with your batchmates, network with senior industry leaders, and share your experiences with the current students. High tea and dinner will be served.",
      email_id: "arun@eec.com",
      created_at: new Date().toISOString()
    },
    {
      id: "event-2",
      title: "Webinar: Succeeding in Civil Engineering Projects",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: "Online (Zoom Link will be sent)",
      description: "Jane Smith (Class of 2017) hosts a live webinar detailing project management workflows, sustainable design practices, and navigating contracts in large infrastructure projects.",
      email_id: "jane.smith@eec.com",
      created_at: new Date().toISOString()
    }
  ],
  job_openings: [
    {
      id: "job-1",
      title: "Software Engineer (Frontend)",
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: "Chennai, India (Hybrid)",
      description: "We are looking for a talented React Developer to join our startup. Requirements: 1-3 years of experience with React, Tailwind CSS, and state management. Strong communication skills are a plus. Referral available!",
      email_id: "john.doe@eec.com",
      created_at: new Date().toISOString()
    },
    {
      id: "job-2",
      title: "Project Coordinator (Civil & Infrastructure)",
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: "Bangalore, India",
      description: "Opportunity to work on landmark eco-friendly commercial projects. Candidate will coordinate architectural drawings, site schedules, and vendor management. 2+ years experience required.",
      email_id: "jane.smith@eec.com",
      created_at: new Date().toISOString()
    }
  ],
  notifications: [
    {
      id: "notif-1",
      title: "Welcome to Alumni Connect Portal!",
      message: "The new official EEC Alumni Portal is now live. Complete your profile, explore current job listings, connect via live chat, and stay updated on events.",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "notif-2",
      title: "New Job Opportunities Posted",
      message: "Check out the Job Openings page for fresh positions posted by senior alumni at Google, Amazon, and L&T.",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  messages: []
};

// Database helper functions (local fallback)
const readDb = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDb(defaultData);
      return defaultData;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return defaultData;
  }
};

const writeDb = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
};

// Seed default users if empty
const seedUsers = () => {
  const db = readDb();
  if (db.users.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const demoUsers = [
      {
        id: "usr-john",
        email: "john.doe@eec.com",
        passwordHash: bcrypt.hashSync("password123", salt),
        profile: { name: "John Doe", phone_number: "+1 555-0199", status: "Alumni", country: "United States" }
      },
      {
        id: "usr-jane",
        email: "jane.smith@eec.com",
        passwordHash: bcrypt.hashSync("password123", salt),
        profile: { name: "Jane Smith", phone_number: "+44 7911 123456", status: "Alumni", country: "United Kingdom" }
      },
      {
        id: "usr-arun",
        email: "arun@eec.com",
        passwordHash: bcrypt.hashSync("password123", salt),
        profile: { name: "Arun Kumar", phone_number: "+91 98401 23456", status: "Alumni", country: "India" }
      },
      {
        id: "usr-emily",
        email: "emily.j@eec.com",
        passwordHash: bcrypt.hashSync("password123", salt),
        profile: { name: "Emily Johnson", phone_number: "+61 2 9876 5432", status: "Student", country: "Australia" }
      }
    ];
    db.users = demoUsers;
    writeDb(db);
    console.log("Seeded default alumni accounts.");
  }
};

// --- DUAL DATABASE SYSTEM SETUP ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://poaxhsurnoaohtmzdwon.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvYXhoc3Vybm9hb2h0bXpkd29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0Mzc5MTcsImV4cCI6MjA0NTAxMzkxN30.dLxi8cD1DL-_WudCw4K-D4bvgaOiFLs19I8X82A70d4';

let supabase = null;
let dbMode = 'local';

if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (err) {
    console.error('Error creating Supabase client:', err.message);
  }
}

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// API: Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, profile } = req.body;
  if (!email || !password || !profile || !profile.name) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (dbMode === 'supabase') {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { data: profile }
      });
      if (error) throw error;

      // Upsert profile in Supabase profiles table
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email: normalizedEmail,
        name: profile.name,
        phone_number: profile.phone_number,
        status: profile.status,
        country: profile.country
      });
      if (profileError) throw profileError;

      const token = jwt.sign({ id: data.user.id, email: normalizedEmail }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        session: {
          access_token: token,
          user: {
            id: data.user.id,
            email: normalizedEmail,
            user_metadata: profile
          }
        }
      });
    } catch (err) {
      console.error('Supabase Sign-Up Error:', err.message);
      return res.status(400).json({ error: err.message || 'Registration failed' });
    }
  } else {
    // Local JSON DB Mode
    const db = readDb();
    if (db.users.find(u => u.email === normalizedEmail)) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      email: normalizedEmail,
      passwordHash,
      profile
    };

    db.users.push(newUser);
    writeDb(db);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      session: {
        access_token: token,
        user: {
          id: newUser.id,
          email: newUser.email,
          user_metadata: newUser.profile
        }
      }
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (dbMode === 'supabase') {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });
      if (error) throw error;

      // Query profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const profile = profileData || {
        name: data.user.user_metadata?.name || 'User',
        status: data.user.user_metadata?.status || 'Alumni',
        phone_number: data.user.user_metadata?.phone_number || '',
        country: data.user.user_metadata?.country || ''
      };

      const token = jwt.sign({ id: data.user.id, email: data.user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        session: {
          access_token: token,
          user: {
            id: data.user.id,
            email: data.user.email,
            user_metadata: profile
          }
        }
      });
    } catch (err) {
      console.error('Supabase Login Error:', err.message);
      return res.status(400).json({ error: err.message || 'Login failed' });
    }
  } else {
    // Local JSON DB Mode
    const db = readDb();
    const user = db.users.find(u => u.email === normalizedEmail);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      session: {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.profile
        }
      }
    });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  if (dbMode === 'supabase') {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (error || !profileData) {
        return res.json({ user: { id: req.user.id, email: req.user.email, user_metadata: {} } });
      }

      res.json({
        user: {
          id: req.user.id,
          email: req.user.email,
          user_metadata: profileData
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve profile' });
    }
  } else {
    // Local JSON DB Mode
    const db = readDb();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.profile
      }
    });
  }
});

// API: Content Management (Generic)
app.get('/api/content/:table', async (req, res) => {
  const { table } = req.params;
  const { email_id } = req.query;

  if (dbMode === 'supabase') {
    try {
      let query = supabase.from(table).select('*');
      if (email_id) {
        query = query.eq('email_id', email_id);
      }
      const { data, error } = await query;
      if (error) throw error;

      data.sort((a, b) => {
        const timeA = new Date(a.created_at || a.postedDate || a.date || 0).getTime();
        const timeB = new Date(b.created_at || b.postedDate || b.date || 0).getTime();
        return timeB - timeA;
      });

      res.json(data || []);
    } catch (err) {
      console.error(`Supabase Content List Error for ${table}:`, err.message);
      res.status(400).json({ error: err.message });
    }
  } else {
    // Local JSON DB Mode
    const db = readDb();
    if (!db[table]) return res.status(404).json({ error: `Table '${table}' not found` });

    let items = db[table];
    if (email_id) {
      items = items.filter(item => item.email_id === email_id);
    }

    items.sort((a, b) => {
      const timeA = new Date(a.created_at || a.postedDate || a.date || 0).getTime();
      const timeB = new Date(b.created_at || b.postedDate || b.date || 0).getTime();
      return timeB - timeA;
    });

    res.json(items);
  }
});

app.get('/api/content/:table/:id', async (req, res) => {
  const { table, id } = req.params;

  if (dbMode === 'supabase') {
    try {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(404).json({ error: 'Item not found' });
    }
  } else {
    // Local JSON DB Mode
    const db = readDb();
    if (!db[table]) return res.status(404).json({ error: `Table '${table}' not found` });

    const item = db[table].find(i => String(i.id) === String(id));
    if (!item) return res.status(404).json({ error: 'Item not found' });

    res.json(item);
  }
});

app.post('/api/content/:table', authenticateToken, async (req, res) => {
  const { table } = req.params;

  const newItem = {
    id: `${table.substr(0, 3)}-` + Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
    ...req.body
  };

  if (dbMode === 'supabase') {
    try {
      const { error } = await supabase.from(table).insert([newItem]);
      if (error) throw error;
      res.json(newItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    // Local JSON DB Mode
    const db = readDb();
    if (!db[table]) {
      db[table] = [];
    }

    db[table].unshift(newItem);
    writeDb(db);
    res.json(newItem);
  }
});

app.put('/api/content/:table/:id', authenticateToken, async (req, res) => {
  const { table, id } = req.params;

  if (dbMode === 'supabase') {
    try {
      const { error } = await supabase.from(table).update(req.body).eq('id', id);
      if (error) throw error;
      res.json({ id, ...req.body });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    // Local JSON DB Mode
    const db = readDb();
    if (!db[table]) return res.status(404).json({ error: `Table '${table}' not found` });

    const index = db[table].findIndex(i => String(i.id) === String(id));
    if (index === -1) return res.status(404).json({ error: 'Item not found' });

    db[table][index] = {
      ...db[table][index],
      ...req.body
    };

    writeDb(db);
    res.json(db[table][index]);
  }
});

app.delete('/api/content/:table/:id', authenticateToken, async (req, res) => {
  const { table, id } = req.params;

  if (dbMode === 'supabase') {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    // Local JSON DB Mode
    const db = readDb();
    if (!db[table]) return res.status(404).json({ error: `Table '${table}' not found` });

    const filtered = db[table].filter(i => String(i.id) !== String(id));
    if (filtered.length === db[table].length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    db[table] = filtered;
    writeDb(db);
    res.json({ success: true });
  }
});

// API: HTTP fallbacks for Chat Messages (used for initial listing and history load)
app.get('/api/messages', authenticateToken, async (req, res) => {
  const { receiverId } = req.query;
  if (!receiverId) return res.status(400).json({ error: 'receiverId is required' });

  const userId = req.user.id;

  if (dbMode === 'supabase') {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Mark received messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', receiverId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      res.json(messages || []);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    // Local JSON DB Mode
    const db = readDb();
    const conversations = db.messages.filter(m => 
      (m.sender_id === userId && m.receiver_id === receiverId) ||
      (m.sender_id === receiverId && m.receiver_id === userId)
    );

    let updated = false;
    db.messages = db.messages.map(m => {
      if (m.sender_id === receiverId && m.receiver_id === userId && !m.is_read) {
        updated = true;
        return { ...m, is_read: true };
      }
      return m;
    });

    if (updated) {
      writeDb(db);
    }

    res.json(conversations);
  }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content) return res.status(400).json({ error: 'receiverId and content are required' });

  const newMessage = {
    id: 'msg-' + Math.random().toString(36).substr(2, 9),
    sender_id: req.user.id,
    receiver_id: receiverId,
    content,
    is_read: false,
    created_at: new Date().toISOString()
  };

  if (dbMode === 'supabase') {
    try {
      const { error } = await supabase.from('messages').insert([newMessage]);
      if (error) throw error;
      res.json(newMessage);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    // Local JSON DB Mode
    const db = readDb();
    db.messages.push(newMessage);
    writeDb(db);
    res.json(newMessage);
  }
});

app.get('/api/users', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  if (dbMode === 'supabase') {
    try {
      // Query profiles table
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', userId);

      if (error) throw error;

      // Query unread messages
      const { data: unreadMsgs, error: msgsError } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', userId)
        .eq('is_read', false);

      const usersWithCounts = profiles.map(p => {
        const unreadCount = unreadMsgs ? unreadMsgs.filter(m => m.sender_id === p.id).length : 0;
        return {
          id: p.id,
          email: p.email,
          name: p.name || p.email,
          status: p.status || 'Member',
          unread_count: unreadCount
        };
      });

      res.json(usersWithCounts);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    // Local JSON DB Mode
    const db = readDb();
    const usersWithCounts = db.users
      .filter(u => u.id !== userId)
      .map(u => {
        const unreadCount = db.messages.filter(m => 
          m.sender_id === u.id && m.receiver_id === userId && !m.is_read
        ).length;

        return {
          id: u.id,
          email: u.email,
          name: u.profile.name,
          status: u.profile.status,
          unread_count: unreadCount
        };
      });

    res.json(usersWithCounts);
  }
});

// Serve React static frontend in production
const buildPath = path.join(__dirname, '..', 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(buildPath, 'index.html'));
    }
  });
}

// Wrap HTTP server for WebSockets
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

// Active socket connection map: userId -> WebSocket
const clients = new Map();

// Authentication on upgrade handshake
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.userId = decoded.id;
      ws.userEmail = decoded.email;
      wss.emit('connection', ws, request);
    });
  });
});

wss.on('connection', (ws) => {
  console.log(`[WS] Client registered: ${ws.userEmail} (ID: ${ws.userId})`);
  clients.set(ws.userId, ws);

  ws.send(JSON.stringify({ type: 'system', message: 'Connected to WebSocket server.' }));

  ws.on('message', async (messageStr) => {
    try {
      const payload = JSON.parse(messageStr);

      if (payload.type === 'chat') {
        const { receiverId, content } = payload;
        if (!receiverId || !content) return;

        const msgId = 'msg-' + Math.random().toString(36).substr(2, 9);
        const timestamp = new Date().toISOString();
        
        const savedMsg = {
          id: msgId,
          sender_id: ws.userId,
          receiver_id: receiverId,
          content,
          is_read: false,
          created_at: timestamp
        };

        // Save to active Database mode
        if (dbMode === 'supabase') {
          const { error } = await supabase.from('messages').insert([savedMsg]);
          if (error) {
            console.error('[WS] Error inserting to Supabase:', error.message);
            ws.send(JSON.stringify({ type: 'error', error: 'Failed to send message' }));
            return;
          }
        } else {
          // Local mode
          const db = readDb();
          db.messages.push(savedMsg);
          writeDb(db);
        }

        // Deliver message to receiver if online
        const receiverSocket = clients.get(receiverId);
        if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
          receiverSocket.send(JSON.stringify({
            type: 'chat',
            message: savedMsg
          }));

          // Notify receiver to trigger an instantaneous sidebar refresh
          receiverSocket.send(JSON.stringify({
            type: 'unread_update',
            senderId: ws.userId
          }));
        }

        // Send confirmation back to sender
        ws.send(JSON.stringify({
          type: 'chat_confirm',
          message: savedMsg
        }));
      }
    } catch (err) {
      console.error('[WS] Error processing message payload:', err.message);
    }
  });

  ws.on('close', () => {
    console.log(`[WS] Client disconnected: ${ws.userEmail}`);
    clients.delete(ws.userId);
  });
});

// Self-healing database connection test before startup
const testSupabaseConnection = async () => {
  if (!supabase) return false;
  try {
    const { error } = await Promise.race([
      supabase.from('profiles').select('id').limit(1),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
    ]);
    if (error) {
      console.warn('[DB] Supabase connectivity test failed:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[DB] Supabase connection check timed out or errored:', err.message);
    return false;
  }
};

// Initialize server
const init = async () => {
  console.log('[DB] Running connection testing check...');
  const isSupabaseOnline = await testSupabaseConnection();

  if (isSupabaseOnline) {
    dbMode = 'supabase';
    console.log('>>> DB MODE STATUS: CONNECTED TO SUPABASE CLOUD DATABASE <<<');
  } else {
    dbMode = 'local';
    console.log('>>> DB MODE STATUS: FALLBACK TO LOCAL JSON DOCUMENT DATABASE (db.json) <<<');
  }

  if (dbMode === 'local') {
    seedUsers();
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Ready. listening on port ${PORT} on host 0.0.0.0 in ${dbMode} mode`);
  });
};

init();
