from flask import Flask, jsonify, request,session
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from flask_bcrypt import bcrypt
import smtplib
import bcrypt
import uuid
import string
import random
from bson.objectid import ObjectId
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def generate_password():
    characters=string.ascii_letters + string.digits + string.punctuation
    password=''.join(random.choice(characters) for i in range(12))
    salt=bcrypt.gensalt()
    hashed_password=bcrypt.hashpw(password.encode('utf-8'), salt)
    return password,hashed_password

def send_mail(original_password, email, userName):
    fromaddr = 'sit22it039@sairamtap.edu.in'
    toaddrs  = email
    username = 'sit22it039@sairamtap.edu.in'
    password = 'ewhrcsvciaiytfzx'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Welcome to Chennai Unified Metropolitan Authority"
    msg['From'] = fromaddr
    msg['To'] = toaddrs

    html = f"""\
    <html>
    <head></head>
    <body>
        <p>Dear {userName},</p>
        <p>Welcome to Chennai Unified Metropolitan Authority. We are excited to have you on board.</p>
        <p>Your password is: {original_password}</p>
        <p>If you have any questions, feel free to reach out to us.</p>
        <p>Best Regards,</p>
        <p>Your Chennai Unified Metropolitan Authority Team</p>
    </body>
    </html>
    """

    part2 = MIMEText(html, 'html')

    msg.attach(part2)

    server = smtplib.SMTP('smtp.gmail.com:587')
    server.starttls()
    server.login(username,password)
    server.sendmail(fromaddr, toaddrs, msg.as_string())
    server.quit()

# Flask application setup
app = Flask(__name__)
app.secret_key = 'ABCD'

# Enable CORS for all routes with specific origins
cors = CORS(app, resources={r"/*": {"origins": "*"}})
# bcrypt = bcrypt(app)

# MongoDB configuration for local instance
uri = "mongodb://localhost:27017/"

# Database and collection names
DB_NAME = 'testdb'
COLLECTION_NAME = 'signal'
COLLECTION_NAME_USERS='users'

# Database connection setup
client = MongoClient(uri)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]
user_collection = db[COLLECTION_NAME_USERS]

# Route to fetch all data from the 'ega' collection
@app.route('/WholeData', methods=['GET'])
def get_signals():
    try:
        rows = list(collection.find({}, {'_id': 0}))  # Exclude the MongoDB internal _id field
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to fetch data from a specific location for a whole month
@app.route('/specificWholeData', methods=['GET'])
def get_specific_whole_data():
    location = request.args.get('location')

    if not location:
        return jsonify({'error': 'Location parameter is required'}), 400

    try:
        rows = list(collection.find({'area': location}, {'_id': 0}))
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to fetch data from a specific location for today
@app.route('/today_data', methods=['GET'])
def get_today_data():
    location = request.args.get('location')

    if not location:
        return jsonify({'error': 'Location parameter is required'}), 400

    try:
        today_date = datetime.utcnow().date()
        rows = list(collection.find({
            'area': location,
            'timestamp': {
                '$gte': datetime(today_date.year, today_date.month, today_date.day),
                '$lt': datetime(today_date.year, today_date.month, today_date.day) + timedelta(days=1)
            }
        }, {'_id': 0}))
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
#working today data
@app.route('/today', methods=['GET'])  # Change endpoint to /today_data
def get_data():
    location = request.args.get('location')

    if not location:
        return jsonify({'error': 'Location parameter is required'}), 400

    try:
        today_date = datetime.utcnow().date()
        start_of_today = datetime(today_date.year, today_date.month, today_date.day)
        start_of_tomorrow = start_of_today + timedelta(days=1)

        rows = list(collection.find({
            'area': location,
            '$expr': {
                '$and': [
                    {'$gte': [{'$dateFromString': {'dateString': '$timestamp'}}, start_of_today]},
                    {'$lt': [{'$dateFromString': {'dateString': '$timestamp'}}, start_of_tomorrow]}
                ]
            }
        }, {'_id': 0}))

        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



#orginal
@app.route('/yesterday_data', methods=['GET'])
def get_yesterday_data():
    location = request.args.get('location')

    if not location:
        return jsonify({'error': 'Location parameter is required'}), 400

    try:
        yesterday_date = datetime.utcnow().date() - timedelta(days=1)
        rows = list(collection.find({
            'area': location,
            'timestamp': {
                '$gte': datetime(yesterday_date.year, yesterday_date.month, yesterday_date.day),
                '$lt': datetime(yesterday_date.year, yesterday_date.month, yesterday_date.day) + timedelta(days=1)
            }
        }, {'_id': 0}))
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#working for yesterday

