const mysql = require("mysql");

const connection = require('../util/database')
const calendar = require("../util/calendar_config");



const getSql = (sql) => {
  return new Promise((resolve, reject) => {
      connection.query(sql, (err, rows) => {
          if(err) {
              return reject(err);
          }           

          return resolve(rows[0])
      })
  }) 
}



//---------- ADD EVENT --------------//
exports.getAddEvent = (req, res) =>{
    res.render("add-event");
};


exports.getError= (req,res)=>{
  res.render("error");
}

exports.postAddEvent = (req, res) =>{
    const event = req.body;

    const sql2= `SELECT title, start_time, end_time FROM events`;

    const sql3= `SELECT time FROM appointments WHERE name = '${event.appointment}'`;

    connection.query(sql2, async (error, result)  => {
      if(error) throw error;
      
      let calcEndTime= new Date(event.start_time);
      const timeMinutes= await getSql(sql3);

      //-- CALCULEAZA END TIME-UL PENTRU PROGRAMAREA RESPECTIVA --//
      calcEndTime.setUTCHours(parseInt(calcEndTime.getHours() + parseInt(timeMinutes.time/60)), parseInt(calcEndTime.getMinutes() + timeMinutes.time%60));
      
      ///-----------------------VALIDARI -----------------//
      if(new Date(event.start_time) > calcEndTime)
      {
        console.log("Datele introduse sunt incorecte");
        res.redirect("/error");
        return;
      }
    
      if(calcEndTime==='' || event.appointment==='' || event.start_time==='' || event.title ===''){
        res.redirect("/error");
        return;
      }
      for(ev in result){
        if(calcEndTime.getTime() >= new Date(result[ev].start_time).getTime() && calcEndTime.getTime()<=new Date(result[ev].end_time).getTime()) {
          console.log("NU SE PUEDE 1");
          res.redirect("/error");
          return;
        }

        if(new Date(event.start_time).getTime() >= new Date(result[ev].start_time).getTime() && new Date(event.start_time).getTime() <= new Date(result[ev].end_time).getTime()){
           console.log("NU SE PUEDE 2");
            res.redirect("/error");
            return;
        }
        if(new Date(event.start_time).getTime()>= new Date(result[ev].start_time).getTime() && calcEndTime.getTime()<=new Date(result[ev].end_time).getTime()){
          console.log("NU SE PUEDE 3");
          res.redirect("/error");
          return;
        }

        if (new Date(event.start_time).getTime() <= new Date(result[ev].start_time).getTime() && calcEndTime.getTime()>=new Date(result[ev].end_time).getTime()){
          console.log("NU SE PUEDE 4");
          res.redirect("/error");
          return;
        }
         
         }
    //----------------- END VALIDARI ----------- //


      var endTime= calcEndTime.toISOString().replace(":00.000Z", '');

      const sql = `INSERT INTO events (title, start_time, end_time, appointment)
      VALUES ('${event.title}', '${event.start_time}', '${endTime}', '${event.appointment}')`;
      
      connection.query(sql, (error, result) => {
        if (error) throw error;
        res.redirect("/events");
      });
    

    });
  
};
//---------------------------//

//---------- ADD Appointment  --------------//
exports.getAddAppointment= (req,res) =>{
  res.render("add-appointment");
};


exports.postAddAppointment= (req, res) =>{
  const appointment= req.body;
  const sql= `INSERT INTO appointments (name, time) VALUES ('${appointment.name}', '${appointment.time}')`;

  connection.query(sql, (err, result)=>{
      if(err) throw err;
      res.redirect("/events");
  });
};

//---------------------------//

//---------- Edit Event  --------------//
exports.getEditEvent= (req, res)=>{
    const sql = `SELECT * FROM events WHERE id = ${req.params.id}`;
  
    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.render("edit-event", { event: result });
    });
};


exports.postEditEvent= (req,res) =>{
    const event = req.body;
    const id= req.params.id;
    const sql = `UPDATE events
                 SET title = '${event.title}', start_time = '${event.start_time}', end_time = '${event.end_time}'
                 WHERE id =  ${id}`;
  
                 
    connection.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect("/events");  
    });
};

//---------------------------//

//----------- Events -----------//
exports.getEvents= (req,res)=>{
    const event = "SELECT title, start_time, end_time FROM events";
    connection.query(event, (error, result) => {
      if (error) throw error;
      res.render("events", { events: result });
    });
};



exports.getCalendar= (req,res)=> {
  const date= new Date();
  const year = req.query.year || 2023;
  const monthName= req.query.monthName || "Februarie";
  const months = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie",
  "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
  const events = "SELECT title, start_time, end_time, appointment FROM events";


  connection.query(events, (error, result) => {
    if (error) throw error;
    res.render("index.ejs",{calendar: calendar(year),events:result,months,year, monthName});
  });
};  

//--------------------------//

exports.getCancelAppointment= (req,res) =>{
  res.render("cancel-appointment");
}

exports.postCancelAppointment= (req, res) =>{
  const name= req.body.name;

  const sql= `DELETE FROM events WHERE title='${name}'`;
  connection.query(sql,(err, result)=>{
    if(err) throw err;
    res.redirect("/");
  })
}