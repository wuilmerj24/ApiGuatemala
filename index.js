var request = require("request");
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
var server = require('http').Server(app);
var cors = require('cors');

app.use(cors());

//settings
app.set('port', process.env.PORT || 3001);

//middlewares
app.use(bodyParser.json({ limit: '100mb' }));

function isToken(req, res, next) {
  let token = req.params.token;
  if (token==null || token==undefined) {
    res.json({code_error:1,error:"no token"});
  } else {
    next();
  }
}

app.use("/v1/listAll/:token",isToken);

const clientID = '0004872c1bd0dd5286ba';
const clientSecret ='d440661c72d9bf129aea18fdec3839629dd223f7';

const promociones=new Array();
for(let i=0;i<20;i++){
  promociones.push({
    id:i,
    title:"Titulo promocion "+i,
    price:parseFloat("80,00")+i,
    address:"Direccion",
    latitude:0,
    longitude:0,
    created_at:new Date(),
    updated_at:new Date(),
  })
}

app.post('/v1/login/', (req, res) => {
  const requestToken = req.body.code;
  var options = {
    method: 'POST',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    headers: { 'content-type': 'application/json' },
  };

  request(options, function (error, response, body) {
    if (error){
      res.json({code_error:1,error:error});
    }
    token = body.split("=")[1];
    res.json({code_error:0,token:token});
  });
});

app.get("/v1/listAll/:token",(req,res)=>{
  res.json({code_error:0,data:promociones});
})
//start server
server.listen(app.get('port'), () => {
})