## EAD-AutoQuery

* **Work In Progress!**

### Unsatisfying USCIS Case Status System

Students under the F-1 visa usually apply for Optional Practical Training (OPT) to get work authorization from US Citizenship and Immigration Services (USCIS). When one application is received by the USCIS, they issue a receipt number. Using this receipt number to check one’s progress (at https://egov.uscis.gov/casestatus/mycasestatus.do) is highly unsatisfying. The application usually takes up to 4 months to process. Until the work authorization is approved, students will only get a somewhat useless paragraph like this:

> On November 16, 2017, we received your Form I-765, Application for Employment Authorization , Receipt Number YSC1890044628, and sent you the receipt notice that describes how we will process your case. Please follow the instructions in the notice. If you do not receive your receipt notice by December 16, 2017, please call Customer Service at 1-800-375-5283. If you move, go to www.uscis.gov/addresschange to give us your new mailing address.

And nothing more. No estimate time. No queue information. No current status. USCIS does a really bad job of keeping one updated on the progress of a case and in general how far along they are going with the entire year’s batch of students.

### Predicting decision time

Fortunately, USCIS issues receipt numbers in *chronological order*, and they process their cases in a *first-come-first serve* order. That means if we check other people's case status, *we will be able to get an estimate time of case decision*:

* If a huge proportion of people before (and possibly after) me have their OPTs approved, I should have mine processed soon.
* However, if the people who submitted around my date are stil waiting for their approval, I can expect to wait a long time.

However, doing so manually at https://egov.uscis.gov/casestatus/mycasestatus.do is a slow and tiring process. Instead, I can write a script to check the website for the 50,000 or so cases before and after my own number.

### Python Version

The Python version is the first thing I come up with. It **works**, but soon I am tired of comparing the results in command line from different log files. I decide to create one with GUI. 

```
EAD-AutoQuery> python app.py
YSC1890008628 ,  I-765 ,  Request for Initial Evidence Was Mailed
YSC1890010628 ,   ,  Card Was Mailed To Me
YSC1890012628 ,  I-130 ,  Case Was Received
```

### C# Version

For practice purpose, I used C# .NET. **Abandoned**. Currently can scrape from USCIS website and dump desired data into the SQLite database. I was working on this one until USCIS blocked my IP after about 2,000 queries. Apparently a (or, actually, a few dozens of) proxy server is needed. Soon I moved on to the PHP version.

<img src="https://raw.githubusercontent.com/gentlespoon/EAD-AutoQuery/master/C%23/WpfApp1/2018-01-25-14-31-12.jpg" width="320" height="240">


### PHP Version

I am not planning any budget for this small project. Thus, deploying the C# application on VPS is not an option. There are not many free proxy server either, I do not trust those "free" proxies. So the only truly free solution seems to be those massive PHP hosting services available online. I am using 000webhost.

Thinking about multi-thread PHP scraper.
