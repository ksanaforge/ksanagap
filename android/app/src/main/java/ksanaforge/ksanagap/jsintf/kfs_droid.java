package ksanaforge.ksanagap.jsintf;

import android.util.Log;
import android.webkit.JavascriptInterface;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.RandomAccessFile;
import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Scanner;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import ksanaforge.ksanagap.jsintf.JSON;

/**
 * Created by yapcheahshen on 2014/10/7.
 */
public class kfs_droid {
    class FilePointer { RandomAccessFile f; int handle; String filename;}
    static Collection<FilePointer> filePointers = new ArrayList<FilePointer>();
    static int f_count = 0;
    static String rootpath= "";
    public kfs_droid(){//Context c) {
        // mContext = c;
    }
    protected static FilePointer find_fp(int handle) {
        for (FilePointer F : filePointers) if (F.handle == handle) return F;
        return null;
    }
    protected static FilePointer find_filename(String filename) {
        for (FilePointer F : filePointers) if (F.filename == filename) return F;
        return null;
    }
    public void setRootPath(String path){
        rootpath=path;
    }

    @JavascriptInterface
    public void close(int handle) { // close the file by file handle
        FilePointer F = find_fp(handle);
        if (F!=null) {
            try {
                filePointers.remove(F);
                F.f.close();
            } catch (final Exception e) {

            };
        }
    }
    @JavascriptInterface
    public int open(String fname) {  // open a file by name, check if the file already open
        FilePointer F = find_filename(rootpath + fname);
        if (F!=null) return F.handle;
        try {
            RandomAccessFile f = new RandomAccessFile(rootpath+fname, "r");
            F = new FilePointer();
            F.f=f;
            F.handle = ++f_count;
            filePointers.add(F);
        } catch (final Exception e) {
            return -1;
        };
        return F.handle;
    }
    @JavascriptInterface
    public long getFileSize(int handle) {
        try {
            FilePointer F = find_fp(handle);
            return F.f.length();
        } catch (final Exception e) { return 0; }
    }

    protected byte[] readBytes (int handle, long pos, int sz) {
        byte[] b = new byte[sz];
        try{
            FilePointer F = find_fp(handle);
            F.f.seek(pos);
            F.f.read(b, 0, sz);
        } catch (final Exception e) { return null; }
        return b;
    }
    @JavascriptInterface
    public int readInt32 (int handle, long pos) {
        byte[] b=readBytes(handle, pos, 4);
        ByteBuffer wrapped= ByteBuffer.wrap(b);
        int i=wrapped.getInt();
        return i;
    }
    @JavascriptInterface
    public long readUInt32 (int handle, long pos) {
        return readInt32(handle, pos);//JAVA has no unsigned
    }

    @JavascriptInterface
    public short readUInt8 (int handle, long pos) {
        byte[] b=readBytes(handle, pos, 1);
        ByteBuffer wrapped=ByteBuffer.wrap(b);
        short v=(short)(wrapped.get(0));
        return v;
    }

