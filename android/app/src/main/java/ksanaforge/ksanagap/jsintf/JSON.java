package ksanaforge.ksanagap.jsintf;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JSON {
    private static final Pattern PAT_INTEGER = Pattern.compile("[-+]?[0-9]+|0[Xx][0-9]+");
    private static final Pattern PAT_DOUBLE = Pattern.compile("[+-]?[0-9]+([Ee][+-]?[0-9]+)?|[+-]?[0-9]*\\.[0-9]*([Ee][+-]?[0-9]+)?");
    private static final Pattern PAT_STRING = Pattern.compile("\"([^\\\\]+\\\\[\"'\\\\])*[^\"]*\"|'([^\\\\]+\\\\[\"'\\\\])*[^']*'");
    private static final Pattern PAT_BOOL = Pattern.compile("(true)|(false)");

    private static Object parse(String s, int[] start,
        Matcher integerMatcher, Matcher doubleMatcher, Matcher stringMatcher, Matcher booleanMatcher) throws JSONException {
        Log.d("start ","%d"+start[0] );
        char[] c = s.toCharArray();
        skipSpace(s, start);
        if (c[start[0]] == '[') {
            start[0]++;
            ArrayList<Object> a = new ArrayList<Object>();
            if (c[start[0]] == ']') {
                start[0]++;
                return a;
            }
            while (true) {
                a.add(parse(s, start, integerMatcher, doubleMatcher, stringMatcher, booleanMatcher));
                boolean crlf = skipSpace(s, start);
                char p = c[start[0]];
                if (p == ']') {
                    start[0]++;
                    return a;
                }
                if (p == ',')
                    start[0]++;
                else if (!crlf)
                    throw new IllegalStateException(", or ] expected");
            }
        } else if (c[start[0]] == '{') {
            start[0]++;
            JSONObject a = new JSONObject();
            while (true) {
                String field = (String) parse(s, start, integerMatcher, doubleMatcher, stringMatcher, booleanMatcher);
                boolean crlf = skipSpace(s, start);
                if (c[start[0]] == ':') {
                    start[0]++;
                    Object obj=parse(s, start, integerMatcher, doubleMatcher, stringMatcher, booleanMatcher);
                    a.put(field, obj);
                    crlf = skipSpace(s, start);
                } else
                    a.put(field, "");
                char p = c[start[0]];
                if (p == '}') {
                    start[0]++;
                    return a;
                }
                if (p == ',')
                    start[0]++;
                else if (!crlf)
                    throw new IllegalStateException(", or } expected at " + start[0]);
            }
        }
        if (integerMatcher.find(start[0])) {
            String sub = match(start, s, integerMatcher);
            if (sub != null) return Integer.valueOf(sub);
        }
        if (doubleMatcher.find(start[0])) {
            String sub = match(start, s, doubleMatcher);
            if (sub != null) return Double.valueOf(sub);
        }
        if (stringMatcher.find(start[0])) {
            String sub = match(start, s, stringMatcher);
            if (sub != null) return sub.substring(1, sub.length() - 1);
        }
        if (booleanMatcher.find(start[0])) {
            String sub = match(start, s, booleanMatcher);
            if (sub != null) return Boolean.valueOf(sub);
        }

        return null;
        //throw new IllegalStateException("unexpected end of data");
    }

    private static String match(int[] start, String s, Matcher matcher) {
        int ms = matcher.start();
        int me = matcher.end();
        if (start[0] == ms) {
            start[0] = me;
            return s.substring(ms, me);
        }
        return null;
    }

    public static boolean skipSpace(String s, int[] start) {
        boolean ret = false;
        while (true) {
            char c = s.charAt(start[0]);
            boolean crlf = (c == '\r') || (c == '\n');
            if ((c != ' ') && !crlf)
                break;
            if (crlf)
                ret = true;
            start[0]++;
        }
        return ret;
    }

    public static  JSONObject parse(String json) {
        Matcher integerMatcher = PAT_INTEGER.matcher(json);
        Matcher doubleMatcher = PAT_DOUBLE.matcher(json);
        Matcher stringMatcher = PAT_STRING.matcher(json);
        Matcher booleanMatcher = PAT_BOOL.matcher(json);
        //noinspection unchecked
        int[] start = new int[]{0};
        JSONObject res=null;
        try {
            res = (JSONObject) parse(json, start, integerMatcher, doubleMatcher, stringMatcher, booleanMatcher);
        } catch (IllegalStateException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return res;
    }
    public static String stringify(Object item){
        String out="";
        if (item instanceof JSONObject) {
            out+=stringify((JSONObject)item);
        } else if (item instanceof JSONArray) {
            out+=stringify((JSONArray)item);
        } else if (item instanceof ArrayList) {
            out+=stringify((ArrayList)item);
        } else if (item instanceof String) {
            out+="\""+item.toString()+"\"";
        } else if (item instanceof Integer) {
            out+=item.toString();
        }
        return out;
    }
    public static String stringify(JSONObject obj) {
        Iterator<String> keys = obj.keys();
        String out="";
        while(keys.hasNext()) {
            Object item= null;
            String key=keys.next();
            try {
                item = obj.get(key);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            if (out.length()>0) out+=",";
            out+=  '\"'+key+"\":"+stringify(item);
        }
        return "{"+out+"}";
    }
    public static String stringify(JSONArray arr) {
        String out="[";
        for (int i=0;i<arr.length();i++) {
            try {
                out+=stringify(arr.get(i));
                if (i<arr.length()-1) out+=",";
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        out+="]";
        return out;
    }
    public static String stringify(ArrayList arr) {
        String out="[";
        for (int i=0;i<arr.size();i++) {
            out+=stringify(arr.get(i));
            if (i<arr.size()-1) out+=",";
        }
        out+="]";
        return out;
    }
}