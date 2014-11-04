//
//  ViewController.m
//  ksanagap
//
//  Created by Hsiao Allen on 10/1/14.
//  Copyright (c) 2014 Hsiao Allen. All rights reserved.
//

#import "ViewController.h"
#import <JavaScriptCore/JavaScriptCore.h>
#import "fs_ios.h"
#import "kfs_ios.h"
#import "ksanagap_ios.h"


@interface ViewController () <UIMyWebViewDelegate> {
    UIWebView *webView;
    UIToolbar *toobar;
    UIBarButtonItem *menuButton;
    NSArray *buttons;
    NSArray *directories;
}

@property (nonatomic, readwrite, strong) JSContext *js;
@end

kfs_ios *kfs;
fs_ios *fs;
ksanagap_ios *ksanagap;
int TOOLBARH=44;
@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    webView = [[UIWebView alloc] initWithFrame:CGRectOffset(self.view.frame, 0, TOOLBARH)];
    webView.delegate = self;
    
    toobar = [[UIToolbar alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, TOOLBARH)];
    
    buttons = [self readDir];
    NSMutableArray *mutArray = [[NSMutableArray alloc] init];
    for (int i = 0; i < [buttons count]; i++) {
        UIBarButtonItem *button = [[UIBarButtonItem alloc] initWithTitle:buttons[i] style:UIBarButtonItemStylePlain target:self action:@selector(buttonTapped:)];
        button.tag = i;
        mutArray[i] = button;
    }
    toobar.items = mutArray;
    [self.view addSubview:webView];
    [self.view addSubview:toobar];
    [self loadApps];
    
    fs = [[fs_ios alloc] init];
    kfs= [[kfs_ios alloc] init];
    ksanagap= [[ksanagap_ios alloc] init];
    [ksanagap setViewController:self];
    [kfs setViewController:self];
    
    
    long idx=[directories indexOfObject:@"installer"];
    if (idx==-1) {
        //setup Installer
    } else {
        if ([directories count] > 0) {
            NSString *url;
            //NSString *downloadlink=[[NSUserDefaults standardUserDefaults] objectForKey:@"downloadlink"];
            //if (downloadlink.length) {
            //    url=[NSString stringWithFormat:@"%@#%@",directories[idx],downloadlink];
            //} else {
                url=directories[idx];
            //}
            [self loadHomepage:url];
        }
    }
    
}

-(void) loadApps {
    directories = [self readDir];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (NSArray *)readDir {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSError *error;
    
    NSString *stringPath = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)objectAtIndex:0]stringByAppendingPathComponent:@""];
    
    NSArray *subFolders = [fileManager contentsOfDirectoryAtURL:[NSURL URLWithString:stringPath] includingPropertiesForKeys:@[] options:NSDirectoryEnumerationSkipsHiddenFiles error:&error];
    NSMutableArray *dirs = [[NSMutableArray alloc] init];
    for (int i = 0; i < [subFolders count]; i++) {
        NSString *urlString = [subFolders[i] absoluteString];
        urlString = [urlString substringWithRange:NSMakeRange(0, urlString.length - 1)];
        NSRange range = [urlString rangeOfString:@"/" options:NSBackwardsSearch];
        NSRange newRange = NSMakeRange(range.location + range.length, [urlString length] - range.location -1);
        dirs[i] = [urlString substringWithRange:newRange];
    }
    
    return dirs;
}
- (void)buttonTapped:(UIBarButtonItem *)button {
    [self loadHomepage:directories[button.tag]];
}

- (void)loadHomepage:(NSString *)app_hash {
    NSString *appName;
    NSString *hashtag;
    
    NSRange hash=[app_hash rangeOfString:@"#"];
    if (hash.location==NSNotFound) {
        appName=app_hash;
        hashtag=@"";
    } else {
        appName=[app_hash substringToIndex:hash.location];
        hashtag=[app_hash substringFromIndex:hash.location];
    }
    
    [kfs setRoot:appName],[fs setRoot:appName];

    [[NSURLCache sharedURLCache] removeAllCachedResponses];
    
    //NSString *html = [NSString stringWithContentsOfFile:htmlFile encoding:NSUTF8StringEncoding error:&error];
    if (webView) {
        [webView removeFromSuperview];
        webView = [[UIWebView alloc] initWithFrame:CGRectOffset(self.view.frame, 0, TOOLBARH)];
        webView.delegate = self;
        [self.view addSubview:webView];
        
        [fs finalize], [kfs finalize]; //close all file handle
        
        JSContext *js = [webView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
        js[@"fs"]=fs;
        js[@"kfs"]=kfs;
        js[@"ksanagap"]=ksanagap;
    }
    
    NSString *baseURL = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0] stringByAppendingPathComponent:[NSString stringWithFormat:@"%@", appName]];
    
    NSString *indexhtml = [NSString stringWithFormat:@"%@%@", baseURL, @"/index.html" ];
    NSURL *indexhtmlurl= [NSURL fileURLWithPath:indexhtml];
    NSURL *indexhtmlurl_hash;
    if (hashtag.length) {
         indexhtmlurl_hash = [NSURL URLWithString:hashtag relativeToURL:indexhtmlurl];
    } else{
        indexhtmlurl_hash=indexhtmlurl;
    }

    NSURLRequest *htmlrequest = [NSURLRequest requestWithURL:indexhtmlurl_hash];
    
    [webView loadRequest:htmlrequest];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
}

- (BOOL) webView:(UIWebView*)inWeb shouldStartLoadWithRequest:(NSURLRequest *)inRequest navigationType:(UIWebViewNavigationType)navigationType{

    if ([inRequest.URL.scheme isEqualToString:@"http"]){
        [[UIApplication sharedApplication] openURL:[inRequest URL]];
        return NO;
    }
    return YES;
}
@end
