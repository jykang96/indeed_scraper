from flask import Flask, render_template, request, redirect, url_for
import csv
from bs4 import BeautifulSoup
import requests
from datetime import datetime
import time
import random
import json

app = Flask(__name__)


dummy = [('Sales Representative, Fabric Digital Services', 'Fabric Inc.', 'Toronto, ON', '30+ days ago', '2021-06-10', 'Reports to: Head of Fabric Digital Services. This is showcased in our products that rely on microservices, APIs, and easy integrations, and in our globally…', '', 'https://ca.indeed.com/rc/clk?jk=294eeb428427cb4e&fccid=83986ff6edcf112e&vjs=3'),
         ('Senior Sales Representative', 'Food Decision Software', 'Richmond Hill, ON', '30+ days ago', '2021-06-10', 'Through a long history of success, strong brand awareness, and effective social media marketing we have a large target list of accounts ready for sales…', '', 'https://ca.indeed.com/rc/clk?jk=e001ff959f4178fa&fccid=b66de16a7a2e9d96&vjs=3')]


# class JobData(db.Model):
#     __tablename__ = 'job data'
#     id = db.Column(db.Integer, primary_key=True)
#     job_title = db.Column(db.String(200))
#     company_name = db.Column(db.String(200))
#     job_location = db.Column(db.String(200))
#     post_date = db.Column(db.Text())
#     salary_show = db.Column(db.String(200))

#     def __init__(self, job_title, company_name, job_location, post_date, salary_show):
#         self.job_title = job_title
#         self.company_name = company_name
#         self.job_location = job_location
#         self.post_date = post_date
#         self.salary_show = salary_show


@app.route('/')
def index():
    return render_template('index.html')


# @app.route('/submit', methods=["GET", "POST"])
# def submit():
#     if request.method == "POST":
#         position = request.form['position']
#         city = request.form['city']
#         province = request.form['province']
#         region = request.form['region']
#         location = '{}-{}'
#         location = location.format(city, province)
#         jobs = main(position, location, region)
#         data = {
#             "jobs": jobs
#         }
#         print(data)
#         if position == '' or city == '':
#             return render_template('index.html', message='Please enter required fields')
#         return data

@app.route('/submit', methods=["GET", "POST"])
def submit():
    if request.method == "POST":
        position = request.form['position']
        city = request.form['city']
        province = request.form['province']
        region = request.form['region']
        if position == '' or city == '' or province == '':
            return render_template('index.html', message='Please enter all required fields')
        else:
            location = '{}-{}'
            location = location.format(city, province)
            jobs = main(position, location, region)
            print(len(jobs))
            data = json.dumps(jobs)
            return render_template('chart.html', data=data, location=location, position=position)


def main(position, location, region):
    records = []
    url = get_url(position, location, region)
    print(url)
    while True:
        time.sleep(1)
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        cards = soup.find_all('div', 'jobsearch-SerpJobCard')
        for card in cards:
            record = get_record(card, region)
            records.append(record)
        time.sleep(random.randint(2, 4))
        if region == 'Canada':
            try:
                url = 'https://ca.indeed.com' + \
                    soup.find('a', {'aria-label': 'Next'}).get('href')
            except AttributeError:
                break
        else:
            try:
                url = 'https://www.indeed.com' + \
                    soup.find('a', {'aria-label': 'Next'}).get('href')
            except AttributeError:
                break
    return records


def get_record(card, region):
    job_title = card.h2.a.get('title').replace("'", "")
    company_name = card.find('span', 'company').text.strip().replace("'", "")
    job_location = card.find('div', 'recJobLoc').get(
        'data-rc-loc').replace("'", "")
    post_date = card.find('span', 'date').text.replace("'", "")
    #today = datetime.today().strftime('%Y-%m-%d')
    #job_summary = card.find('div', 'summary').text.strip().replace('\n', ' ')

    # if region == 'Canada':
    #     # canadian
    #     job_url = 'https://ca.indeed.com' + card.h2.a.get('href')
    # else:
    #     # usa
    #     job_url = 'https://www.indeed.com' + card.h2.a.get('href')

    # salary_show will have a boolean value based on if span tag with salaryText class was found or not.
    salary_show = card.find('span', 'salaryText')
    # if its found
    if salary_show:
        salary = salary_show.text.strip()
    else:
        # if salary is not found...
        salary = ''
    # record = (job_title, company_name, job_location,
    #           post_date, today, job_summary, salary, job_url)
    record = {
        "job_title": job_title,
        "company_name": company_name,
        "job_location": job_location,
        "post_date": post_date,
        "salary": salary
    }
    return record


def get_url(position, location, region):
    # This is where you generate a url from position and location
    if region == 'Canada':
        # Below is a template for Canada
        template = 'https://ca.indeed.com/jobs?q={}&l={}&radius=0'
    else:
        # Below is a template for America
        template = 'https://www.indeed.com/jobs?q={}&l={}&radius=0'

    position = position.replace(' ', '+')
    location = location.replace(' ', '+')
    url = template.format(position, location)
    return url


if __name__ == '__main__':
    app.run()
