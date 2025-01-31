from flask import Flask, jsonify, request
from model import db, User, Timesheet, TimesheetItem
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

app = Flask(__name__)

#**** Using sqlite for development then migrating to Postgres at a later time 
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///storage.sqlite3"
app.config['SQLAlCHEMY_TRACK_MODIFICATIONS'] = False 

db.init_app(app)

#* Test landing page for prod, official release can be removed 
@app.route("/")
def load_home_page(): 
    return "Welcome to TimeHero!"

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
            username=data.get("username"), 
            email_address=data.get("email_address"),
            password_hash=generate_password_hash(data.get("password")), 
            creation_date=datetime.timezone.utc()
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
        received_user = User.query.filter_by(email_address=data.get("email_address")).first()

        # Conditional for checking the email and password for an user    
        if not check_password_hash(received_user.password_hash, data.get("password_hash")) or not received_user: 
            return jsonify({ "error": "Incorrect email/password" }), 403
        
        # Upon successful credentials, create a auth token for session
        token = jwt.decode({ 
            "id": received_user.id,
            "exp": datetime.timezone.utcnow() + timedelta(minutes=30)
        },
        "environment_variable",
        "H256"
        )

        return jsonify({ "token": token}), 201

    except Exception as e: 
        return jsonify({ "error": f"{e}"}), 403

if __name__ == "__main__": 
    #**** Remove the debug and port parameters in prod
    app.run(debug=True, port=5500)