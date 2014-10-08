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

@protocol DemoJSExports <JSExport>
-(void)jsLog:(NSString*)msg;
@end


@interface ViewController () <UIWebViewDelegate> {
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
@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    webView = [[UIWebView alloc] initWithFrame:CGRectOffset(self.view.frame, 0, 44)];
    webView.delegate = self;
    
    toobar = [[UIToolbar alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, 44)];
    
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
    
    if ([diretories count] > 0) [self loadHomepage:diretories[0]];
    fs = [[fs_ios alloc] init];

    kfs=[[kfs_ios alloc ] init ];

}
int GlobalInt = 1000;

int (^getGlobalInt)(void) = ^{ return GlobalInt; };
void (^logme)(NSString *) = ^(NSString *string){
    NSLog(@"%@", string);
};


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

NSNumber *(^ios_writeFileSync)(NSString *, NSString *, NSString *) = ^(NSString *fn, NSString *str, NSString *enc) {
    return [fs writeFileSync:fn str:str enc:enc];
};
NSString *(^ios_readFileSync)(NSString *, NSString *) = ^(NSString *fn, NSString *enc) {
    return [fs readFileSync:fn enc:enc];
};
NSString *(^ios_readSignature)(NSString *) = ^(NSString *par) {
    
    return [kfs readSignature:par];
};
- (void) fs_injectJavascriptInterface:(JSContext*) js  {
    js[@"ios_writeFileSync"]=ios_writeFileSync;
    js[@"ios_readFileSync"]=ios_readFileSync;
}


- (void) kfs_injectJavascriptInterface:(JSContext*) js  {
    js[@"ios_readSignature"]=ios_readSignature;
}

- (void)loadHomepage:(NSString *)appName {
    NSError* error;
    
    [kfs setRoot:appName],[fs setRoot:appName];
    
    NSString *baseURL = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0] stringByAppendingPathComponent:[NSString stringWithFormat:@"%@", appName]];
    
    NSString *htmlFile = [NSString stringWithFormat:@"%@%@", baseURL, @"/index.html"];
    
    baseURL = [baseURL stringByReplacingOccurrencesOfString:@"/" withString:@"//"];
    baseURL = [baseURL stringByReplacingOccurrencesOfString:@" " withString:@"%20"];
    
    baseURL = [NSString stringWithFormat:@"file:/%@//", baseURL];
    
    NSString *html = [NSString stringWithContentsOfFile:htmlFile encoding:NSUTF8StringEncoding error:&error];
    if (webView) {
        [webView removeFromSuperview];
        webView = [[UIWebView alloc] initWithFrame:CGRectOffset(self.view.frame, 0, 44)];
        webView.delegate = self;
        [self.view addSubview:webView];
        JSContext *js = [webView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
        
        [self kfs_injectJavascriptInterface:js];
        [self fs_injectJavascriptInterface:js];
    }
    
    [webView loadHTMLString:html baseURL:[NSURL URLWithString:baseURL]];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
}


@end
