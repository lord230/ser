from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['POST'])
def process():
    # Receive the data
    data_rcv = request.json
    
    # Extracting data from received JSON
    teacher = data_rcv['teacher']
    sec = data_rcv['sec']
    periods = data_rcv['cls']

    # Convert lists to JSON strings
    tch_json = json.dumps(teacher)
    sec_json = json.dumps(sec)
    prd_json = json.dumps(periods)

    # Model part 
    genai.configure(api_key='AIzaSyDHUZ7dw1sMiS6kkY2SXSKDFWZkVgWd21U')

    # Using `response_mime_type` requires one of the Gemini 1.5 Pro or 1.5 Flash models
    model = genai.GenerativeModel('gemini-1.5-flash',
                                  # Set the `response_mime_type` to output JSON
                                  generation_config={"response_mime_type": "application/json"})

    prompt = f"""
Create an efficient timetable for an Indian school system based on the following requirements:

Number of teachers: {tch_json}
Number of sections: {sec_json}
Number of periods per day: {prd_json}
Duration: 5 days a week 
Constraints:

check that No teacher should be assigned to more than one section during the same period and assign randomly.
Each teacher should have a sufficient number of teaching periods distributed throughout the week.
The timetable should be balanced and efficient for both teachers and students.
return type should be in timetable[section][day][period]
"""


    response = model.generate_content(prompt)
    print(response.text )
    data = json.loads(response.text)

    # Create a 3D array
    timetable = []

    # Iterate over sections
    for section_key, section_value in data.items():
        section_schedule = []
        # Iterate over days
        for day_key, day_value in section_value.items():
            day_schedule = []
            # Iterate over periods
            for period_key, subject in sorted(day_value.items(), key=lambda x: int(x[0])):
                day_schedule.append(subject)
            section_schedule.append(day_schedule)
        timetable.append(section_schedule)

    # Print the 3D array
    for section_index, section in enumerate(timetable, start=1):
        print(f"Section {section_index}:")
        for day_index, day in enumerate(section, start=1):
            print(f"  Day {day_index}: {day}")
        print("-----")

    return jsonify(timetable)

if __name__ == '__main__':
    app.run(debug=True)
