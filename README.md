# USCIS Case Status BatchQuery

Currently I am busying with GRE, and I honestly do not have a lot of time working on this project.\
If you have some great ideas and would like me to add to this project, please feel free to start an issue and let me know.\
Also, PRs are more than welcome.

***

#### This may be considered as a Denial of Service attack to USCIS system!
#### You are responsible for all consequences of using this tool.
If you do not know what DoS means, or if you do not fully understand the risk, just keep away from this tool.

You have been warned!

Your IP may be blocked by USCIS if you send a lot of queries without using any proxy server.

> It was reported to us that your IP address or internet gateway has been locked out for a select period of time. This is due to an unusually high rate of use. In order to avoid this issue, please create a Customer account (single applicant) or a Representative account (representing many individuals).

Exact IP rate limits imposed by USCIS are not known (and may change at any time), but it is likely that both per-minute and longer-term limits are in place. As a rough guide *with no warranty of reliability*, as of mid-2019, 100 requests/minute appears to be acceptable over short time periods. However, sustaining this rate for more than 12 hours (72,000 requests over 12 hours) seems highly likely to trigger an IP ban. Initial IP bans typically last 24 hours, but of course USCIS may have authority to issue longer bans or more serious punishments. Again, **you use this tool at your own risk**.

***

## For DEVs

Start the application in debugging mode
```
$ npm start
```

Build
```
Windows
$ npm run electron:windows

Linux
$ npm run electron:linux

macOS - You will need a macOS computer to build for mac.
$ npm run electron:mac
```

***

## Ver. 2020.01 - Angular + Electron

- Allow import/export custom Case ID list.
- Better case list builder.
- Save results in IndexedDB.
- Removed account requirements.

![alt text](https://raw.githubusercontent.com/gentlespoon/USCIS-Case-Status-Checker/master/20200129-044214.jpg "Running in Windows, v2020.01.29")

***

## Ver. 2019.07 - Angular + Electron

- Added pause/resume.
- Optimized analyze algorithm.
- Allow save query configuration.
- Allow save results in localStorage.
- Allow export to CSV.
- Built for Windows, macOS, and Linux.

![alt text](https://raw.githubusercontent.com/gentlespoon/USCIS-Case-Status-Checker/master/20190711-224137.png "Running in Windows, v2019.07.11")


***

## Ver. 2019.02.02 - CrossPlatform Electron build

It has been one year since I applied for my OPT. Now I am waiting for my STEM OPT Extension. I think it is time to give this tool a refresh. This time, the refreshed application is created using [Node.js](https://nodejs.org/en/), and integrated GUI with [Electron.js](https://electronjs.org/).

Theoretically, the code should be able to run on all platforms. I am providing [x64 binaries for Windows and Linux](https://github.com/gentlespoon/USCIS-Case-BatchQuery/releases).

If you would like to run it on other platform, please take a look at [Electron Documentation](https://electronjs.org/docs/tutorial/application-distribution), they have detailed instructions on how to use their prebuilt binaries. There are some pre-built binaries for other platform available [here](https://github.com/electron/electron/releases).

Basically everything works just like before. Multi-threaded scraping. Just set up scrape controlling conditions and hit the Start button. The program will spawn several threads and start to check those USCIS Receipt Numbers. 

You will get:
* Form - Only available if USCIS explicitly says which category the case belongs to
* Case Status - A summary of current status
* Detailed Status - The original paragraph on USCIS result page
* Update Date - Date of last USCIS activity

Removed database related functions because they are simply ... worthless for this app.

![alt text](https://raw.githubusercontent.com/gentlespoon/USCIS-Case-BatchQuery/v2019.02/2019-02-03-15-36-01.png "Running in Ubuntu")


***
#### C#, Python, PHP+JS versions are still available in the v2018 branch

***

And the Old Story...

## Unsatisfying USCIS Case Status System

Students under the F-1 visa usually apply for Optional Practical Training (OPT) to get work authorization from US Citizenship and Immigration Services (USCIS). When one application is received by the USCIS, they issue a receipt number. Using this receipt number to check one’s progress (at https://egov.uscis.gov/casestatus/mycasestatus.do) is highly unsatisfying. The application usually takes up to 4 months to process. Until the work authorization is approved, students will only get a somewhat useless paragraph like this:

> On November 16, 2017, we received your Form I-765, Application for Employment Authorization , Receipt Number YSC1890044628, and sent you the receipt notice that describes how we will process your case. Please follow the instructions in the notice. If you do not receive your receipt notice by December 16, 2017, please call Customer Service at 1-800-375-5283. If you move, go to www.uscis.gov/addresschange to give us your new mailing address.

And nothing more. No estimate time. No queue information. No current status. USCIS does a really bad job of keeping one updated on the progress of a case and in general how far along they are going with the entire year’s batch of students.

### Predicting decision time

Fortunately, USCIS issues receipt numbers in *chronological order*, and they process their cases in a *first-come-first serve* order. That means if we check other people's case status, *we will be able to get an estimate time of case decision*:

* If a huge proportion of people before (and possibly after) me have their OPTs approved, I should have mine processed soon.
* However, if the people who submitted around my date are stil waiting for their approval, I can expect to wait a long time.

However, doing so manually at https://egov.uscis.gov/casestatus/mycasestatus.do is a slow and tiring process. Instead, I can write a script to check the website for the 50,000 or so cases before and after my own number.


