using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
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
        // WebClient should be sufficient for simple web requests
        private WebClient web = new WebClient();

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
            try
            {
                web.OpenRead("https://egov.uscis.gov/casestatus/landing.do");
                InternetStatus.Foreground = Brushes.ForestGreen;
                InternetStatus.Content = "√ Internet Connected";
            }
            catch (Exception err)
            {
                InternetStatus.Foreground = Brushes.Red;
                InternetStatus.Content = "× Internet Disconnected";
                MessageBox.Show(err.Message);
            }
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
        /// Check the status of one case ID
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void CheckStatus(object sender, RoutedEventArgs e)
        {
            string caseId = "YSC1890044628";
            // localhost dev
            string uri = "http://localhost";
            // real deal
            //string uri = "https://egov.uscis.gov/casestatus/mycasestatus.do";
            Dictionary<string, string> param = new Dictionary<string, string>
            {
                { "appReceiptNum", caseId }
            };

            string data = WebPost(uri, param);
            if (data != "")
            {
                MessageBox.Show(data);

            }
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
            SQLiteConnection sqlite = new SQLiteConnection("Data Source="+file.FileName+";Version=3;");
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
                Filter = "SQLite Database (*.db, *.db3, *.sqlite, *.sqlite3)|*.db;*.db3;*.sqlite;*.sqlite3"
            };
            if (!(bool)file.ShowDialog())
            {
                return;
            }

            try
            {
                SQLiteConnection sqlite = new SQLiteConnection("Data Source=" + file.FileName + ";Version=3;");
                sqlite.Open();
            }
            catch(Exception err)
            {
                MessageBox.Show(err.ToString());
            }
        }

    }
}
