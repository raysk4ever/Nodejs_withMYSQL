const mysql = require("mysql");
const express = require("express");
const app = express();

app.use(express.json());

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "inzilo"
});

mysqlConnection.connect(err => {
  if (!err) {
    console.log("db connection successful");
  } else {
    console.log("db connection faild" + JSON.stringify(err));
  }
});

app.get("/orders", (req, res) => {
  const query = "SELECT * FROM ORDERS";
  //   const query = `SELECT o.id as order_id, o.title, o.prize, r.title as restro_name, r.address FROM orders o, restorants r
  //   WHERE o.restorant_id = r.restorant_id`;
  mysqlConnection.query(query, (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      res.send(err);
    }
  });
});

app.get("/orders/:id", (req, res) => {
  const id = req.params.id;
  mysqlConnection.query(
    `SELECT * FROM orders o
     WHERE o.id = ? `,
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    }
  );
});

app.post("/orders", (req, res) => {
  mysqlConnection.query(
    `INSERT INTO orders values(?, ?, ?,?)`,
    [null, req.body.title, req.body.prize, req.body.restorant_id],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send(`Error: ${err}`);
      }
    }
  );
});

app.delete("/orders/:id", (req, res) => {
  const id = req.params.id;
  mysqlConnection.query(
    "DELETE FROM orders WHERE id = ?",
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.send("DELETED SUCCESSFULLY");
      } else {
        res.send(`Error: ${err}`);
      }
    }
  );
});

app.put("/orders/:id", (req, res) => {
  const update = {
    title: req.body.title,
    prize: req.body.prize,
    restorant_id: req.body.restorant_id
  };
  mysqlConnection.query(
    "UPDATE orders set ? where id = ?",
    [update, req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(4000, () => console.log(`connected to server`));
