from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy() 

class User(db.Model): 
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email_address = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    creation_date = db.Column(db.DateTime, nullable=False)

    #* Create a one-to-many relationship with Timesheet
    timesheets = db.relationship("Timesheet", backref="user", lazy=True)

class Timesheet(db.Model): 
    __tablename__ = "timesheets"
    id = db.Column(db.Integer, primary_key=True)
    title_name = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)

    #* Create a one-to-many relationship with TimesheetItem
    timesheet_items = db.relationship("TimesheetItems", backref="timesheet", lazy=True)

class TimesheetItem(db.Model): 
    __tablename__ = "timesheet_items" 
    id = db.Column(db.Integer, primary_key=True)
    timesheet_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    minute_field = db.Column(db.Integer, nullable=False)
    description_field = db.Column(db.String, nullable=True)

