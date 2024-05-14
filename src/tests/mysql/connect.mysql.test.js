const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "ecommerce",
});

const batchSize = 100000;
const totalSize = 1_000_000; //How long does it take to add 1000000 data to reach 1 million data

let currentId = 1;
const insertBathch = async () => {
  const values = [];
  for (let i = 0; i < batchSize; i++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;

    values.push([currentId, name, age, address]);
    currentId++;
  }
  if (!values.length) {
    pool.end((err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("pool closed");
      }
    });
    return;
  }

  const sql = `INSERT INTO users (id, name, age, address) VALUES ?`;
  pool.query(sql, [values], async function (err, result) {
    if (err) {
      console.error(err);
    } else {
      console.log(`Inserted ${result.affectedRows} rows`);
      await insertBathch(); // de quy
    }
  });
};
insertBathch().catch(console.error);
