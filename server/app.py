from flask import Flask
from model import db, User, Timesheet, TimesheetItem

app = Flask(__name__)

#**** Using sqlite for development then migrating to Postgres at a later time 
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///storage.sqlite3"
app.config['SQLAlCHEMY_TRACK_MODIFICATIONS'] = False 

db.init_app(app)

if __name__ == "__main__": 
    #**** Remove the debug and port parameters in prod
    app.run(debug=True, port=5500)