@app.route('/yesterdaydata', methods=['GET'])
def get_yesterday():
    location = request.args.get('location')

    if not location:
        return jsonify({'error': 'Location parameter is required'}), 400

    try:
        yesterday_date = datetime.utcnow().date() - timedelta(days=1)
        start_of_yesterday = datetime(yesterday_date.year, yesterday_date.month, yesterday_date.day)
        start_of_today = start_of_yesterday + timedelta(days=1)

        rows = list(collection.find({
            'area': location,
            '$expr': {
                '$and': [
                    {'$gte': [{'$dateFromString': {'dateString': '$timestamp'}}, start_of_yesterday]},
                    {'$lt': [{'$dateFromString': {'dateString': '$timestamp'}}, start_of_today]}
                ]
            }
        }, {'_id': 0}))

        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/specific_data', methods=['GET'])
def get_specific_data():
    location = request.args.get('location','Ega Theatre 10')
    # print(location)
    # location=location.replace(' ','_')
    start_datetime_str = request.args.get('startDateTime')
    end_datetime_str = request.args.get('endDateTime')
    interval_str = request.args.get('interval','5T')  # Default to 5 minutes if not provided
    yesterday_data = request.args.get('yesterday_data')

    if not start_datetime_str:
        start_datetime_str = datetime.today().strftime('%Y-%m-%dT00:00')
    if not end_datetime_str:
        end_datetime_str = datetime.today().strftime('%Y-%m-%dT23:59')
    
    try:
        start_datetime = datetime.strptime(start_datetime_str, '%Y-%m-%dT%H:%M')
        end_datetime = datetime.strptime(end_datetime_str, '%Y-%m-%dT%H:%M')

        if yesterday_data and yesterday_data.lower() == 'true':
            start_datetime -= timedelta(days=1)
            end_datetime -= timedelta(days=1)
        start_datetime = start_datetime.strftime("%d-%m-%Y %H:%M:%S")
        end_datetime = end_datetime.strftime("%d-%m-%Y %H:%M:%S")
        # print(start_datetime,end_datetime)
        query = {
            'area': location,
            'timestamp': {'$gte': start_datetime, '$lte': end_datetime}
        }
        # print(query)
        # Define the projection to include specific fields
        # projection = {
        #     '_id':1,
        #     'timestamp': 1,
        #     'auto': 1,
        #     'bus': 1,
        #     'car': 1,
        #     'lcv': 1,
        #     'motorbike': 1,
        #     'truck': 1,
        #     'area': 1
        # }
        rows = list(collection.find(query))
        # for i in rows[0:5]:
        #     print(type(i))
        # data = rows
        # print(rows)
        if not rows:
            return jsonify([])

        df = pd.DataFrame.from_dict(rows)
        df=df[['timestamp','auto','bus','car','lcv','motorbike','truck','area']]
        # print(df.head(5))
        df['timestamp'] = pd.to_datetime(df['timestamp'], format="%d-%m-%Y %H:%M")
        # print("interval_str", interval_str)
        if interval_str == '5T':
            print("5T")
            df.set_index('timestamp', inplace=True)
            df_combined = df.resample(interval_str, label='right', closed='right').sum()
            df_combined['area'] = df['area'].resample(interval_str, label='right', closed='right').first()
            df_combined.reset_index(inplace=True)
            result = df_combined.to_dict(orient='records')
            # print(result)
        elif interval_str == '15T':
            print("15T")
            df.set_index('timestamp', inplace=True)
            df_combined = df.resample(interval_str, label='right', closed='right').sum()
            df_combined['area'] = df['area'].resample(interval_str, label='right', closed='right').first()
            df_combined.reset_index(inplace=True)
            result = df_combined.to_dict(orient='records')
        elif interval_str == 'H':
            print("H")
            df.set_index('timestamp', inplace=True)
            df_combined = df.resample(interval_str, label='right', closed='right').sum()
            df_combined['area'] = df['area'].resample(interval_str, label='right', closed='right').first()
            df_combined.reset_index(inplace=True)
            result = df_combined.to_dict(orient='records')
        elif interval_str == 'D':
            print("D")
            df.set_index('timestamp', inplace=True)
            df_combined = df.resample(interval_str, label='right', closed='right').sum()
            df_combined['area'] = df['area'].resample(interval_str, label='right', closed='right').first()
            df_combined.reset_index(inplace=True)
            result = df_combined.to_dict(orient='records')
        else:
            print('else')
            result = df.to_dict(orient='records')
            # print(result)

        for record in result:
            for key, value in record.items():
                if isinstance(value, pd.Timestamp):
                    record[key] = value.to_pydatetime().isoformat()
                elif isinstance(value, (np.int64, np.float64)):
                    record[key] = value.item()
        # print("result", type(result))
        return jsonify(result)
    except (ValueError, Exception) as e:
        return jsonify({"error": str(e)}), 500
    

