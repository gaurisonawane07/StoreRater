import pool from '../db.js';

export async function submitOrUpdateRating(req, res) {
  try {
    const userId = req.user.id;
    const { store_id, rating } = req.body;
    if (!store_id || !rating) return res.status(400).json({ error: 'store_id and rating required' });
    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) return res.status(400).json({ error: 'Rating must be an integer 1-5' });

    // upsert: if exists update else insert
    const exists = await pool.query('SELECT id FROM ratings WHERE user_id=$1 AND store_id=$2', [userId, store_id]);
    if (exists.rows.length) {
      await pool.query('UPDATE ratings SET rating=$1, updated_at=now() WHERE id=$2', [r, exists.rows[0].id]);
      return res.json({ message: 'Rating updated' });
    } else {
      await pool.query('INSERT INTO ratings (user_id, store_id, rating) VALUES ($1,$2,$3)', [userId, store_id, r]);
      return res.json({ message: 'Rating submitted' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
