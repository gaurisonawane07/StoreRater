import pool from '../db.js';


export async function listStores(req, res) {
  try {
    const { q, address, sortBy='name', sortDir='asc', page=1, limit=10 } = req.query;
    const userId = req.user?.id || null;
    const offset = (page - 1) * limit;

    // basic filtering
    const filters = [];
    const values = [];
    let idx = 1;
    if (q) {
      filters.push(`name ILIKE $${idx++}`);
      values.push(`%${q}%`);
    }
    if (address) {
      filters.push(`address ILIKE $${idx++}`);
      values.push(`%${address}%`);
    }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    // main query fetch stores + average rating
    const storesQuery = `
      SELECT s.*,
        COALESCE((
          SELECT ROUND(AVG(r.rating)::numeric,2) FROM ratings r WHERE r.store_id=s.id
        ), 0) AS avg_rating,
        COALESCE((
          SELECT r.rating FROM ratings r WHERE r.store_id=s.id AND r.user_id = ${userId ? `$${idx++}` : 'NULL'}
        ), NULL) AS my_rating
      FROM stores s
      ${where}
      ORDER BY ${sortBy === 'rating' ? 'avg_rating' : `s.${sortBy}`} ${sortDir === 'desc' ? 'DESC' : 'ASC'}
      LIMIT $${idx++} OFFSET $${idx++}
    `;

    if (userId) values.push(userId);
    values.push(limit, offset);

    const { rows } = await pool.query(storesQuery, values);
    return res.json({ stores: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function adminAddStore(req, res) {
  try {
    const { name, address, owner_id } = req.body;
    if (!name) return res.status(400).json({ error: 'Store name required' });
    const q = await pool.query('INSERT INTO stores (name,address,owner_id) VALUES ($1,$2,$3) RETURNING *', [name, address||null, owner_id||null]);
    return res.json({ store: q.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