#It contain today and yesterday total count
@app.route('/data', methods=['GET'])
def get_total_today_yesterday_data():
    location = request.args.get('location')

    # Define date ranges for yesterday and today
    now = datetime.now()
    start_of_today = datetime(now.year, now.month, now.day)
    end_of_today = start_of_today + timedelta(days=1)
    start_of_yesterday = start_of_today - timedelta(days=1)
    end_of_yesterday = start_of_today

    # Define the pipelines
    pipeline_yesterday = [
        {
            '$match': {
                'area': location,
                '$expr': {
                    '$and': [
                        {'$gte': [{'$dateFromString': {'dateString': '$timestamp'}}, start_of_yesterday]},
                        {'$lt': [{'$dateFromString': {'dateString': '$timestamp'}}, end_of_yesterday]}
                    ]
                }
            }
        },
        {
            '$group': {
                '_id': {
                    'year': {'$year': {'$dateFromString': {'dateString': '$timestamp'}}},
                    'month': {'$month': {'$dateFromString': {'dateString': '$timestamp'}}},
                    'day': {'$dayOfMonth': {'$dateFromString': {'dateString': '$timestamp'}}},
                    'hour': {'$hour': {'$dateFromString': {'dateString': '$timestamp'}}}
                },
                'total': {
                    '$sum': {
                        '$add': ['$car', '$lcv', '$motorbike', '$truck', '$auto', '$bus']
                    }
                }
            }
        },
        {
            '$sort': {'_id': 1}  # Sort by year, month, day, hour
        },
        {
            '$project': {
                '_id': 0,
                'timestamp': {
                    '$dateToString': {
                        'format': '%Y-%m-%d %H:%M:%S',
                        'date': {
                            '$dateFromParts': {
                                'year': '$_id.year',
                                'month': '$_id.month',
                                'day': '$_id.day',
                                'hour': '$_id.hour'
                            }
                        }
                    }
                },
                'total': 1
            }
        }
    ]

    pipeline_today = [
        {
            '$match': {
                'area': location,
                '$expr': {
                    '$and': [
                        {'$gte': [{'$dateFromString': {'dateString': '$timestamp'}}, start_of_today]},
                        {'$lt': [{'$dateFromString': {'dateString': '$timestamp'}}, end_of_today]}
                    ]
                }
            }
        },
        {
            '$group': {
                '_id': {
                    'year': {'$year': {'$dateFromString': {'dateString': '$timestamp'}}},
                    'month': {'$month': {'$dateFromString': {'dateString': '$timestamp'}}},
                    'day': {'$dayOfMonth': {'$dateFromString': {'dateString': '$timestamp'}}},
                    'hour': {'$hour': {'$dateFromString': {'dateString': '$timestamp'}}}
                },
                'total': {
                    '$sum': {
                        '$add': ['$car', '$lcv', '$motorbike', '$truck', '$auto', '$bus']
                    }
                }
            }
        },
        {
            '$sort': {'_id': 1}  # Sort by year, month, day, hour
        },
        {
            '$project': {
                '_id': 0,
                'timestamp': {
                    '$dateToString': {
                        'format': '%Y-%m-%d %H:%M:%S',
                        'date': {
                            '$dateFromParts': {
                                'year': '$_id.year',
                                'month': '$_id.month',
                                'day': '$_id.day',
                                'hour': '$_id.hour'
                            }
                        }
                    }
                },
                'total': 1
            }
        }
    ]

    # Execute the pipelines
    result_yesterday = list(collection.aggregate(pipeline_yesterday))
    result_today = list(collection.aggregate(pipeline_today))

    # Combine the results and filter out entries with zero totals
    combined_results = [] 
    for y, t in zip(result_yesterday, result_today):
        if y['total'] != 0 and t['total'] != 0:
            combined_results.append({
                "yestrdaytimestamp": y['timestamp'],
                "todaytimestamp": t['timestamp'],
                "yestrdaytotal": y['total'],
                "todaytotal": t['total']
            })

    return jsonify(combined_results)

