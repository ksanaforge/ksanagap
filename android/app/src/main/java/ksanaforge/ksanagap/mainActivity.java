package ksanaforge.ksanagap;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.ParcelFileDescriptor;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebView;
import android.os.Environment;
import ksanaforge.ksanagap.jsintf.*;
import android.os.Build;


import static ksanaforge.ksanagap.R.layout.activity_main;
import java.io.File;
import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


public class mainActivity extends Activity {
    private String ksanapath;
    final ksanagap_droid ksanagap_api= new ksanagap_droid();//this);
    protected String[] dirs=null;
    protected WebView wv;
    //  final console_droid console_api= new console_droid();//this);  //already have in 4.4
    String installerpath="";
    public String getKsanapath() {
        return ksanapath;
    }
    public WebView getWebView() {
        return wv;
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(activity_main);
        installerpath= Environment.getExternalStorageDirectory() +"/"+this.getString(R.string.app_rootpath)+"/installer/";

        wv=(WebView)findViewById(R.id.webview);
        initWebview(wv);
        ksanagap_api.activity=this;
        ksanagap_api.kfs_api.activity=this;

        loadApps();

        Bundle extras = getIntent().getExtras();
        String installurl="";
        if (extras!=null) {
            installurl=extras.getString("installapp");
            if (!installurl.isEmpty()) installurl="#installfrom="+installurl;
        }

        if (dirs==null)  welcome();
        else {
            List list=Arrays.asList(dirs);
            if (!list.contains("installer")) {
                welcome();
            }  else {

                if (installer.newer(getAssets(),installerpath) ) {
                    welcome();
                }  else {
                    int i=list.indexOf("installer");
                    ksanagap_api.switchApp(dirs[i]+installurl);

                }
            }
        }

        IntentFilter filter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        registerReceiver(jsonReceiver, filter);
    }

    public void loadApps()  {
        dirs=getAppDirs();
    }
    public String[] getDirs() {
        return dirs;
    }
    private BroadcastReceiver jsonReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            DownloadManager downloadManager= (DownloadManager)getSystemService(DOWNLOAD_SERVICE);

            ArrayList<Long> downloads=ksanagap_api.downloads;
            StringBuffer strContent = new StringBuffer("");
            //check if the broadcast message is for our Enqueued download
            long referenceId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
            int idx=downloads.indexOf(referenceId);
            long size=0;
            String filename="";
            if (idx>-1) {
                long downloadid=downloads.get(idx);
                downloads.remove(idx);
                if (downloads.size()==0) {
                    ksanagap_api.finish();
                    runOnUiThread(new Runnable() {
                        public void run() {
                            loadApps();
                        }
                    });
                }
                try {
                    //ParcelFileDescriptor file = downloadManager.openDownloadedFile(downloadid);
                    filename=downloadManager.getUriForDownloadedFile(downloadid).toString().replace("file://","");

                    /*
                    DownloadManager.Query q = new DownloadManager.Query();
                    q.setFilterById(downloadid);
                    Cursor c = downloadManager.query(q);
                    String filePath = c.getString(c.getColumnIndex(DownloadManager.COLUMN_LOCAL_FILENAME));
                    */
                    Log.d("ksanagap", "temp file" + filename);

                    //} catch (FileNotFoundException e) {
                    //    e.printStackTrace();
                    //} catch (IOException e) {
                    //    e.printStackTrace();
                }finally{

                }

                Log.d("ksanagap","filename"+ filename+" size "+size);
            }
        }
    };
    protected void initWebview(WebView myWebView) {
        //MyWebView myWebView = (MyWebView) findViewById(R.id.webview);
        myWebView.getSettings().setDomStorageEnabled(true);
        myWebView.getSettings().setJavaScriptEnabled(true);
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        myWebView.addJavascriptInterface(ksanagap_api, "ksanagap");
        //myWebView.addJavascriptInterface(console_api, "console");
        myWebView.addJavascriptInterface(ksanagap_api.fs_api, "fs"); //node compatible interface
        myWebView.addJavascriptInterface(ksanagap_api.kfs_api, "kfs"); //for kdb
    }
    public void welcome() {
        try {
            installer.copySelf(getAssets(),installerpath);
            loadApps();
            ksanagap_api.switchApp("installer");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        createAppMenu(menu);
        return true;
    }
    protected String[] getAppDirs() {
        ksanapath= Environment.getExternalStorageDirectory() +"/"+ this.getString(R.string.app_rootpath)+"/";
        ksanagap_api.ksanapath=ksanapath;
        File file=new File(ksanapath);
        if (file.exists()) {
            String[] directories = file.list(new FilenameFilter() {
                @Override
                public boolean accept(File current, String name) {
                    return name.charAt(0)!='.' && new File(current, name).isDirectory();
                }
            });
            return directories;
        }
        return null;
    }
    private int APPITEMSTART=100;
    protected void createAppMenu(Menu menu) {
        for (int i=0;i<dirs.length;i++) {
            menu.add(Menu.NONE, i+APPITEMSTART, Menu.NONE, dirs[i]);
        }
    }
    protected void gotoApp(int id){
        String appname=dirs[id-APPITEMSTART];
        ksanagap_api.switchApp(appname);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        gotoApp(id);
        return super.onOptionsItemSelected(item);
    }

    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);//must store the new intent unless getIntent() will return the old one
        String installurl=intent.getStringExtra("installapp");

        //processUrl(intent.getData());
    }

    @Override
    protected void onDestroy() {
        // TODO Auto-generated method stub
        super.onDestroy();
        unregisterReceiver(jsonReceiver);
    }
}