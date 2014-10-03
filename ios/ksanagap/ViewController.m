//
//  ViewController.m
//  ksanagap
//
//  Created by Hsiao Allen on 10/1/14.
//  Copyright (c) 2014 Hsiao Allen. All rights reserved.
//

#import "ViewController.h"
#import <JavaScriptCore/JavaScriptCore.h>

@protocol DemoJSExports <JSExport>
-(void)jsLog:(NSString*)msg;
@end


@interface ViewController () <UIWebViewDelegate> {
    UIWebView *theWebView;
}

@property (nonatomic, readwrite, strong) JSContext *js;

@end

@implementation ViewController
            
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    UIButton *refreshButton = [[UIButton alloc] initWithFrame:CGRectMake(self.view.bounds.size.width - 44 - 20, 20, 44, 44)];
    [refreshButton setImage:[UIImage imageNamed:@"refresh.png"] forState:UIControlStateNormal];
    [refreshButton addTarget:self action:@selector(refresh) forControlEvents:UIControlEventTouchDown];
    [self writeFile:@"index" withExt:@"html"];
    [self writeFile:@"build" withExt:@"js"];
    [self writeFile:@"test" withExt:@"txt"];
    theWebView = [[UIWebView alloc] initWithFrame:self.view.bounds];
    theWebView.delegate = self;
//    [webView loadHTMLString:@"<html><h1> hello string </h1></html>" baseURL:nil];
//    NSString *htmlFile = [[NSBundle mainBundle] pathForResource:@"index" ofType:@"html" inDirectory:nil];
    
    NSData *htmlData = [self readFile:@"index.html"];
    [theWebView loadData:htmlData MIMEType:@"text/html" textEncodingName:@"UTF-8" baseURL:[NSURL URLWithString:@""]];
    self.js = [theWebView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
    [self injectJavascriptFunctions:self.js];
    [self.view addSubview:theWebView];
    [self.view addSubview:refreshButton];
}

- (void)injectJavascriptFunctions:(JSContext *)js {
    js[@"ios_readFileSync"] = ios_readFileSync;
    js[@"ios_readBuffer"] = ios_readBuffer;
    js[@"log"] = logme;
}
int GlobalInt = 1000;

int (^getGlobalInt)(void) = ^{ return GlobalInt; };
void (^logme)(NSString *) = ^(NSString *string){
    NSLog(@"%@", string);
};

NSString *(^ios_readBuffer)(NSString *, int, int) = ^(NSString *fullname, int start, int size) {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *file = [documentsDirectory stringByAppendingPathComponent:fullname];
    
    NSFileHandle *fileHandle = [NSFileHandle fileHandleForReadingAtPath:file];
    [fileHandle seekToFileOffset:start];
    NSData *inputData = [fileHandle readDataOfLength:size];
    NSString *contentString = [[NSString alloc] initWithData:inputData encoding:NSUTF8StringEncoding];
    return contentString;
};

NSString *(^ios_readFileSync)(NSString *) = ^(NSString *fullname) {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *file = [documentsDirectory stringByAppendingPathComponent:fullname];
    NSData *content = [NSData dataWithContentsOfFile:file];
    NSString *contentString = [[NSString alloc] initWithData:content encoding:NSUTF8StringEncoding];
    return contentString;
};

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)writeFile:(NSString *)filename withExt:(NSString *)ext {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSError *error;
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    
    NSString *txtPath = [documentsDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.%@", filename, ext]];
    
    if ([fileManager fileExistsAtPath:txtPath] == YES) {
        [fileManager removeItemAtPath:txtPath error:&error];
    
        NSString *resourcePath = [[NSBundle mainBundle] pathForResource:filename ofType:ext];
        [fileManager copyItemAtPath:resourcePath toPath:txtPath error:&error];
    }
}

- (NSData *)readFile:(NSString *)fullname {
//    NSFileManager *fileManager = [NSFileManager defaultManager];
//    NSError *error;
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *htmlFile = [documentsDirectory stringByAppendingPathComponent:fullname];
    return [NSData dataWithContentsOfFile:htmlFile];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    [self reloadView:webView];
    // ...
}

- (void)reloadView:(UIWebView *)webView {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *jsFilePath = [documentsDirectory stringByAppendingPathComponent:@"build.js"];
    NSURL *jsURL = [NSURL fileURLWithPath:jsFilePath];
    NSString *javascriptCode = [NSString stringWithContentsOfFile:jsURL.path encoding:NSUTF8StringEncoding error:nil];
    [webView stringByEvaluatingJavaScriptFromString:javascriptCode];
}

// helper method
- (void)refresh {
    [self reloadView:theWebView];
}

@end
