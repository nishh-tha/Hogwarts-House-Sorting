// routes/sorting.js — All quiz-related API endpoints

const express = require('express');
const router = express.Router();
const { driver } = require('../config/db');

// ─────────────────────────────────────────────
// POST /api/sort
// Called when a student completes the quiz.
// Saves the student node and connects them to their house.
//
// Body: { name: "Harry Potter", house: "gryffindor", scores: { gryffindor: 4, ... } }
// ─────────────────────────────────────────────
router.post('/sort', async (req, res) => {
  const { name, house, scores } = req.body;

  // Basic validation
  if (!name || !house) {
    return res.status(400).json({ error: 'Name and house are required.' });
  }

  const validHouses = ['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'];
  if (!validHouses.includes(house.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid house name.' });
  }

  const houseName = house.charAt(0).toUpperCase() + house.slice(1).toLowerCase();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (h:House { name: $houseName })
      CREATE (s:Student {
        name:        $name,
        sortedAt:    datetime(),
        scores:      $scoresJson
      })
      CREATE (s)-[:SORTED_INTO]->(h)
      RETURN s.name AS name, h.name AS house, s.sortedAt AS sortedAt
    `, {
      name: name.trim(),
      houseName,
      scoresJson: JSON.stringify(scores || {})
    });

    const record = result.records[0];

    res.status(201).json({
      message: 'The Sorting Hat has spoken!',
      student: {
        name:     record.get('name'),
        house:    record.get('house'),
        sortedAt: record.get('sortedAt')
      }
    });

  } catch (err) {
    console.error('Error saving sort result:', err.message);
    res.status(500).json({ error: 'Failed to save your sorting result.' });
  } finally {
    await session.close();
  }
});


// ─────────────────────────────────────────────
// GET /api/results
// Returns all sorted students + their house, ordered by most recent.
// ─────────────────────────────────────────────
router.get('/results', async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (s:Student)-[:SORTED_INTO]->(h:House)
      RETURN s.name AS name, h.name AS house, s.sortedAt AS sortedAt, s.scores AS scores
      ORDER BY s.sortedAt DESC
    `);

    const students = result.records.map(record => ({
      name:     record.get('name'),
      house:    record.get('house'),
      sortedAt: record.get('sortedAt'),
      scores:   JSON.parse(record.get('scores') || '{}')
    }));

    res.json({ count: students.length, students });

  } catch (err) {
    console.error('Error fetching results:', err.message);
    res.status(500).json({ error: 'Failed to fetch results.' });
  } finally {
    await session.close();
  }
});


// ─────────────────────────────────────────────
// GET /api/stats
// Returns house-wise count (for leaderboard / pie chart)
// ─────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (s:Student)-[:SORTED_INTO]->(h:House)
      RETURN h.name AS house, count(s) AS total
      ORDER BY total DESC
    `);

    const stats = result.records.map(record => ({
      house: record.get('house'),
      total: record.get('total').toNumber()
    }));

    res.json({ stats });

  } catch (err) {
    console.error('Error fetching stats:', err.message);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  } finally {
    await session.close();
  }
});


// ─────────────────────────────────────────────
// GET /api/houses
// Returns all houses with their traits from the graph
// ─────────────────────────────────────────────
router.get('/houses', async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (h:House)-[:HAS_TRAIT]->(t:Trait)
      RETURN h.name AS house, h.founder AS founder, h.animal AS animal,
             collect(t.name) AS traits
      ORDER BY h.name
    `);

    const houses = result.records.map(record => ({
      house:   record.get('house'),
      founder: record.get('founder'),
      animal:  record.get('animal'),
      traits:  record.get('traits')
    }));

    res.json({ houses });

  } catch (err) {
    console.error('Error fetching houses:', err.message);
    res.status(500).json({ error: 'Failed to fetch houses.' });
  } finally {
    await session.close();
  }
});

module.exports = router;
