var express = require('express');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'Questions'
});
var app = express();
app.use(bodyParser());
app.use(express.static('public'));
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... \n\n") ;  
  } else {
    console.log("Error connecting database ... \n\n");  
}
});
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var n,tim,cho;
var timee=[];
var dp=[];
var visit=[];
var flag=0;
var allowed_variation=0;
var ret=[];
var cnt=0;
var timee=[];
function solve(pos,tim,cho)
{
     if(visit[pos][tim][cho]==1)
     {
        return dp[pos][tim][cho];
     }
     if(flag==1)
     {
        return 1;
     }
     visit[pos][tim][cho]=1;
     if(cho==0 && ((tim-allowed_variation)==0) || (allowed_variation- tim)==0) 
     {
           dp[pos][tim][cho]=1;
           flag=1;
           return 1;
     }
     if(pos==n || cho==0 )
     {
          dp[pos][tim][cho]=0;
          return 0;
     }
     var ch=0;
     if(cho-1>=0 && tim-timee[pos]+allowed_variation>=0)
     {
         ch=solve(pos+1,tim-timee[pos],cho-1);
         if(flag==1)
         {
            //console.log(timee[pos]);
            ret[cnt++]=pos;
            dp[pos][tim][cho]=1;
            return 1;
         }
     }
     if(flag==1)
     {
       return 0;
     }
     var nch=solve(pos+1,tim,cho);
     dp[pos][tim][cho]=(nch==1 || ch==1);
     return nch==1 || ch==1;
}
function main(nn,tim,cho,t)
{
   //total numbers of questions present
   //tim = duration of the test
   //cho = number of questions need to be choosen
  ret=[];
  n=nn;flag=0;cnt=0;
  console.log(n+" "+ tim+" "+cho+" inside ");
  for(var i = 0; i < n+2; i++)
   {
      visit[i] = [];
      dp[i] = [];
      console.log(" built "+i);
      for(var j = 0; j < tim+2; j++)
      {
        visit[i][j]=[];
        dp[i][j]=[];
        for(var k = 0; k < cho+2; k++)
        {
             visit[i][j][k]=0;
             dp[i][j][k]=0;
        }
      } 
   }
   for(i=0;i<n;i++)
   {
    timee[i]=t[i].Duration;
   }
   //console.log(timee);
   //timee=t;
   console.log("Elements Chosen ");
   solve(0,tim,cho);
   //console.log(ret);
   return ret;
}
app.get('/', function(req, res)
{
  res.sendFile(__dirname+'/display_questions.html');
});
app.post('/', function(req, res)
{
   var html1 = 'Validation Successful <br>';
   var number=req.body.number; 
   var dur=req.body.dur; 
   var quer="SELECT * FROM `mcqs`" ;
   var quer2="SELECT * FROM `subjective` ";
   connection.query(quer2,function(err, rows, fields)
         {
             var fs = require('fs');
             fs.writeFileSync('subjective.json',JSON.stringify(rows) );
     });
   connection.query(quer,function(err, rows, fields)
         {
             var rett=main(rows.length,dur,number,rows);
             console.log(rett.length);
             if(rett.length==0)
             {
                   res.send("Could Not Find A Set of Random Question With these limits");                
             }
             else
             {
                console.log(rett);
                var ans=[];
                for(var i=0;i<number;i++)
                {
                   ans[i]=rows[rett[i]];
                }
                res.send(JSON.stringify(ans));  
             }
     });
  
});   
app.listen(8080);
console.log('Listening on port 8080 ');