@app.route('/total', methods=['GET'])
def get_total_data():
    location = request.args.get('location', 'Ega_Theatre_10')  # Ensure consistent format with the database
    start_datetime_str = request.args.get('startDateTime')
    end_datetime_str = request.args.get('endDateTime')
    interval_str = request.args.get('interval', 'H')  # Default to hourly if not provided
    yesterday_data = request.args.get('yesterday_data')
    include_totals = request.args.get('totals', 'false').lower() == 'true'

    if not start_datetime_str:
        start_datetime_str = datetime.today().strftime('%Y-%m-%dT00:00')
    if not end_datetime_str:
        end_datetime_str = datetime.today().strftime('%Y-%m-%dT23:59')

    try:
        start_datetime = datetime.strptime(start_datetime_str, '%Y-%m-%dT%H:%M')
        end_datetime = datetime.strptime(end_datetime_str, '%Y-%m-%dT%H:%M')

        if yesterday_data and yesterday_data.lower() == 'true':
            start_datetime -= timedelta(days=1)
            end_datetime -= timedelta(days=1)

        # Convert the query datetime to the required format
        query = {
            'area': location,
            'timestamp': {'$gte': start_datetime.strftime("%d-%m-%Y %H:%M"), '$lte': end_datetime.strftime("%d-%m-%Y %H:%M")}
        }

        rows = list(collection.find(query))

        if not rows:
            return jsonify([])

        df = pd.DataFrame.from_dict(rows)
        df = df[['timestamp', 'auto', 'bus', 'car', 'lcv', 'motorbike', 'truck', 'area']]
        df['timestamp'] = pd.to_datetime(df['timestamp'], format="%d-%m-%Y %H:%M")

        if include_totals:
            # Calculate combined total
            df['total'] = df[['auto', 'bus', 'car', 'lcv', 'motorbike', 'truck']].sum(axis=1)

        df.set_index('timestamp', inplace=True)
        df_combined = df.resample(interval_str, label='right', closed='right').sum()
        df_combined['area'] = df['area'].resample(interval_str, label='right', closed='right').first()
        df_combined.reset_index(inplace=True)

        result = df_combined.to_dict(orient='records')

        # Convert Timestamp objects to string format
        for record in result:
            record['timestamp'] = record['timestamp'].strftime("%d-%m-%Y %H:%M")  # Convert timestamp to desired format
            if include_totals:
                record['total'] = int(record['total'])  # Convert total to integer

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    



