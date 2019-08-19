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

app.get("/orders/:restroId", (req, res) => {
  const restro_id = req.params.restroId;
  const query = `SELECT * FROM ORDERS WHERE restro_id = ?`;
  mysqlConnection.query(query, [restro_id], (err, rows, fields) => {
    if (!err) res.send(rows);
    else res.send(err);
  });
});

app.delete("/:restro_id/:order_id", (req, res) => {
  const { restro_id, order_id } = req.params;
  const query = `DELETE FROM ORDERS WHERE id = ? AND restro_id = ?`;
  mysqlConnection.query(query, [order_id, restro_id], (err, rows, fields) => {
    if (!err) {
      if (rows.affectedRows != 0) return res.send("DELETED SUCCESSFULLY");
      else {
        return res.send("NO SUCH ORDER FOUND FOR RESTRO ID " + restro_id);
      }
    } else {
      return res.send("FAILD, ERROR: " + err);
    }
  });
});

app.delete("/orders", (req, res) => {
  const { restro_id, id } = req.body;
  const query = `DELETE FROM ORDERS WHERE id = ? AND restro_id = ?`;
  mysqlConnection.query(query, [id, restro_id], (err, rows, fields) => {
    if (!err) {
      if (rows.affectedRows != 0) {
        return res.send("DELETED SUCCESSFULLY");
      } else {
        return res.send("INVALID DETAILS");
      }
    } else {
      return res.send(err);
    }
  });
});

app.post("/orders", (req, res) => {
  const { title, prize, restro_id } = req.body;
  const query = `INSERT INTO ORDERS VALUES (?, ?, ?, ?)`;

  mysqlConnection.query(
    query,
    [null, title, prize, restro_id],
    (err, rows, fields) => {
      if (!err) res.send(`ORDER SUCCESSFULLY`);
      else res.send(`ERROR: ${err}`);
    }
  );
});

app.put("/orders", (req, res) => {
  const { id, restro_id, ...rest } = req.body;
  const query = `UPDATE ORDERS SET ? WHERE id=? AND restro_id=?`;
  mysqlConnection.query(
    query,
    [rest, req.body.id, req.body.restro_id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else res.send("ERROR" + err);
    }
  );
});
app.put("/:restro_id/:order_id", (req, res) => {
  const { id, restro_id, ...rest } = req.body;
  const query = `UPDATE ORDERS SET ? WHERE id=? AND restro_id=?`;
  mysqlConnection.query(
    query,
    [rest, req.params.order_id, req.params.restro_id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else res.send("ERROR" + err);
    }
  );
});
app.listen(3000, () => console.log(`connected to server`));
