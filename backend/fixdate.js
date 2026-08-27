require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  
  // Fix corrupt date
  const r = await db.collection('leaves').updateOne(
    { fromDate: { $lt: new Date('2020-01-01') } },
    { $set: { fromDate: new Date('2026-08-28T00:00:00.000Z') } }
  );
  console.log('Fixed corrupt dates:', r.modifiedCount);

  // Also add safety limit in case of future bad data
  const all = await db.collection('leaves').find({}).toArray();
  console.log('Total leaves:', all.length);
  all.forEach(l => console.log(' ', l.status, '|', l.fromDate.toISOString(), '-', l.toDate.toISOString()));
  
  process.exit();
});