@app.route('/totals', methods=['GET'])
def get_totals_data():
    location = request.args.get('location', 'Ega_Theatre_10')  # Ensure consistent format with the database
    start_datetime_str = request.args.get('startDateTime')
    end_datetime_str = request.args.get('endDateTime')
    interval_str = request.args.get('interval', 'H')  # Default to hourly if not provided
    include_totals = request.args.get('totals', 'false').lower() == 'true'

    try:
        current_time = datetime.now()
        if not start_datetime_str:
            start_datetime = current_time.replace(hour=0, minute=0, second=0, microsecond=0)
        else:
            start_datetime = datetime.strptime(start_datetime_str, '%Y-%m-%dT%H:%M')
        
        if not end_datetime_str:
            end_datetime = current_time
        else:
            end_datetime = datetime.strptime(end_datetime_str, '%Y-%m-%dT%H:%M')

        # Convert the query datetime to the required format
        query = {
            'area': location,
            'timestamp': {'$gte': start_datetime.strftime("%d-%m-%Y %H:%M"), '$lte': end_datetime.strftime("%d-%m-%Y %H:%M")}
        }

        print("MongoDB Query:", query)  # Log the query to check its correctness

        rows = list(collection.find(query))

        if not rows:
            print("No records found for the query")
            return jsonify([])

        # Print the actual rows returned for debugging
        print("Rows returned from MongoDB:", rows)

        df = pd.DataFrame.from_dict(rows)
        df = df[['timestamp', 'auto', 'bus', 'car', 'lcv', 'motorbike', 'truck', 'area']]
        df['timestamp'] = pd.to_datetime(df['timestamp'], format="%d-%m-%Y %H:%M")

        if include_totals:
            # Calculate combined total
            df['total'] = df[['auto', 'bus', 'car', 'lcv', 'motorbike', 'truck']].sum(axis=1)

        df.set_index('timestamp', inplace=True)
        df_combined = df.resample(interval_str, label='right', closed='right').sum()
        df_combined['area'] = df['area'].resample(interval_str, label='right', closed='right').first()
        df_combined.reset_index(inplace=True)

        result = df_combined.to_dict(orient='records')

        # Convert Timestamp objects to string format
        for record in result:
            record['timestamp'] = record['timestamp'].strftime("%d-%m-%Y %H:%M")  # Convert timestamp to desired format
            if include_totals:
                record['total'] = int(record['total'])  # Convert total to integer

        # Calculate totals for today up to the current time and the same period for yesterday
        today_start = current_time.replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = current_time
        yesterday_start = today_start - timedelta(days=1)
        yesterday_end = today_end - timedelta(days=1)

        today_query = {
            'area': location,
            'timestamp': {'$gte': today_start.strftime("%d-%m-%Y %H:%M"), '$lte': today_end.strftime("%d-%m-%Y %H:%M")}
        }

        yesterday_query = {
            'area': location,
            'timestamp': {'$gte': yesterday_start.strftime("%d-%m-%Y %H:%M"), '$lte': yesterday_end.strftime("%d-%m-%Y %H:%M")}
        }

        print("Today Query:", today_query)  # Log the today query
        print("Yesterday Query:", yesterday_query)  # Log the yesterday query

        today_rows = list(collection.find(today_query))
        yesterday_rows = list(collection.find(yesterday_query))

        if today_rows:
            today_df = pd.DataFrame.from_dict(today_rows)
            today_df['timestamp'] = pd.to_datetime(today_df['timestamp'], format="%d-%m-%Y %H:%M")
            if include_totals:
                today_total = today_df[['auto', 'bus', 'car', 'lcv', 'motorbike', 'truck']].sum(axis=1).sum()
            else:
                today_total = 0
        else:
            today_total = 0

        if yesterday_rows:
            yesterday_df = pd.DataFrame.from_dict(yesterday_rows)
            yesterday_df['timestamp'] = pd.to_datetime(yesterday_df['timestamp'], format="%d-%m-%Y %H:%M")
            if include_totals:
                yesterday_total = yesterday_df[['auto', 'bus', 'car', 'lcv', 'motorbike', 'truck']].sum(axis=1).sum()
            else:
                yesterday_total = 0
        else:
            yesterday_total = 0

        result.append({
            'timestamp': 'Total',
            'today_total': int(today_total),
            'yesterday_total': int(yesterday_total)
        })

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500





@app.route('/areas', methods=['GET'])
def get_areas():
    try:
        query = request.args.get('q', '')
        areas = collection.distinct('area', {'area': {'$regex': query, '$options': 'i'}})
        return jsonify(areas[:10])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/allAreasWithLocation', methods=['GET'])
def get_all_areas_with_location():
    try:
        pipeline = [
            {
                '$group': {
                    '_id': {
                        'area': '$area',
                        'latitiude': '$latitiude',
                        'Longitude': '$Longitude'
                    }
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'area': '$_id.area',
                    'latitiude': '$_id.latitiude',
                    'Longitude': '$_id.Longitude'
                }
            }
        ]

        areas = list(collection.aggregate(pipeline))
        return jsonify(areas)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/register',methods=['post'])
def register():
    data=request.json
    print("data",data)
    firstName = data.get('firstName')
    lastName=data.get('lastName')
    gender=data.get('gender')
    userName=data.get('userName')
    email=data.get('email')
    mobile=data.get('mobile')
    age=data.get('age')
    if not firstName or not lastName or not gender or not userName  or not email or not mobile or not age:
        return jsonify({'error':'missing data'}),400

    # hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    original_password,hashed_password=generate_password()
    print('original_password',original_password)
    print('hashed_password',hashed_password)

    

    user={
        # 'id':user_id,
        'firstName':firstName,
        'lastName':lastName,
        'gender':gender,
        'userName':userName,
        'password':hashed_password.decode('utf-8'),
        'email':email,
        'mobile':mobile,
        'age':age,
        'role':'user',                                                      
        'isChangedPassword': False
    }

    user_collection.insert_one(user)
    send_mail(original_password,email,userName)
    print("mail send success")
    return jsonify ({'message':'user registered success'} ),201


