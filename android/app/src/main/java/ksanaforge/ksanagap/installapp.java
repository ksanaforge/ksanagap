package ksanaforge.ksanagap;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Bundle;
import android.os.ParcelFileDescriptor;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;


public class installapp extends Activity {
    long jsondownloadid;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_installapp);
        Intent intent = getIntent();
        processUrl(intent.getData());

        IntentFilter filter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        registerReceiver(jsonReceiver, filter);
        //set filter to only when download is complete and register broadcast receiver

    }

    protected void download(String url,String targetfile) {
        DownloadManager downloadManager= (DownloadManager)getSystemService(DOWNLOAD_SERVICE);
        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
        request.setDestinationInExternalPublicDir("/accelon/yinshun/",targetfile);
        jsondownloadid=downloadManager.enqueue(request);
    }
    protected void processUrl(Uri uri) {
        String ksanajson=uri.toString().replaceAll("accelon:","http:")+"/ksana.json";
        download(ksanajson,"ksana.json");
    }

    private BroadcastReceiver jsonReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            DownloadManager downloadManager= (DownloadManager)getSystemService(DOWNLOAD_SERVICE);
            ParcelFileDescriptor file;
            int ch;
            StringBuffer strContent = new StringBuffer("");
            //check if the broadcast message is for our Enqueued download
            long referenceId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
            if (jsondownloadid == referenceId) {
                try {
                    file = downloadManager.openDownloadedFile(jsondownloadid);
                    FileInputStream fileInputStream = new ParcelFileDescriptor.AutoCloseInputStream(file);
                    while ((ch = fileInputStream.read()) != -1)
                        strContent.append((char) ch);

                    JSONObject responseObj = new JSONObject(strContent.toString());
                    Log.d("json",responseObj.toString());
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
    };


    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);//must store the new intent unless getIntent() will return the old one
        processUrl(intent.getData());
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.installapp, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
