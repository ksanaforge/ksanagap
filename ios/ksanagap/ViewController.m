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
    NSArray *diretories;
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
    diretories = [self readDir];
    
    fs = [[fs_ios alloc] init];
    kfs= [[kfs_ios alloc] init];
    

    ksanagap= [[ksanagap_ios alloc] init];
    [ksanagap setViewController:self];
    
    
    long idx=[diretories indexOfObject:@"installer"];
    if (idx==-1) idx=0;
    
    if ([diretories count] > 0) [self loadHomepage:diretories[idx]];
    
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
    [self loadHomepage:diretories[button.tag]];
}

- (void)loadHomepage:(NSString *)appName {
    NSError* error;
    
    [kfs setRoot:appName],[fs setRoot:appName];
    
    NSString *baseURL = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0] stringByAppendingPathComponent:[NSString stringWithFormat:@"%@", appName]];
    
    NSString *htmlFile = [NSString stringWithFormat:@"%@%@", baseURL, @"/index.html"];
    
    baseURL = [baseURL stringByReplacingOccurrencesOfString:@"/" withString:@"//"];
    baseURL = [baseURL stringByReplacingOccurrencesOfString:@" " withString:@"%20"];
    
    baseURL = [NSString stringWithFormat:@"file:/%@//", baseURL];
    [[NSURLCache sharedURLCache] removeAllCachedResponses];
    
    NSString *html = [NSString stringWithContentsOfFile:htmlFile encoding:NSUTF8StringEncoding error:&error];
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
    
    [webView loadHTMLString:html baseURL:[NSURL URLWithString:baseURL]];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
}


@end
