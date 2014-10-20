package ksanaforge.ksanagap;

/**
 * Created by yapcheahshen on 2014/10/20.
 */
import android.content.res.AssetManager;
import android.os.Environment;

import java.io.File;
import java.io.*;
import java.lang.Object;

public class installer {
    static public void copySelf(AssetManager assets) throws IOException {
        String installerpath= Environment.getExternalStorageDirectory() +"/ksanagap/installer/";
        String[] filenames = {"index.html","jquery.js","react-with-addons.js","build.css","build.js"};

        final File path = new File(installerpath);
        if (!path.exists()) path.mkdirs();

        for (int i=0;i<filenames.length;i++) {
            InputStream input=assets.open(filenames[i]);
            copy(input, installerpath+filenames[i]);
        }
    }
    static public void start() {

    }
    static void copy(InputStream in, String dst) throws IOException {
        OutputStream out = new FileOutputStream(dst);

        // Transfer bytes from in to out
        byte[] buf = new byte[1024];
        int len;
        while ((len = in.read(buf)) > 0) {
            out.write(buf, 0, len);
        }
        in.close();
        out.close();
    }
}
