package ksanaforge.ksanagap.jsintf;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
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
}