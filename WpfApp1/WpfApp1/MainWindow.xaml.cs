using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace WpfApp1
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        bool dev = true;

        SQLiteConnection sqlite = null;

        // WebClient should be sufficient for simple web requests
        WebClient web = new WebClient();
        Checker checkTask = new Checker();
        
        public MainWindow()
        {
            InitializeComponent();
        }


        protected override void OnContentRendered(EventArgs e)
        {
            base.OnContentRendered(e);
            // Check internet connection on start
            CheckInternet();
        }

        /// <summary>
        /// Check the Internet status on application startup
        /// </summary>
        private void CheckInternet()
        {
            // System.Threading.Thread.Sleep(1000);
            try
            {
                web.OpenRead("https://egov.uscis.gov/casestatus/landing.do");
                InternetStatus.Foreground = Brushes.ForestGreen;
                InternetStatus.Content = "√ Connected to USCIS";
                tb_CaseID.IsEnabled = true;
                tb_NextCases.IsEnabled = true;
                tb_PrevCases.IsEnabled = true;
                tb_Step.IsEnabled = true;
                btn_NewBatchCheck.IsEnabled = true;
                RefreshCond();
            }
            catch (Exception err)
            {
                InternetStatus.Foreground = Brushes.Red;
                InternetStatus.Content = "× Connection Failed";
                MessageBox.Show(err.Message);
            }
        }




        private void DevStateToggle(object sender, RoutedEventArgs e)
        {
            dev = !(bool)cb_DevToggle.IsChecked;
        }


        /// <summary>
        /// Post data to URI and return as a string
        /// </summary>
        /// <param name="uri"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        private string WebPost(string uri, Dictionary<string, string> param)
        {
            string HTML = "";
            try
            {
                string myParameters = "";
                foreach (KeyValuePair<string, string> i in param)
                {
                    if (myParameters != "") { myParameters += '&';  }
                    myParameters += i.Key + '=' + i.Value;
                }

                web.Headers[HttpRequestHeader.ContentType] = "application/x-www-form-urlencoded";
                HTML = web.UploadString(uri, myParameters);
            }
            catch (Exception err)
            {
                MessageBox.Show(err.Message);
                return "";
            }
            return HTML;
        }

        /// <summary>
        /// condition for query
        /// </summary>
        public class Checker
        {
            public string caseId;
            public string caseIdLetters;
            public int caseIdDigits;
            public int caseIdRangeStart;
            public int caseIdRangeEnd;
            public int step;
            public int cases;
            public List<string> caseIds = new List<string>();

            public void RefreshCondRange(int prevCases, int nextCases)
            {
                // construct case id borders
                caseIdRangeStart = caseIdDigits - prevCases;
                caseIdRangeEnd = caseIdDigits + nextCases;
                cases = (caseIdRangeEnd - caseIdRangeStart) / step;
            }
        }


        /// <summary>
        /// Every time the user changes some search condition, refresh the search object with new conditions
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void NewCond(object sender, RoutedEventArgs e)
        {
            RefreshCond();
        }

        private void RefreshCond()
        {
            // validate 3 int textboxes
            int prevCases = 0, nextCases = 0;
            try
            {
                prevCases = int.Parse(tb_PrevCases.Text);
                nextCases = int.Parse(tb_NextCases.Text);
                checkTask.step = int.Parse(tb_Step.Text);
            }
            catch (Exception err) { MessageBox.Show(err.ToString()); return; }

            if (checkTask.step % 2 > 0 && checkTask.step > 1 && checkTask.step % 5 > 0)
            {
                if (MessageBox.Show("You have entered an odd step value.\nIn the case that the case ID is" +
                    "incremented by an odd value greater than 1 but not a multiple of 5, you will very likely" +
                    "miss your case ID.\nDo you wish to proceed with this odd step value: " +
                    checkTask.step.ToString() + " ?", "Odd Step Warning",
                    MessageBoxButton.YesNo, MessageBoxImage.Warning) == MessageBoxResult.No)
                {
                    tb_Step.Foreground = Brushes.Red;
                    return;
                }
            }

            // validate case id
            if (tb_CaseID.Text.Length != 13)
            {
                MessageBox.Show("Invalid case ID!");
                return;
            }
            try
            {
                checkTask.caseIdDigits = int.Parse(tb_CaseID.Text.Substring(3));
            }
            catch (Exception err) { MessageBox.Show(err.ToString()); return; }

            // if all test passed
            checkTask.caseId = tb_CaseID.Text;
            checkTask.caseIdLetters = checkTask.caseId.Substring(0, 3);

            checkTask.RefreshCondRange(prevCases, nextCases);

            string str = "Check " + checkTask.cases.ToString() + " Case";
            if (checkTask.cases > 1) { str += 's'; }
            lb_CheckNCases.Content = str;

            lb_CaseIdStart.Content = checkTask.caseIdLetters + checkTask.caseIdRangeStart.ToString();
            lb_CaseIdEnd.Content = checkTask.caseIdLetters + checkTask.caseIdRangeEnd.ToString();
        }


        /// <summary>
        /// Create a Database with the user designated filename
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void CreateDatabase(object sender, RoutedEventArgs e)
        {

            FileDialog file = new SaveFileDialog
            {
                InitialDirectory = Directory.GetCurrentDirectory(),
                Filter = "SQLite Database (*.db, *.db3, *.sqlite, *.sqlite3)|*.db;*.db3;*.sqlite;*.sqlite3"
            };
            if (!(bool)file.ShowDialog())
            {
                return;
            }

            SQLiteConnection.CreateFile(file.FileName);
            sqlite = new SQLiteConnection("Data Source=" + file.FileName + ";Version=3;");
            sqlite.Open();
            string sql = @"
CREATE TABLE `data` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`caseid`	TEXT NOT NULL,
	`querydate`	TEXT,
	`form`	TEXT,
	`title`	TEXT,
	`content`	TEXT
); ";
            SQLiteCommand command = new SQLiteCommand(sql, sqlite);
            command.ExecuteNonQuery();
            sqlite.Close();

            // Open the database again for rw
            OpenDB(file.FileName);
        }

        /// <summary>
        /// Open a database with the user designated filename
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OpenDatabase(object sender, RoutedEventArgs e)
        {
            OpenFileDialog file = new OpenFileDialog
            {
                InitialDirectory = Directory.GetCurrentDirectory(),
                Filter = "SQLite Database (*.db, *.db3, *.sqlite, *.sqlite3)|*.db;*.db3;*.sqlite;*.sqlite3|Any Files (*.*)|*.*"
            };
            if (!(bool)file.ShowDialog())
            {
                return;
            }

            OpenDB(file.FileName);
        }


        private void OpenDB(string filename)
        {
            try
            {
                sqlite = new SQLiteConnection("Data Source=" + filename + ";Version=3;");
                sqlite.Open();
            }
            catch (Exception err)
            {
                MessageBox.Show(err.ToString());
                return;
            }

            string sql = "SELECT * FROM `data` ORDER BY caseid ASC, querydate ASC";
            SQLiteCommand command = new SQLiteCommand(sql, sqlite);
            SQLiteDataReader row = command.ExecuteReader();
            while (row.Read())
            {
                //MessageBox.Show(row["caseid"].ToString());
            }







        }


        private class Case
        {
            public string caseId;
            public string form;
            //                         querydate     title
            public List< KeyValuePair< string,       string >>
                records = new List<KeyValuePair<string, string>>();
        }

        List<Case> CaseList = new List<Case>();

        /// <summary>
        /// Check the status of one case ID
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void NewBatchCheck(object sender, RoutedEventArgs e)
        {
            if (sqlite == null) { MessageBox.Show("Open a Database before checking!"); return; }
            string uri = "";
            if (dev)
            {
                uri = "http://localhost/index.php";
            }
            else
            {
                uri = "https://egov.uscis.gov/casestatus/mycasestatus.do";
            }

            string realCaseId = "";
            for (int caseId = checkTask.caseIdRangeStart; caseId < checkTask.caseIdRangeEnd; caseId += checkTask.step)
            {
                realCaseId = checkTask.caseIdLetters + caseId.ToString();
                checkTask.caseIds.Add(realCaseId);

                string sql = "SELECT * FROM `data` WHERE caseid = '" + realCaseId + "'";
                SQLiteCommand command = new SQLiteCommand(sql, sqlite);
                SQLiteDataReader row = command.ExecuteReader();
                if (!row.Read())
                {
                    Console.WriteLine("Creating New Entry");
                    sql = "INSERT INTO `data` (caseid) VALUES (@caseId)";
                    command = new SQLiteCommand(sql, sqlite);
                    command.Parameters.AddWithValue("caseId", realCaseId);
                    command.ExecuteNonQuery();
                }
            }

            string data = "";
            foreach (string caseId in checkTask.caseIds)
            {
                Dictionary<string, string> param = new Dictionary<string, string>
                {
                    { "appReceiptNum", caseId }
                };
                data = WebPost(uri, param);

                if (data != "")
                {
                    Console.WriteLine(data);
                }
            }


        }




    }
}
