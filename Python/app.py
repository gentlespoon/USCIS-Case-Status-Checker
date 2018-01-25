import datetime
import string
# import sqlite3
from time import sleep
from urllib import request, parse

time = ""
db = ""

def CISquery(caseId):
  # prepare data for post query
  postDict = {}
  postDict['appReceiptNum'] = caseId
  data = parse.urlencode(postDict).encode()
  # print(data)

  # local dev test
  # resp = ""
  # url = 'http://localhost/YSC1890044628.html' 
  
  # real url
  url = 'https://egov.uscis.gov/casestatus/mycasestatus.do' 
  
  req =  request.Request(url, data=data)
  resp = request.urlopen(req).read().decode('utf-8')


  # extract interested part
  start = resp.find('<h1>')
  end = resp.find('</p>', start) +4
  body = (resp[start:end])


  title = body[body.find('<h1>')+4:body.find('</h1>')]
  # I dont care about the error case content
  p = body[body.find('<p>')+3:body.find('</p>')]

  if title == "Card Was Mailed To Me":
    valid = 1
    formStart = p.find("I-")
    formEnd = p.find(",", formStart)
    form = p[formStart:formEnd]
    dateStart = p.find("On ")+3
    dateEnd = p.find(", we mailed")
    date = p[dateStart:dateEnd]


  elif title == "Case Was Received":
    valid = 1
    formStart = p.find("I-")
    formEnd = p.find(",", formStart)
    form = p[formStart:formEnd]
    dateStart = p.find("On ")+3
    dateEnd = p.find(", we received", dateStart)
    date = p[dateStart:dateEnd]

    
  elif title == "":
    # invalid case id
    valid = 0
    # extract error information
    start = resp.find('<h4>')
    end = resp.find('</ul>', start) +5
    body = (resp[start:end])
    title = body[body.find('<h4>')+4:body.find('</h4>')]
    form = ""
    date = ""
    # content = body[body.find('<li>')+4:body.find('</li>')]
    # print(caseId, "  ", title)
    # print(content)
  
  else :
    form = ""
    date = ""
    
  print(caseId, "  ", form, "  ", title, "  ", date)
  # existId = db.execute("SELECT caseid from data WHERE caseid='{0}'".format(caseId))
  # print(existId.fetchone())
  
  # sql = "UPDATE data SET {0}='{1}' WHERE caseid='{2}'".format(time, title, caseId)
  # sql = "INSERT INTO data (caseid, form, valid, `{0}`) VALUES ('{1}', '{2}', '{3}', '{4}')".format(time, caseId, form, valid, title)
  # print(sql)
  # db.execute(sql)





def main():

  # get time
  now = datetime.datetime.now()
  global time
  
  time = "{0}{1}{2}_{3}{4}".format(now.year, now.month, now.day, now.hour, now.minute)

  # open database
  # try:
  #   conn = sqlite3.connect('data.db')
  # except:
  #   print("DB dead")
  #   exit()
  
  # conn.row_factory = sqlite3.Row
  # global db
  # db = conn.cursor()

  # db.execute('SELECT * FROM data LIMIT 1')
  # if column for current time does not exist,
  #   create a column with current time

  # sql = 'ALTER TABLE data ADD COLUMN \'{0}\' TEXT'.format(time)
  # db.execute(sql)
  # conn.commit()
  # print("New column \'{0}\' added".format(time))

  # since USCIS case id is in chronological order,
  #   check the previous 40k to next 40k case ids
  #   should give a rough sense of processing status
  myid = 44628
  step = 500


  base = myid - 40000
  cap = myid + 5000
  num = base

  # Potomac Service Center case id starts with YSC
  # Currently case ids are starting with 18900xxxxx
  while(num<cap):
    caseId = "YSC18900"+ str(num).rjust(5, '0')
    CISquery(caseId)
    num += step
    # limit 5 QPS to avoid IP block
    # sleep(0.2)

  # conn.commit()


if __name__ == "__main__":
  main()
else:
  print(__name__)
  