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
            CheckInternet();    
            
        }

        private void CheckInternet()
        {
            // Check internet connection on start
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

        private string LoadUrl(string uri)
        {
            string HTML = "";
            try
            {
                string myParameters = "param1=value1&param2=value2&param3=value3";

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

        private void CheckStatus(object sender, RoutedEventArgs e)
        {

            string uri = "http://localhost";
            string data = LoadUrl(uri);
            if (data != "")
            {
                // MessageBox.Show(data);

            }
        }

        private void CreateDatabase(object sender, RoutedEventArgs e)
        {

            FileDialog file = new SaveFileDialog();
            file.InitialDirectory = Directory.GetCurrentDirectory();
            file.Filter = "SQLite Database (*.db, *.db3, *.sqlite, *.sqlite3)|*.db;*.db3;*.sqlite;*.sqlite3";
            //file.RestoreDirectory = true;
            if (!(bool)file.ShowDialog())
            {
                return;
            }

            SQLiteConnection.CreateFile(file.FileName);
        }

        private void OpenDatabase(object sender, RoutedEventArgs e)
        {
            OpenFileDialog openFileDialog1 = new OpenFileDialog();
            openFileDialog1.InitialDirectory = Directory.GetCurrentDirectory();
            openFileDialog1.Filter = "SQLite Database (*.db, *.db3, *.sqlite, *.sqlite3)|*.db;*.db3;*.sqlite;*.sqlite3";
            //openFileDialog1.RestoreDirectory = true;
            MessageBox.Show(openFileDialog1.ShowDialog().ToString());
        }
    }
}
