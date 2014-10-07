package ksanaforge.ksanagap.jsintf;

import android.webkit.JavascriptInterface;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.RandomAccessFile;
import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;
/**
 * Created by yapcheahshen on 2014/10/7.
 */
public class kfs_droid {
    class FilePointer { RandomAccessFile f; int id; String filename;}
    static Collection<FilePointer> filePointers = new ArrayList<FilePointer>();
    static int fid_count = 0;
    static String rootpath= "";
    public kfs_droid(){//Context c) {
        // mContext = c;
    }
    protected static FilePointer find_fp(int id) {
        for (FilePointer F : filePointers) if (F.id == id) return F;
        return null;
    }
    protected static FilePointer find_filename(String filename) {
        for (FilePointer F : filePointers) if (F.filename == filename) return F;
        return null;
    }
    public void setRootPath(String path){
        rootpath=path;
    }
    // Context mContext;


    @JavascriptInterface
    public void close(int fid) {
        FilePointer F = find_fp(fid);
        if (F!=null) {
            try {
                filePointers.remove(F);
                F.f.close();
            } catch (final Exception e) {

            };
        }
    }
    @JavascriptInterface
    public int open(String fname) {
        FilePointer F = find_filename(rootpath + fname);
        if (F!=null) return F.id;
        try {
            RandomAccessFile f = new RandomAccessFile(rootpath+fname, "r");
            F = new FilePointer();
            F.f=f;
            F.id = ++fid_count;
            filePointers.add(F);
        } catch (final Exception e) {
            return -1;
        };
        return F.id;
    }
    @JavascriptInterface
    public long getFileSize(int fid) {
        try {
            FilePointer F = find_fp(fid);
            return F.f.length();
        } catch (final Exception e) { return 0; }
    }

    protected byte[] readBytes (int fid, long pos, int sz) {
        byte[] b = new byte[sz];
        try{
            FilePointer F = find_fp(fid);
            F.f.seek(pos);
            F.f.read(b, 0, sz);
        } catch (final Exception e) { return null; }
        return b;
    }
    @JavascriptInterface
    public int readInt32 (int fid, long pos) {
        byte[] b=readBytes(fid, pos, 4);
        ByteBuffer wrapped=ByteBuffer.wrap(b);
        int i=wrapped.getInt();
        return i;
    }
    @JavascriptInterface
    public long readUInt32 (int fid, long pos) {
        return readInt32(fid, pos);//JAVA has no unsigned
    }

    @JavascriptInterface
    public short readUInt8 (int fid, long pos) {
        byte[] b=readBytes(fid, pos, 1);
        ByteBuffer wrapped=ByteBuffer.wrap(b);
        short v=(short)(wrapped.get(0));
        return v;
    }

    protected String nodejs2javaEncoding (String nodejsenc) {
        String enc = "UTF-8";
        if (nodejsenc.equals("ucs2")) enc = "UTF-16LE";
        return enc;
    }

    @JavascriptInterface
    public String readEncodedString (int fid, long pos, int sz, String encoding) {
        String enc=nodejs2javaEncoding(encoding);
        byte [] b=readBytes(fid, pos, sz);
        try{
            String s=new String(b,enc);
            return  s;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @JavascriptInterface
    public String readString (int fid, long pos, int sz) {
        byte [] b=readBytes(fid, pos, sz);
        try{
            String s = new String(b,"UTF-8");
            return s;
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }

    @JavascriptInterface
    public String readBuf (int fid, long pos, int sz) {
        byte[] b=readBytes(fid, pos, sz);
        String str=b.toString();
        return str;
    }
    protected long[] unpack_int (byte[] A, int count, boolean reset , int[] adv) {
        long B[] = new long[A.length];
        int a = 0, b = 0 , n=0;
        do {
            short S = 0;
            do {
                n += (A[a] & 0x7f) << S;
                S += 7;
                a++; if (a>=A.length) break;
            } while ( (A[a] & 0x80)!=0 );
            B[b++] = n;
            if (reset) n=0;
            count--;
        } while (a<A.length && count>0);
        long R[] = new long[b];
        adv[0]=a; //how many bytes read
        for (int i = 0; i < R.length; i++) R[i] = B[i];
        return R;
    }
    @JavascriptInterface
    public String readBuf_packedint (int fid, long pos, int blocksize, int count, boolean reset) {
        byte[] b=readBytes(fid, pos, blocksize);
        int[] adv= new int[1];
        long[] arr=unpack_int(b,count,reset,adv);
        String str=Arrays.toString(arr);
        String s=Integer.toString(adv[0]) + str; // javascript use parse Int to get the adv
        return s;
    }
    @JavascriptInterface
    public String readFixedArray (int fid, long pos, int count, int unitsz) {
        byte[] b=readBytes(fid, pos, count * unitsz);
        String str="";
        ByteBuffer wrapped=ByteBuffer.wrap(b);
        if (unitsz==1) {
            str=wrapped.toString();
        } else if (unitsz==2){
            str=wrapped.asShortBuffer().toString();
        } else if (unitsz==4){
            str=wrapped.asIntBuffer().toString();
        }
        return str;
    }
    @JavascriptInterface
    public String readStringArray (int fid, long pos, int sz, String encoding) {
        String s=readEncodedString(fid,pos,sz,encoding);
        s=s.replaceAll("\0","\uffff");
        return s;
    }

}
