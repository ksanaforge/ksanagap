package ksanaforge.ksanagap;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

// receive install request and switch to main activity immediately
public class installapp extends Activity {
    private long jsondownloadid=0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_installapp);
        Intent intent = getIntent();
        processUrl(intent.getData());
    }
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);//must store the new intent unless getIntent() will return the old one
        processUrl(intent.getData());
    }
    protected void processUrl(Uri uri) {
        Intent intent = new Intent(getApplicationContext(), mainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.putExtra("installapp",uri.toString());
        startActivity(intent);
        finish();
    }
}