    @JavascriptInterface
    public String readULE16String (int handle, long pos, int sz) {
        byte [] b=readBytes(handle, pos, sz);
        try{
            String s=new String(b,"UTF-16LE");
            return  s;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @JavascriptInterface
    public String readUTF8String (int handle, long pos, int sz) {
        byte [] b=readBytes(handle, pos, sz);
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
    public String readBuf (int handle, long pos, int sz) {
        byte[] b=readBytes(handle, pos, sz);
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

        //for (int i = 0; i < R.length; i++) R[i] = B[i];
        System.arraycopy(B, 0, R, 0, b);
        return R;
    }
    @JavascriptInterface
    public String readBuf_packedint (int handle, long pos, int blocksize, int count, boolean reset) {
        byte[] b=readBytes(handle, pos, blocksize);
        int[] adv= new int[1];
        long[] arr=unpack_int(b,count,reset,adv);
        String str=Arrays.toString(arr);
        String s=Integer.toString(adv[0]) + str; // javascript use parse Int to get the adv
        return s;
    }
    @JavascriptInterface
    public String readFixedArray (int handle, long pos, int count, int unitsz) {
        byte[] b=readBytes(handle, pos, count * unitsz);
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
    public String readStringArray (int handle, long pos, int sz, String enc) {
        String s;
        if (enc.compareTo("utf8")==0) s=readUTF8String(handle,pos,sz);
        else             s=readULE16String(handle,pos,sz);
        
        s=s.replaceAll("\0","\uffff");
        return s;
    }
    protected int indexOfSorted (long[] array, long obj) {
        int low = 0, high = array.length-1;
        while (low < high) {
            int mid = (low + high) >> 1;
            if (array[mid] < obj) {
                low=mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    };

    protected long[] pland (long[] pl1, long[] pl2,int distance) {
        int swap = 0,rcount=0;
        if (pl1.length > pl2.length) { //swap for faster compare
            long[] t = pl2;
            pl2 = pl1;
            pl1 = t;
            swap = distance;
            distance = -distance;
        }
        long r[] = new long[pl2.length];
        for (int i = 0; i < pl1.length; i++) {
            int k = indexOfSorted(pl2, pl1[i] + distance);
            long hit=-1;
            if (pl2[k] == (pl1[i] + distance)) hit=k;
            if (hit > -1) r[rcount++]=(pl1[i] - swap);
        }
        long R[] = new long[rcount];
        System.arraycopy(r, 0, R, 0, rcount);
        return R;
    }
    protected long[] phraseSearch(ArrayList<long[]> postings){
        if (postings.size()==1) return postings.get(0);
        long []r=postings.get(0);
        for (int i=1;i<postings.size();i++) {
            r = pland(r, postings.get(i),i);
        }
        return r;
    }
    @JavascriptInterface
    public String mergePostings(int handle,String positions) throws JSONException {
        JSONArray blockpos= new JSONArray(positions);
        ArrayList<long[]> postings=new ArrayList<long[]>();
        for (int i=0;i<blockpos.length();i++) {
            JSONArray bpos=blockpos.getJSONArray(i);
            int pos=bpos.getInt(0);
            int blocksize=bpos.getInt(1);
            byte[] b=readBytes(handle, pos+1, blocksize-1);//skip signature
            int[] adv= new int[1];
            long[] arr=unpack_int(b,blocksize,false,adv);
            postings.add(arr);
        }
        long[] arr=phraseSearch(postings);
        String str=Arrays.toString(arr);
        return str;
    }

    protected String parentPath() {
        int last = rootpath.lastIndexOf("/");
        String path=rootpath.substring(0,last);
        last = path.lastIndexOf("/");
        return  path.substring(0,last+1);
    }
    @JavascriptInterface
    public String readDir(String path) {
        String out="";
        if (path==null) path=".";
        if (path.startsWith(".")){
            if (path.equals("..")) { //only allow listing parent
                path=parentPath();
            } else {
                path=rootpath;
            }
        } else {
            path=rootpath+path;
        }
        File f = new File(path);
        File files[] = f.listFiles();
        for (int i=0; i < files.length; i++) {
            out=out+files[i].getName()+"\uffff";
        }
        return out;
    }
    @JavascriptInterface
    public String listApps()  {

        String[] dirs=readDir("..").split("\uffff");
        File f=null;
        JSONArray array = new JSONArray();
        for (int i=0;i<dirs.length;i++) {
            String fn=parentPath()+dirs[i]+"/ksana.js";
            f= new File(fn);
            if (!f.exists()) continue;
            try {
                String content = new Scanner(new File(fn)).useDelimiter("\\Z").next();
                try {
                    content=content.substring(14,content.length()-1);
                    JSONObject obj=JSON.parse(content);
                    if (obj!=null){
                        obj.put("dbid",dirs[i]);
                        obj.put("path",dirs[i]);
                        array.put(obj);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }

        }
        String str= JSON.stringify(array);
        return str;
    }
}
