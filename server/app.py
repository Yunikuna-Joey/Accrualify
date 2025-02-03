from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_migrate import Migrate
from model import db, User, Timesheet, TimesheetItem
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required

from dateutil import parser         #* used for parsing isoformat time objects 
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, resources= { 
    r"/api/*": {
        "origins": ["https://main.d2k8f1eh98wgtw.amplifyapp.com/", "https://main.d2k8f1eh98wgtw.amplifyapp.com"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
    }
})

#**** Using sqlite for development then migrating to Postgres at a later time 
# app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///storage.sqlite3"
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DB_URL")
app.config['SQLAlCHEMY_TRACK_MODIFICATIONS'] = False 

db.init_app(app)
Migrate(app, db)

app.config['JWT_SECRET_KEY'] = os.environ.get('TOKEN_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
jwt = JWTManager(app)

#* Test landing page for prod, official release can be removed 
@app.route("/")
@cross_origin(origins="*")
def load_home_page(): 
    return "Welcome to TimeHero!"

@app.route("/api/current-user", methods=["GET"])
@jwt_required()
def load_current_user():
    try:
        # Parse the username from the front-end token 
        current_user_username = get_jwt_identity()

        user = User.query.filter_by(username=current_user_username).first()

        return jsonify({
            "id": user.id
        }), 201
    
    except Exception as e: 
        return jsonify({ "error": f"Unable to return current user {e}"}), 401

@app.route("/api/signup", methods=["POST"])
def create_user():
    try: 
        # Data should have username, email, password_hash
        data = request.get_json()

        # Conditional to see if username already exists
        if User.query.filter_by(username=data["username"]).first(): 
            return jsonify({ "error": "Username already exists"}), 400  
        
        # Conditional to check if email already exists  
        if User.query.filter_by(email_address=data["email_address"]).first(): 
            return jsonify({ "error": "Email address is already in-use!"}), 400 

        new_user = User(
            username=data.get("username").strip(), 
            email_address=data.get("email_address").strip(),
            password_hash=generate_password_hash(data.get("password")), 
            creation_date=datetime.utcnow()
        )   

        db.session.add(new_user)
        db.session.commit()

        return jsonify({ "message": "User created successfully"}), 201
    
    except Exception as e: 
        return jsonify({ "error": f"{e}"}), 400
    
@app.route('/api/login', methods=["POST"])
def login(): 
    try: 
        data = request.get_json()
        
        # Look up User from credentials
        received_user = User.query.filter_by(email_address=data.get("email_address").strip()).first()

        # Conditional for checking the email and password for an user    
        if not check_password_hash(received_user.password_hash, data.get("password_hash")) or not received_user: 
            return jsonify({ "error": "Incorrect email/password" }), 403
        
        # Upon successful credentials, create a auth token for session
        user_access_token = create_access_token(identity=received_user.username)

        return jsonify({ "token": user_access_token}), 201

    except Exception as e: 
        return jsonify({ "error": f"{e}"}), 403
    
@app.route('/api/save-timesheet', methods=["POST"])
@jwt_required() 
def saveTimesheet(): 
    try: 
        data = request.get_json()

        # Save the timesheet object so we can get the timesheet_id
        timesheet_data = data.get("timesheet")
        
        new_timesheet_object = Timesheet(
            title_name=timesheet_data.get("title_name"),
            user_id=timesheet_data.get("user_id")
        )

        db.session.add(new_timesheet_object)
        db.session.commit()

        # Save the line items 
        line_item_data = data.get("lineItems")
        for item in line_item_data: 
            new_item = TimesheetItem(
                timesheet_id=new_timesheet_object.id,
                date=parser.parse(item.get('date')), 
                minute_field=item.get("minute_field"), 
                description_field=item.get("description_field")
            )
            db.session.add(new_item)
        
        db.session.commit()

        return jsonify({ "message": "Timesheet and items saved success! "}), 201 
    
    except Exception as e: 
        return jsonify({ "error": f"Error deleting the timesheet: {e}"})

@app.route("/api/get-timesheet-object/<int:timesheet_id>", methods=["GET"])
@jwt_required()
def get_timecard_object(timesheet_id):
    try: 
        timesheetObject = Timesheet.query.filter_by(id=timesheet_id).first()
        
        hashObject = { 
            "title_name": timesheetObject.title_name,
            "user_id": timesheetObject.user_id
        }

        return jsonify(hashObject), 200
    
    except Exception as e: 
        return jsonify({ "error": f"Error deleting the timesheet: {e}"})

@app.route("/api/get-timecard-list/<int:user_id>", methods=["GET"])
@jwt_required()
def get_timecard_list(user_id): 
    try: 
        # Create query to grab all of the timesheets associated with user_id
        query = Timesheet.query.filter_by(user_id=user_id)

        timesheet_data = [{
            "id": timesheet.id,
            "title_name": timesheet.title_name
        } for timesheet in query]

        return jsonify(timesheet_data), 200

    except Exception as e: 
        return jsonify({ "error": f"There was an error grabbing timesheet(s) {e}"}), 404

@app.route("/api/get-timesheet-items/<int:timesheet_id>", methods=["GET"])
@jwt_required()
def get_line_items(timesheet_id): 
    try: 
        line_items = TimesheetItem.query.filter_by(timesheet_id=timesheet_id).all()

        line_items_data = [{
            "id": line_item.id,
            "date": line_item.date,
            "minute_field": line_item.minute_field,
            "description_field": line_item.description_field
        } for line_item in line_items]

        return jsonify(line_items_data), 200
    
    except Exception as e: 
        return jsonify({ "error": f"Error deleting the timesheet: {e}"})

@app.route("/api/save-edit-timesheet", methods=["PUT"])
@jwt_required()
def save_edit_timesheet(): 
    try: 
        data = request.get_json()

        timesheet_data = data.get("timesheet")

        # Grab the existing timesheet 
        timesheet = Timesheet.query.get(timesheet_data.get("id"))

        timesheet.title_name = timesheet_data.get("title_name")
        
        # Deletes the existing line-items
        TimesheetItem.query.filter_by(timesheet_id=timesheet_data.get("id")).delete()

        line_items = data.get("lineItems")
        for item in line_items: 
            new_item = TimesheetItem(
                timesheet_id=timesheet_data.get("id"),
                date=parser.parse(item.get("date")),
                minute_field=item.get("minute_field"),
                description_field=item.get("description_field")
            )
            db.session.add(new_item)
        db.session.commit()

        return jsonify({ "message": "Timesheet updated success"}), 201
    
    except Exception as e: 
        return jsonify({ "error": f"Error deleting the timesheet: {e}"})

@app.route("/api/delete-timesheet/<int:timesheet_id>", methods=["DELETE"])
@jwt_required()
def delete_timesheet(timesheet_id): 
    try:
        timesheet_object = Timesheet.query.get(timesheet_id)

        # Delete the entries that follow the timesheet object 
        TimesheetItem.query.filter_by(timesheet_id=timesheet_id).delete()

        db.session.delete(timesheet_object)
        db.session.commit()

        return jsonify({ "message": "Timesheet deleted success"}), 200
    
    except Exception as e: 
        db.session.rollback()
        return jsonify({ "error": f"Error deleting the timesheet: {e}"}), 400

if __name__ == "__main__": 
    with app.app_context():
        db.create_all() 

    #***** Remove the debug and port parameters in prod
    # app.run(debug=True, port=5500)


    app.run()