@app.route('/change_password', methods=['POST'])
def change_password():
    data = request.json
    oldPassword = data.get('oldPassword')
    newPassword = data.get('newPassword')
    confirmPassword = data.get('confirmPassword')
    _id = data.get('id')
    
    if not oldPassword or not newPassword or not confirmPassword or not _id:
        return jsonify({'error': 'Missing data'}), 400
    
    if newPassword != confirmPassword:
        return jsonify({'error': 'New password and confirmation do not match'}), 400

    try:
        user_id = ObjectId(_id)
    except Exception as e:
        return jsonify({'error': 'Invalid user ID'}), 400

    query = {'_id': user_id}
    user = user_collection.find_one(query)

    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    old_hashed_password = user.get('password')
    
    if not bcrypt.checkpw(oldPassword.encode('utf-8'), old_hashed_password.encode('utf-8')):
        return jsonify({'error': 'Old password does not match'}), 400
    
    new_hashed_password = bcrypt.hashpw(newPassword.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    update_result = user_collection.update_one(query, {'$set': {'password': new_hashed_password}})
    
    if update_result.modified_count > 0:
        return jsonify({'message': 'Password changed successfully'}), 200
    else:
        return jsonify({'error': 'Password change failed'}), 400


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    userName = data.get('userName')
    password = data.get('password')

    if not userName or not password:
        return jsonify({'error': 'Missing username or password'}), 400
    
    user = user_collection.find_one({'userName': userName})
    password_db=user.get('password')
    print('pass from db',password_db)
    print('pass from user',password)
    # print('pass from ui after encode', bcrypt(password.encode('utf-8')))


    if user is None:
        return jsonify({'error': 'User not found'}), 404

    session_id = str(uuid.uuid4())
    session['session_id'] = session_id
    session['user'] = userName


    if bcrypt.checkpw(password.encode('utf-8'),password_db.encode('utf-8')):
    # if password == password_db:
        print("hit in the login-------------------------------------------")
        return jsonify({
            'message': 'Login successful',
            'id': user.get('id'),  # Use get to avoid KeyError
            'session': session_id,
            'role': user.get('role')  # Use get to avoid KeyError
        }), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401
    


@app.route('/get_user_data', methods=['GET'])
def get_user_data():
    try:
        user_name = request.args.get('user_name')  # Get the user_name from query parameters
        
        if user_name:
            # If user_name is provided, return the specific user document
            user_data = user_collection.find_one({"userName": user_name}, {"password": 0})
            if user_data:
                user_data['_id'] = str(user_data['_id'])
                return jsonify(user_data)
            else:
                return jsonify({"error": "User not found"}), 404
        else:
            # If user_name is not provided, return all user documents
            user_data = user_collection.find({}, {"password": 0})
            user_list = list(user_data)
            # Convert ObjectId to string
            for user in user_list:
                user['_id'] = str(user['_id'])
            return jsonify(user_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@app.route('/delete_user/<id>',methods=["DELETE"])
def delete_user(id):
    try:
        result=user_collection.delete_one({'_id':ObjectId(id)})
        if result.deleted_count > 0:
            return jsonify({'message': 'Row deleted successfully'}), 200
        else:
            return jsonify({'message': 'Row not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/forgot_password', methods=['PUT'])
def forgot_password():
    data = request.json
    email = data.get('email')
    username=data.get('username')
    print('email',email)
    print('username',username)
    if not email:
        return jsonify({'error': 'Missing email'}), 400
    if not username:
        return jsonify({'error': 'Missing username'}), 400
    user = user_collection.find_one({'email': email, 'userName': username})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    original_password,hashed_password=generate_password()
    send_mail(original_password,email,username)

    result = user_collection.update_one(
        {'email': email, 'userName': username},
        {'$set': {'password': hashed_password.decode('utf-8')}}
    )

    if result.modified_count == 1:
        return jsonify({'message': 'Password has been updated successfully'}), 200
    else:
        return jsonify({'error': 'Failed to update password'}), 500

    


    




# Running the application
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    

