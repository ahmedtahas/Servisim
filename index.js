const {Client} = require("pg")

const client = new Client ({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "1234",
  database: "bil372"
})

client.connect();
client.query("SELECT * FROM employee", (err,res) => {
  if(!err){
    console.log(res.rows);
  }else {
    console.log(err.message);
  }
  client.end;
})
