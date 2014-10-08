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
    UIWebView *webView;
    UIToolbar *toobar;
    UIBarButtonItem *menuButton;
    NSArray *buttons;
    NSArray *diretories;
}

@property (nonatomic, readwrite, strong) JSContext *js;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    webView = [[UIWebView alloc] initWithFrame:CGRectOffset(self.view.frame, 0, 44)];
    webView.delegate = self;
    
    toobar = [[UIToolbar alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, 44)];
    menuButton = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemOrganize target:self action:@selector(menuButtonTapped)];
    
    UIBarButtonItem *flexableItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace target:self action:nil];
    
    buttons = [self readDir];
    NSMutableArray *mutArray = [[NSMutableArray alloc] init];
    for (int i = 0; i < [buttons count]; i++) {
        UIBarButtonItem *button = [[UIBarButtonItem alloc] initWithTitle:buttons[i] style:UIBarButtonItemStylePlain target:self action:@selector(buttonTapped:)];
        button.tag = i;
        mutArray[i] = button;
    }
    
    toobar.items = mutArray;
    
    //    [webView loadHTMLString:@"<html><h1> hello string </h1></html>" baseURL:nil];
    //    NSString *htmlFile = [[NSBundle mainBundle] pathForResource:@"index" ofType:@"html" inDirectory:nil];
    
    [self.view addSubview:webView];
    [self.view addSubview:toobar];
    diretories = [self readDir];
    if ([diretories count] > 0) [self loadHomepage:diretories[0]];
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
    
    //    if ([fileManager fileExistsAtPath:txtPath] == YES) {
    //        [fileManager removeItemAtPath:txtPath error:&error];
    //
    //        NSString *resourcePath = [[NSBundle mainBundle] pathForResource:filename ofType:ext];
    //        [fileManager copyItemAtPath:resourcePath toPath:txtPath error:&error];
    //    }
    if ([fileManager fileExistsAtPath:txtPath] == NO) {
        //copy from resource to user App Documents folder if not file there
        NSString *resourcePath = [[NSBundle mainBundle] pathForResource:filename ofType:ext];
        [fileManager copyItemAtPath:resourcePath toPath:txtPath error:&error];
    }
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
    
    //    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    //    NSString *documentsDirectory = [paths objectAtIndex:0];
    //    NSString *htmlFile = [documentsDirectory stringByAppendingPathComponent:fullname];
    //    return [NSData dataWithContentsOfFile:htmlFile];
    return dirs;
}

- (void)loadHomepage:(NSString *)appName {
    NSError* error;
    
    NSString *baseURL = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0] stringByAppendingPathComponent:[NSString stringWithFormat:@"%@", appName]];
    
    NSString *htmlFile = [NSString stringWithFormat:@"%@%@", baseURL, @"/index.html"];
    
    baseURL = [baseURL stringByReplacingOccurrencesOfString:@"/" withString:@"//"];
    baseURL = [baseURL stringByReplacingOccurrencesOfString:@" " withString:@"%20"];
    
    baseURL = [NSString stringWithFormat:@"file:/%@//", baseURL];
    
    NSString *html = [NSString stringWithContentsOfFile:htmlFile encoding:NSUTF8StringEncoding error:&error];
    //    NSString* path = [[NSBundle mainBundle] pathForResource:@"index" ofType:@"html"];
    [webView loadHTMLString:html baseURL:[NSURL URLWithString:baseURL]];
    
    
    //    NSData *htmlData = [self readFile:@"index.html"];
    //    [webView loadData:htmlData MIMEType:@"text/html" textEncodingName:@"UTF-8" baseURL:[NSURL URLWithString:@""]];
    self.js = [webView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
    [self injectJavascriptFunctions:self.js];
}

- (void)buttonTapped:(UIBarButtonItem *)button {
    [self loadHomepage:diretories[button.tag]];
}
@end
