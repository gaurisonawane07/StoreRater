import pool from '../db.js';

export async function ownerStoreUsers(req, res) {
  try {
    const ownerId = req.user.id;
    // find stores owned by owner
    const storesRes = await pool.query('SELECT id, name FROM stores WHERE owner_id=$1', [ownerId]);
    const stores = storesRes.rows;
    const result = [];
    for (const s of stores) {
      const q = `
        SELECT u.id, u.name, u.email, r.rating, r.created_at
        FROM ratings r
        JOIN users u ON u.id = r.user_id
        WHERE r.store_id = $1
        ORDER BY r.created_at DESC
      `;
      const { rows } = await pool.query(q, [s.id]);
      const avgRes = await pool.query('SELECT ROUND(AVG(rating)::numeric,2) as avg_rating FROM ratings WHERE store_id=$1', [s.id]);
      result.push({
        store: s,
        averageRating: Number(avgRes.rows[0].avg_rating) || 0,
        ratings: rows
      });
    }
    return res.json({ stores: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
