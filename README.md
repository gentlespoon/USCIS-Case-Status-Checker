# EAD-AutoQuery

* **Work In Progress!**

## OPT I-765 Processing Time

Students under the F-1 visa usually apply for Optional Practical Training (OPT) to get work authorization from US Citizenship and Immigration Services (USCIS). It is also the ultimate test of one’s patience. One would have to wait up to 90 days for the authorization approval. What makes this wait worse is the lack of updates during the wait. When one applies for OPT (and the application is received by USCIS), one gets a receipt number. Using this receipt number to check one’s progress (at https://egov.uscis.gov/casestatus/mycasestatus.do) is highly unsatisfying. Until the work authorization is approved (or God forbid rejected / put on hold for additional evidence), one is faced with rather useless description that reads something like this:


‘On November 16, 2017, we received your Form I-765, Application for Employment Authorization , Receipt Number YSC**********, and sent you the receipt notice that describes how we will process your case. Please follow the instructions in the notice. If you do not receive your receipt notice by March 23, 2016, please call Customer Service at 1-800-375-5283. If you move, go to www.uscis.gov/addresschange to give us your new mailing address.’


USCIS does a really bad job of keeping one updated on the progress of a case and in general how far along they are going with the entire year’s batch of students.

## Predicting decision time

Fortunately, USCIS issues receipt numbers in *chronological order*, and they process their cases in a *first-come-first serve* order. That means if we check other people's case status, *we will be able to get an estimate time of case decision*:

* If a huge proportion of people before (and possibly after) me have their OPTs approved, I should have mine processed soon.
* However, if the people who submitted around my date are stil waiting for their approval, I can expect to wait a long time.


However, doing so manually at [https://egov.uscis.gov/casestatus/mycasestatus.do](https://egov.uscis.gov/casestatus/mycasestatus.do) is a slow and tiring process. Instead, I can write a script to "scrape" the website for the 50,000 or so cases before and after my own number.


## Result

```
E:\github\EAD-AutoQuery>python app.py
New column '2018119_1350' added
YSC1890004628 ,   ,  Card Was Mailed To Me
INSERT INTO data (caseid, form, valid, `2018119_1350`) VALUES ('YSC1890004628', '', '1', 'Card Was Mailed To Me')
YSC1890006628 ,   ,  Card Was Mailed To Me
INSERT INTO data (caseid, form, valid, `2018119_1350`) VALUES ('YSC1890006628', '', '1', 'Card Was Mailed To Me')
YSC1890008628 ,  I-765 ,  Request for Initial Evidence Was Mailed
INSERT INTO data (caseid, form, valid, `2018119_1350`) VALUES ('YSC1890008628', 'I-765', '1', 'Request for Initial Evidence Was Mailed')
YSC1890010628 ,   ,  Card Was Mailed To Me
INSERT INTO data (caseid, form, valid, `2018119_1350`) VALUES ('YSC1890010628', '', '1', 'Card Was Mailed To Me')
YSC1890012628 ,  I-130 ,  Case Was Received
INSERT INTO data (caseid, form, valid, `2018119_1350`) VALUES ('YSC1890012628', 'I-130', '1', 'Case Was Received')
YSC1890014628 ,   ,  Card Was Mailed To Me
INSERT INTO data (caseid, form, valid, `2018119_1350`) VALUES ('YSC1890014628', '', '1', 'Card Was Mailed To Me')
YSC1890016628 ,  I-130 ,  Case Was Received
INSERT INTO data (caseid, form, valid, `2018119_1350`) VALUES ('YSC1890016628', 'I-130', '1', 'Case Was Received')
YSC1890018628 ,   ,  Card Was Mailed To Me
INSERT INTO data (caseid, form, valid, `2018119_1350`) VALUES ('YSC1890018628', '', '1', 'Card Was Mailed To Me')
YSC1890020628 ,  Validation Error(s)<br/>You must correct the following error(s) before proceeding:
INSERT INTO data (caseid, form, valid, `2018119_1350`) VALUES ('YSC1890020628', '', '0', 'Validation Error(s)<br/>You must correct the following error(s) before proceeding:')
YSC1890022628 ,  I-130 ,  Case Was Received
INSERT INTO data (caseid, form, valid, `2018119_1350`) VALUES ('YSC1890022628', 'I-130', '1', 'Case Was Received')
```
